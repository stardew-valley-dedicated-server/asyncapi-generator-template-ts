import { processMessage } from '../utils/util';
import { Text } from '@asyncapi/generator-react-sdk';

export default function Message({ name, message }) {
  const messagePayload = message.payload();
  const messageProperties = messagePayload.properties();
  const messageProcessed = processMessage(name, messageProperties);

  return (
    <Text>
      {messageProcessed.imports.map(val => (
        <Text>{`import type ${val} from './../models/${val}'`}</Text>
      ))}

      <Text>{`export default interface ${name} {`}</Text>
      {messageProcessed.properties.map(prop => (
        <Text indent={2}>{prop.readonly ? 'readonly ' : ''}{prop.propName}: {prop.typeFinal};</Text>
      ))}
      <Text>{'}'}</Text>
    </Text>
  );
}
