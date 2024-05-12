import { TypeScriptGenerator } from '@asyncapi/modelina';
import { File, Text } from '@asyncapi/generator-react-sdk';
import CodegenComment from '../../components/CodegenComment';
import { logStatus } from '../../utils/util';

async function generateModels({ asyncapi }) {
  return (new TypeScriptGenerator({
    modelType: 'interface',
  })).generate(asyncapi);
}

/**
 * @param schema
 * @returns {JSX.Element}
 */
function generateImports(schema) {
  const imports = schema.model.getNearestDependencies().map(dependency => (
    <Text>import type {dependency.type} from './{dependency.type}'</Text>
  ));

  return (
    <Text newLines={imports.length ? 1 : 0}>{imports}</Text>
  );
}

/**
 * @param schema
 * @returns {JSX.Element}
 */
function generateExport(schema) {
  return <Text>export default {schema.result}</Text>;
}

/** @param {RenderArgument} ctx */
export default async function ({ asyncapi, params }) {
  const models = await generateModels({ asyncapi });

  return models.map((schema) => {
    logStatus(`Generating model '${schema.modelName}'... `);

    const imports = generateImports(schema);
    const exports = generateExport(schema);

    return (
      <File name={`${schema.modelName}.ts`}>
        <CodegenComment/>
        {imports}
        {exports}
      </File>
    );
  });
}
