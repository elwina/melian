import type { InstrumentConfig, LenConfig } from 'renderer/config.type';
import { Updater } from 'use-immer';

export function parseRequire(
  req: Record<string, string>,
  instrumentConfig: InstrumentConfig
) {
  const lensConfig = instrumentConfig.lens;

  const result: Record<string, any> = {};
  Object.keys(req).forEach((key) => {
    const str = req[key];

    if (str === 'light.filter') {
      result[key] = instrumentConfig.light.filter;
      return;
    }

    const array = str.split(/\.|\{|\}|\[|\]/);
    // [ '', '5', '', 'distancemm' ]
    const id = parseInt(array[1], 10);
    const ifoption = str[0] === '{';

    if (ifoption) {
      const indicate = array[3];
      if (indicate in lensConfig[id].option) {
        result[key] = lensConfig[id].option[indicate];
      } else {
        throw new Error(`option ${indicate} not found in lens ${id}`);
      }
    } else {
      result[key] = lensConfig[id].distancemm;
    }
  });
  return result;
}

export function parseSet(
  req: Record<string, any>,
  setInstrumentConfig: Updater<InstrumentConfig>
) {
  Object.keys(req).forEach((key) => {
    const str = key;
    const value = req[key];

    if (str === 'light.filter') {
      setInstrumentConfig((draft) => {
        draft.light.filter = value;
      });
      return;
    }

    const array = str.split(/\.|\{|\}|\[|\]/);
    // [ '', '5', '', 'distancemm' ]
    const id = parseInt(array[1], 10);
    const ifoption = str[0] === '{';

    if (ifoption) {
      const indicate = array[3];
      setInstrumentConfig((draft) => {
        if (indicate in draft.lens[id].option) {
          draft.lens[id].option[indicate] = value;
        } else {
          throw new Error(`option ${indicate} not found in lens ${id}`);
        }
      });
    } else {
      setInstrumentConfig((draft) => {
        draft.lens[id].distancemm = value;
      });
    }
  });
}
