import { InstrumentConfig } from 'renderer/typing/config.type';
import young from './json/young.melian.json';
import opticalgrating from './json/opticalgrating.melian.json';
import singlesilt from './json/singlesilt.melian.json';
import polarization from './json/polarization.melian.json';
import fresnel_hole from './json/fresnel_hole2.melian.json';
import opticalgrating_old from './json/opticalgrating_old.melian.json';
import fresnel_hole_old from './json/fresnel_hole.melian.json';

export const defaultExpMap: Map<string, InstrumentConfig> = new Map([
  [young.name, young as InstrumentConfig],
  [opticalgrating.name, opticalgrating as InstrumentConfig],
  [opticalgrating_old.name, opticalgrating_old as InstrumentConfig],
  [singlesilt.name, singlesilt as InstrumentConfig],
  [fresnel_hole.name, fresnel_hole as InstrumentConfig],
  [fresnel_hole_old.name, fresnel_hole_old as InstrumentConfig],
  [polarization.name, polarization as InstrumentConfig],
]);
