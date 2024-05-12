import { Text, render } from '@asyncapi/generator-react-sdk';

/**
 * @param { { messageTypes: string[] } } param0
 */
export default function MessageTypeMap({ messageTypes }) {
  return (
    <Text>
      {messageTypes.map(messageType => (
        <Text>{`import type ${messageType} from './messages/${messageType}';`}</Text>
      ))}
      <Text newLines={1}/>

      <Text>{'export type MessageTypeMap = {'}</Text>
      {messageTypes.map(messageType => (
        <Text indent={2}>{messageType}: {messageType};</Text>
      ))}
      <Text newLines={1}>{'};'}</Text>

      <Text>{'export const messageTypes = new Set(['}</Text>
      {messageTypes.map(messageType => (
        <Text indent={2}>'{messageType}',</Text>
      ))}
      <Text>{']);'}</Text>
    </Text>
  );
}
