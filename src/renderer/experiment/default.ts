import { InstrumentConfig } from 'renderer/typing/config.type';
import young from './json/young.json';

export const defaultExpMap: Map<string, InstrumentConfig> = new Map([
  [young.name, young as InstrumentConfig],
]);
