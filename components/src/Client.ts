import { watch } from 'vue';
import { useWebSocket, type UseWebSocketOptions } from '@vueuse/core';
import { messageTypes, type MessageTypeMap } from './MessageTypeMap';

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type MessageTypeKey = keyof MessageTypeMap;

/**
 * A typed message with required 'type' property,
 * required to allow payload without a type value.
 *
 * Not 100% sure where it differs technically from TypedMessageOptional,
 * but it is necessary for types of overload to work properly.
 */
type TypedMessage<T extends MessageTypeKey> = MessageTypeMap[T] & {
  type?: T
};

/**
 * A typed message with optional 'type' property,
 * required to allow payload without a type value.
 *
 * Not 100% sure where it differs technically from TypedMessage,
 * but it is necessary for types of overload to work properly.
 */
type TypedMessageOptional<T extends MessageTypeKey> = MakeOptional<MessageTypeMap[T], 'type'>;

type MessageHandler<T extends MessageTypeKey> = (message: TypedMessage<T>) => void;
type MessageHandlerAny = MessageHandler<MessageTypeKey>[];

type MessageHandlerStopHandle = () => void;

export type UseWebSocketClientOptions = {
  url: string
  websocketOptions?: UseWebSocketOptions
};

export const WebSocketClientErrors = {
  MISSING_TYPE: 'Invalid or missing type.',
  MISSING_LISTENER: 'No listeners registered for message.',
  SERIALIZE_FAILED: 'Failed to serialize message.',
  DESERIALIZE_FAILED: 'Failed to deserialize message.',
};

/**
 * The generated client based on your AsyncAPI document.
 * @title: ${title}
 * @version: ${version}
 */
export const useWebSocketClient = ({ url, websocketOptions }: UseWebSocketClientOptions) => {
  // Stores handlers for each message
  const handlers = new Map<string, MessageHandlerAny>();

  // Prepare websocket connection but don't connect immediately,
  // so can be done when the page loaded via websocket-client plugin
  const {
    send: sendOriginal,
    data,
    status,
    open,
    close,
  } = useWebSocket(url, {
    ...websocketOptions,
    immediate: false,
  });

  // Listen for data changes and process incoming messages
  const onMessageReceivedStopHandle = watch(data, handleMessage);

  function handleMessage(messageRaw: string) {
    console.log('Received message:', messageRaw);

    try {
      const message = JSON.parse(messageRaw);
      const messageHandlers = handlers.get(message.type);
      messageHandlers?.forEach(handler => handler(message));

      if (!messageHandlers.length) {
        console.warn(WebSocketClientErrors.MISSING_LISTENER, { message });
      }
    } catch (error) {
      console.error(WebSocketClientErrors.DESERIALIZE_FAILED, { error });
    }
  }

  /**
   * Adds a listener for the given websocket message.
   * @param type Message type string.
   * @param handler Invoked when the registered message type is received.
   */
  function on<T extends keyof MessageTypeMap>(type: T, handler: MessageHandler<T>): MessageHandlerStopHandle {
    console.log('Adding message handler:', { type });

    if (!messageTypes.has(type)) {
      console.error(WebSocketClientErrors.MISSING_TYPE, { type });
    } else {
      if (!handlers.has(type)) {
        handlers.set(type, []);
      }

      handlers.get(type).push(handler as MessageHandler<MessageTypeKey>);
    }

    /**
     * Remove handler.
     * @return Returns true when handler was removed, false when it didn't exist.
     */
    function messageHandlerStopHandle() {
      const removed = handlers.delete(type);

      console.log('Removing message handler:', {
        type,
        removed,
      });

      return removed;
    }

    return messageHandlerStopHandle;
  }

  /**
   * Sends a websocket message. Overload for single parameter with message payload.
   * @param message
   */
  function send<T extends MessageTypeKey>(message: TypedMessage<T>): boolean;

  /**
   * Sends a websocket message. Overload for two parameters with separate message type and payload.
   * @param type
   * @param message
   */
  function send<T extends MessageTypeKey>(type: T, message: TypedMessageOptional<T>): boolean;

  /**
   * Sends a websocket message.
   * @param typeOrMessage
   * @param maybeMessage
   */
  function send<T extends MessageTypeKey>(typeOrMessage: T | TypedMessage<T>, maybeMessage?: TypedMessage<T>): boolean {
    let message: TypedMessage<T>;

    // Handle overloads
    if (typeof typeOrMessage === 'object') {
      message = typeOrMessage;
    } else {
      // Type comes before the message to not accidentally
      // override anything, payload explicitly got priority
      message = { type: typeOrMessage, ...maybeMessage };
    }

    if (!messageTypes.has(message?.type)) {
      console.error(WebSocketClientErrors.MISSING_TYPE, { message });
      return false;
    }

    try {
      return sendOriginal(JSON.stringify(message));
    } catch (e) {
      console.error(WebSocketClientErrors.SERIALIZE_FAILED, { message });
      return false;
    }
  }

  /**
   * Removes all registered listeners and closes the current websocket connection.
   */
  function dispose() {
    onMessageReceivedStopHandle();
    handlers.clear();
    close();
  }

  return {
    open,
    close,
    dispose,
    send,
    on,
    data,
    status,
  };
};
