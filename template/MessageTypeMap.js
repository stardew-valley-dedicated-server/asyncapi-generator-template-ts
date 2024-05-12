import { File } from '@asyncapi/generator-react-sdk';
import MessageTypeMap from '../components/MessageTypeMap';
import CodegenComment from '../components/CodegenComment';
import { getMessageNames, logStatus } from '../utils/util';

/** @param {RenderArgument} ctx */
export default function ({ asyncapi, params }) {
  logStatus('Generating MessageTypeMap...');

  const messageTypes = getMessageNames({ asyncapi });

  return (
    <File name="MessageTypeMap.ts">
      <CodegenComment/>
      <MessageTypeMap messageTypes={messageTypes}/>
    </File>
  );
}
