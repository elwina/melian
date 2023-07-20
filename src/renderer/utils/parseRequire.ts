import type {
  InstrumentConfig,
  LenConfig,
  StyleConfig,
} from 'renderer/config.type';
import { Updater } from 'use-immer';

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

      if (str === 'status.offsetmm') {
        result[key] = instrumentConfig.status.offsetmm;
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
          return;
        } else {
          throw new Error(`option ${indicate} not found in lens ${id}`);
        }
      } else {
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
      if (str === 'style.screen.mmwidth') {
        result[key] = style.screen.mmwidth;
        return;
      }
      if (str === 'style.screen.mmheight') {
        result[key] = style.screen.mmheight;
        return;
      }
      if (str === 'style.screen.mm2px') {
        result[key] = style.screen.mm2px;
        return;
      }
      if (str === 'style.screen.scaleX') {
        result[key] = style.screen.scaleX;
        return;
      }
      if (str === 'style.screen.scaleY') {
        result[key] = style.screen.scaleY;
        return;
      }
      if (str === 'style.screen.leftMargin') {
        result[key] = style.screen.leftMargin;
        return;
      }
      if (str === 'style.screen.bottomMargin') {
        result[key] = style.screen.bottomMargin;
        return;
      }
      if (str === 'style.measure.mm2px') {
        result[key] = style.measure.mm2px;
        return;
      }
      if (str === 'style.measure.upHeight') {
        result[key] = style.measure.upHeight;
        return;
      }
      if (str === 'style.measure.downHeight') {
        result[key] = style.measure.downHeight;
        return;
      }
      if (str === 'style.measure.dsHeight') {
        result[key] = style.measure.dsHeight;
        return;
      }
      if (str === 'style.measure.fontHeight') {
        result[key] = style.measure.fontHeight;
        return;
      }
      if (str === 'style.measure.sfontHeight') {
        result[key] = style.measure.sfontHeight;
        return;
      }
      if (str === 'style.measure.fontSize') {
        result[key] = style.measure.fontSize;
        return;
      }
      if (str === 'style.measure.sfontSize') {
        result[key] = style.measure.sfontSize;
        return;
      }
      if (str === 'style.measure.lineWidth') {
        result[key] = style.measure.lineWidth;
        return;
      }
      if (str === 'style.measure.leftPadding') {
        result[key] = style.measure.leftPadding;
        return;
      }
      if (str === 'style.measure.upPadding') {
        result[key] = style.measure.upPadding;
        return;
      }
      if (str === 'style.measure.leftMargin') {
        result[key] = style.measure.leftMargin;
        return;
      }
      if (str === 'style.measure.bottomMargin') {
        result[key] = style.measure.bottomMargin;
        return;
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

      if (str === 'status.offsetmm') {
        setInstrumentConfig((draft) => {
          draft.status.offsetmm = value;
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
      } else {
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
        if (str === 'style.screen.mmwidth') {
          draft.screen.mmwidth = value;
          return;
        }
        if (str === 'style.screen.mmheight') {
          draft.screen.mmheight = value;
          return;
        }
        if (str === 'style.screen.mm2px') {
          draft.screen.mm2px = value;
          return;
        }
        if (str === 'style.screen.scaleX') {
          draft.screen.scaleX = value;
          return;
        }
        if (str === 'style.screen.scaleY') {
          draft.screen.scaleY = value;
          return;
        }
        if (str === 'style.screen.leftMargin') {
          draft.screen.leftMargin = value;
          return;
        }
        if (str === 'style.screen.bottomMargin') {
          draft.screen.bottomMargin = value;
          return;
        }
        if (str === 'style.measure.mm2px') {
          draft.measure.mm2px = value;
          return;
        }
        if (str === 'style.measure.upHeight') {
          draft.measure.upHeight = value;
          return;
        }
        if (str === 'style.measure.downHeight') {
          draft.measure.downHeight = value;
          return;
        }
        if (str === 'style.measure.dsHeight') {
          draft.measure.dsHeight = value;
          return;
        }
        if (str === 'style.measure.fontHeight') {
          draft.measure.fontHeight = value;
          return;
        }
        if (str === 'style.measure.sfontHeight') {
          draft.measure.sfontHeight = value;
          return;
        }
        if (str === 'style.measure.fontSize') {
          draft.measure.fontSize = value;
          return;
        }
        if (str === 'style.measure.sfontSize') {
          draft.measure.sfontSize = value;
          return;
        }
        if (str === 'style.measure.lineWidth') {
          draft.measure.lineWidth = value;
          return;
        }
        if (str === 'style.measure.leftPadding') {
          draft.measure.leftPadding = value;
          return;
        }
        if (str === 'style.measure.upPadding') {
          draft.measure.upPadding = value;
          return;
        }
        if (str === 'style.measure.leftMargin') {
          draft.measure.leftMargin = value;
          return;
        }
        if (str === 'style.measure.bottomMargin') {
          draft.measure.bottomMargin = value;
          return;
        }
      });
    }
  });
}
