import fs from 'node:fs';
import { getTemplateDir } from '../utils/util';

export default function Client() {
  // Renders file content as is. Rendering it via JSX would allow to pass params like version
  // and description, but we would lose the currently error-free base source code which makes
  // it much easier to maintain.
  return fs.readFileSync(getTemplateDir('components/src/Client.ts'), { encoding: 'utf8' });
}
