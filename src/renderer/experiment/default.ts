import { InstrumentConfig } from 'renderer/typing/config.type';
import young from './json/young.melian.json';
import opticalgrating from './json/opticalgrating.melian.json';
import singlesilt from './json/singlesilt.melian.json';
import polarization from './json/polarization.melian.json';
import fresnel_hole from './json/fresnel_hole.melian.json';

export const defaultExpMap: Map<string, InstrumentConfig> = new Map([
  [young.name, young as InstrumentConfig],
  [opticalgrating.name, opticalgrating as InstrumentConfig],
  [singlesilt.name, singlesilt as InstrumentConfig],
  [polarization.name, polarization as InstrumentConfig],
  [fresnel_hole.name, fresnel_hole as InstrumentConfig],
]);
