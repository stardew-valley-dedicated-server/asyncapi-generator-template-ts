/**
 * NOTE: This file is only exists fix import errors in the `Client.ts` raw template.
 *
 * Code generation creates the actual `MessageTypeMap.ts` file with the correct messages
 * using `components/MessageTypeMap.js` which fits in place without changing the import path.
 */

interface PlaceholderMessage {
  readonly type: 'PlaceholderMessage'
}

export type MessageTypeMap = {
  PlaceholderMessage: PlaceholderMessage
};

export const messageTypes = new Set([
  'PlaceholderMessage',
]);
