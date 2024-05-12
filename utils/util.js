import { FormatHelpers } from '@asyncapi/modelina';
import * as path from 'node:path';


const templateDir = path.join(__dirname, '..');

const asyncapiToJsTypes = {
  integer: 'number',
};

export function isModelType(type) {
  return type === 'object';
}

// Colors
export const magenta = text => `\x1b[35m${text}\x1b[0m`;

export function getTemplateDir(dir = '') {
  return path.join(templateDir, dir);
}

export function isNativeType(type) {
  return type in asyncapiToJsTypes;
}

export function getNativeType(type) {
  return asyncapiToJsTypes[type];
}

export function logStatus(value) {
  console.log(`\x1b[1;35m•\x1b[1;0m ${value}`);
}

export function processMessage(name, props) {
  let imports = [];
  let properties = [];

  // Add special `type` property
  properties.push({ readonly: true, propName: 'type', typeFinal: `'${name}'` });

  for (const propName of Object.keys(props)) {
    if (propName === 'type') {
      // TODO: Use error map
      throw new Error('Can not use the property \'type\', it is used for internal purposes. Please rename the property.');
    }

    const type = props[propName].type();
    let typeFinal;

    if (isModelType(type)) {
      typeFinal = FormatHelpers.toPascalCase(propName);

      // Auto import generation is disabled because the generator doesn't handle
      // type-only imports too well, here we collect and handle them manually
      imports.push(typeFinal);

    } else if (isNativeType(type)) {
      typeFinal = getNativeType(type);
    } else {
      typeFinal = type;
    }

    properties.push({ propName, typeFinal });
  }

  return {
    imports,
    properties,
  };
}

export function getMessageNameRaw(message) {
  return message.payload().id();
}

export function getMessageName(message) {
  return FormatHelpers
    .toPascalCase(`${getMessageNameRaw(message)}Message`);
}

/** @param {RenderArgument} ctx */
export function getMessageNames({ asyncapi }) {
  const names = [];

  for (const message of asyncapi.allMessages()) {
    names.push(getMessageName(message));
  }

  return names;
  // return asyncapi
  //   .allMessages()
  //   .map(message => getMessageName({ message }));
}
