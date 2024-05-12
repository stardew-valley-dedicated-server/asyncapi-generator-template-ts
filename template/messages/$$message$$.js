import { File } from '@asyncapi/generator-react-sdk';
import Message from '../../components/Message';
import CodegenComment from '../../components/CodegenComment';
import { logStatus, getMessageName } from '../../utils/util';

/** @param { RenderArgument & {message: parser.Message, messageName: string} } ctx */
export default function ({ asyncapi, params, message, messageName }) {
  const name = getMessageName(message);

  logStatus(`Generating message '${name}'...`);

  return (
    <File name={`${name}.ts`}>
      <CodegenComment/>
      <Message name={name} message={message}/>
    </File>
  );
}
