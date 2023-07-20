import type {
  InstrumentConfig,
  LenConfig,
  StyleConfig,
} from 'renderer/typing/config.type';
import type { Updater } from 'use-immer';
import { isValidKey } from './type';

export function parseRequire(
  req: Record<string | number, string>,
  instrumentConfig?: InstrumentConfig,
  styleConfig?: StyleConfig
) {
  const result: Record<string, any> = {};

  Object.keys(req).forEach((key) => {
    const str = req[key];
    if (instrumentConfig) {
      const lensConfig = instrumentConfig.lens;

      if (str === 'light.filter') {
        result[key] = instrumentConfig.light.filter;
        return;
      }

      // screen和measure的属性
      const splitArray = str.split('.');
      if (splitArray[0] === 'measure') {
        const opt = splitArray[1];
        if (opt === 'type') {
          result[key] = instrumentConfig.measure.type;
          return;
        }
        result[key] = instrumentConfig.measure.options[opt];
        return;
      }
      if (splitArray[0] === 'screen') {
        const opt = splitArray[1];
        if (opt === 'type') {
          result[key] = instrumentConfig.screen.type;
          return;
        }
        result[key] = instrumentConfig.screen.options[opt];
        return;
      }

      // lens的距离或者属性
      const array = str.split(/\.|\{|\}|\[|\]/);
      // [ '', '5', '', 'distancemm' ]
      const id = parseInt(array[1], 10);
      const ifoption = str[0] === '{';

      if (ifoption) {
        const indicate = array[3];
        if (indicate in lensConfig[id].option) {
          result[key] = lensConfig[id].option[indicate];
          return;
        } else {
          throw new Error(`option ${indicate} not found in lens ${id}`);
        }
      } else if (str[0] === '[') {
        result[key] = lensConfig[id].distancemm;
        return;
      }
    }

    if (styleConfig) {
      const style = styleConfig;

      if (str === 'style.holder.leftMargin') {
        result[key] = style.holder.leftMargin;
        return;
      }
      if (str === 'style.holder.bottomMargin') {
        result[key] = style.holder.bottomMargin;
        return;
      }
      if (str === 'style.holder.holderHeight') {
        result[key] = style.holder.holderHeight;
        return;
      }
      if (str === 'style.holder.holderWidthmm') {
        result[key] = style.holder.holderWidthmm;
        return;
      }
      if (str === 'style.holder.leftPadding') {
        result[key] = style.holder.leftPadding;
        return;
      }
      if (str === 'style.holder.xScale') {
        result[key] = style.holder.xScale;
        return;
      }
      if (str === 'style.holder.upHeight') {
        result[key] = style.holder.upHeight;
        return;
      }
      if (str === 'style.holder.fontSize') {
        result[key] = style.holder.fontSize;
        return;
      }
      if (str === 'style.holder.baselineHeight') {
        result[key] = style.holder.baselineHeight;
        return;
      }
      if (str === 'style.holder.lenScaleX') {
        result[key] = style.holder.lenScaleX;
        return;
      }
      if (str === 'style.holder.lenScaleY') {
        result[key] = style.holder.lenScaleY;
        return;
      }

      const splitArray = str.split('.');
      if (splitArray.length >= 3) {
        if (splitArray[0] === 'style' && splitArray[1] === 'screen') {
          const screenwhich = splitArray[2];
          const screenoption = splitArray[3];
          if (screenwhich === 'type') {
            result[key] = style.screen[screenwhich].type;
            return;
          }
          if (
            isValidKey(screenwhich, style.screen) &&
            isValidKey(screenoption, style.screen[screenwhich])
          ) {
            result[key] = style.screen[screenwhich][screenoption];
            return;
          }
        }

        if (splitArray[0] === 'style' && splitArray[1] === 'measure') {
          const measurewhich = splitArray[2];
          const measureoption = splitArray[3];
          if (measurewhich === 'type') {
            result[key] = style.measure[measurewhich].type;
            return;
          }
          if (
            isValidKey(measurewhich, style.measure) &&
            isValidKey(measureoption, style.measure[measurewhich])
          ) {
            result[key] = style.measure[measurewhich][measureoption];
            return;
          }
        }
      }
    }
  });
  return result;
}

export function parseRequireArray(
  arr: string[],
  instrumentConfig?: InstrumentConfig,
  styleConfig?: StyleConfig
) {
  const dict = { ...arr } as Record<number, string>;
  const res = parseRequire(dict, instrumentConfig, styleConfig);
  return Object.values(res);
}

export function parseSet(
  req: Record<string, any>,
  setInstrumentConfig?: Updater<InstrumentConfig>,
  setStyleConfig?: Updater<StyleConfig>
) {
  Object.keys(req).forEach((key) => {
    const str = key;
    const value = req[key];

    if (setInstrumentConfig) {
      if (str === 'light.filter') {
        setInstrumentConfig((draft) => {
          draft.light.filter = value;
        });
        return;
      }

      // screen和measure的属性
      const splitArray = str.split('.');
      if (splitArray[0] === 'measure') {
        const opt = splitArray[1];
        if (opt === 'type') {
          setInstrumentConfig((draft) => {
            draft.measure.type = value;
          });
          return;
        }
        setInstrumentConfig((draft) => {
          draft.measure.options[opt] = value;
        });
        return;
      }
      if (splitArray[0] === 'screen') {
        const opt = splitArray[1];
        if (opt === 'type') {
          setInstrumentConfig((draft) => {
            draft.screen.type = value;
          });
          return;
        }
        setInstrumentConfig((draft) => {
          draft.screen.options[opt] = value;
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
            return;
          } else {
            throw new Error(`option ${indicate} not found in lens ${id}`);
          }
        });
      } else if (str[0] === '[') {
        setInstrumentConfig((draft) => {
          draft.lens[id].distancemm = value;
          return;
        });
      }
    }

    if (setStyleConfig) {
      setStyleConfig((draft) => {
        if (str === 'style.holder.leftMargin') {
          draft.holder.leftMargin = value;
          return;
        }
        if (str === 'style.holder.bottomMargin') {
          draft.holder.bottomMargin = value;
          return;
        }
        if (str === 'style.holder.holderHeight') {
          draft.holder.holderHeight = value;
          return;
        }
        if (str === 'style.holder.holderWidthmm') {
          draft.holder.holderWidthmm = value;
          return;
        }
        if (str === 'style.holder.leftPadding') {
          draft.holder.leftPadding = value;
          return;
        }
        if (str === 'style.holder.xScale') {
          draft.holder.xScale = value;
          return;
        }
        if (str === 'style.holder.upHeight') {
          draft.holder.upHeight = value;
          return;
        }
        if (str === 'style.holder.fontSize') {
          draft.holder.fontSize = value;
          return;
        }
        if (str === 'style.holder.baselineHeight') {
          draft.holder.baselineHeight = value;
          return;
        }
        if (str === 'style.holder.lenScaleX') {
          draft.holder.lenScaleX = value;
          return;
        }
        if (str === 'style.holder.lenScaleY') {
          draft.holder.lenScaleY = value;
          return;
        }

        const splitArray = str.split('.');
        if (splitArray[0] === 'style' && splitArray[1] === 'screen') {
          const screenwhich = splitArray[2];
          const screenoption = splitArray[3];
          if (screenwhich === 'type') {
            draft.screen.type = value;
            return;
          }
          if (
            isValidKey(screenwhich, draft.screen) &&
            isValidKey(screenoption, draft.screen[screenwhich])
          ) {
            draft.screen[screenwhich][screenoption] = value;
            return;
          }
        }

        if (splitArray[0] === 'style' && splitArray[1] === 'measure') {
          const measurewhich = splitArray[2];
          const measureoption = splitArray[3];
          if (measurewhich === 'type') {
            draft.measure.type = value;
            return;
          }
          if (
            isValidKey(measurewhich, draft.measure) &&
            isValidKey(measureoption, draft.measure[measurewhich])
          ) {
            draft.measure[measurewhich][measureoption] = value;
            return;
          }
        }
      });
    }
  });
}
