import { vi, describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useWebSocketClient } from './../.output/useWebSocketClient';

// TODO: Find a way to move this to __mocks__ directory without breaking vue-demi internal imports
vi.mock('@vueuse/core', () => {
  return {
    useWebSocket: vi.fn(() => {
      const open = vi.fn();
      const close = vi.fn();
      const send = vi.fn();
      const data = ref('');
      const status = ref('OPEN');

      return {
        open,
        close,
        send,
        data,
        status,
      };
    }),
  };
});

const $ws = useWebSocketClient({ url: 'isMockedAnyway' });

describe('send', () => {
  describe('should succeed', () => {
    it('payload type', () => {
      expect(() => $ws.send({
        type: 'ConnectedMessage',
        msg: 'Test message',
        connection_info: undefined,
      })).not.toThrowError();
    });

    it('parameter type', () => {
      expect(() => $ws.send('ConnectedMessage', {
        msg: 'Test message',
        connection_info: {},
      })).not.toThrowError();
    });

    it('payload + parameter type', () => {
      expect(() => $ws.send('ConnectedMessage', {
        type: 'ConnectedMessage',
        msg: 'Test message',
        connection_info: {},
      })).not.toThrowError();
    });

    it('wrong payload type + correct parameter type', () => {
      expect(() => $ws.send('ConnectedMessage', {
        // @ts-expect-error Invalid params for test
        type: 'InvalidMessage',
        msg: 'Test message',
        connection_info: {},
      })).not.toThrowError();
    });
  });

  describe('should fail', () => {
    it('no params', () => {
      // @ts-expect-error Invalid params for test
      expect($ws.send()).toBeFalsy();
    });

    it('undefined payload', () => {
      expect($ws.send(undefined)).toBeFalsy();
    });

    it('empty object payload', () => {
      // @ts-expect-error Invalid params for test
      expect($ws.send({})).toBeFalsy();
    });

    it('payload without type', () => {
      // @ts-expect-error Invalid params for test
      expect($ws.send({
        msg: '',
        connection_info: undefined,
      })).toBeFalsy();
    });

    it('payload with invalid type', () => {
      expect($ws.send({
        // @ts-expect-error Invalid params for test
        type: 'InvalidMessage',
        msg: '',
        connection_info: undefined,
      })).toBeFalsy();
    });

    it('invalid type with payload', () => {
      // @ts-expect-error Invalid params for test
      expect($ws.send('InvalidMessage', {
        msg: '',
        connection_info: undefined,
      })).toBeFalsy();
    });

    it('invalid type with payload that has correct type', () => {
      // @ts-expect-error Invalid params for test
      expect($ws.send('InvalidMessage', {
        type: 'ConnectedMessage',
        msg: '',
        connection_info: undefined,
      })).toBeFalsy();
    });
  });
});

describe('subscribe', () => {
  describe('StopHandle', () => {
    it('handles being called with invalid message type', () => {
      // @ts-expect-error Invalid params for test
      const stopHandle = $ws.on('InvalidMessage', () => {
      });

      // Handler was never registered due to invalid message
      expect(stopHandle()).toBeFalsy();
    });

    it('handles being called multiple times', () => {
      const stopHandle = $ws.on('ConnectedMessage', () => {
      });

      // Removes with first call, does nothing with subsequent calls
      expect(stopHandle()).toBeTruthy();
      expect(stopHandle()).toBeFalsy();
      expect(stopHandle()).toBeFalsy();
    });
  });
});
