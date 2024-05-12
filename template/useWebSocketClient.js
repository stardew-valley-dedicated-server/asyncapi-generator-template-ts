import { File } from '@asyncapi/generator-react-sdk';
import Client from '../components/Client';
import CodegenComment from '../components/CodegenComment';
import { logStatus } from '../utils/util';

/** @param {RenderArgument} ctx */
export default function ({ asyncapi, params }) {
  logStatus('Generating client...');

  // const args = {
  //   output: path.join(process.cwd(), params.output),
  //   version: params.version || asyncapi.info()?.version(),
  //   title: params.title || asyncapi.info()?.title(),
  // };

  return (
    <File name="useWebSocketClient.ts">
      <CodegenComment/>
      <Client/>
    </File>
  );
}
