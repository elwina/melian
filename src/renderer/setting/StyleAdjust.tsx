import { useEffect } from 'react';
import Square from 'renderer/measures/Square';
import { InstrumentConfig, StyleConfig } from 'renderer/typing/config.type';
import { parseRequireArray, parseSet } from 'renderer/utils/parseRequire';
import { Updater, useImmer } from 'use-immer';
import FourSide from './FourSide';

interface propsType {
  styleConfig: StyleConfig;
  instrumentConfig: InstrumentConfig;
  // setInstrumentConfig: Updater<InstrumentConfig>;
  setStyleConfig: Updater<StyleConfig>;
}

export default function StyleAdjust({
  styleConfig,
  instrumentConfig,
  setStyleConfig,
}: propsType) {
  const fourSide1 = {
    name: '位置高宽',
    target: [
      'style.holder.bottomMargin',
      'style.holder.leftMargin',
      'style.holder.holderHeight',
      'style.holder.holderWidthmm',
    ],
    options: {
      vmiddle: {
        valueIndex: 0,
        step: 5,
        min: 0,
        max: document.body.clientHeight,
      },
      hmiddle: {
        valueIndex: 1,
        step: 5,
        min: 0,
        max: document.body.clientWidth,
      },
      side: {
        valueIndex: 2,
        step: 2,
        min: 0,
        max: document.body.clientWidth,
      },
      bottom: {
        valueIndex: 3,
        step: 20,
        min: 0,
        max: document.body.clientWidth,
      },
    },
  };
  const fourSide2 = {
    name: '字与间距',
    target: [
      'style.holder.upHeight',
      'style.holder.leftPadding',
      'style.holder.fontSize',
      'style.holder.xScale',
    ],
    options: {
      vmiddle: {
        valueIndex: 0,
        step: 2,
        min: 0,
        max: document.body.clientHeight,
      },
      hmiddle: {
        valueIndex: 1,
        step: 2,
        min: 0,
        max: document.body.clientWidth,
      },
      side: {
        valueIndex: 2,
        step: 2,
        min: 0,
        max: document.body.clientWidth,
      },
      bottom: {
        valueIndex: 3,
        step: 0.1,
        min: 0,
        max: 100,
      },
    },
  };
  const fourSide3 = {
    name: '拉伸',
    target: [
      'style.holder.baselineHeight',
      'style.holder.lenScaleX',
      'style.holder.lenScaleY',
    ],
    options: {
      vmiddle: {
        valueIndex: 0,
        step: 2,
        min: 0,
        max: document.body.clientHeight,
      },
      hmiddle: {
        valueIndex: 1,
        step: 0.2,
        min: 0,
        max: 100,
      },
      side: {
        valueIndex: 2,
        step: 0.2,
        min: 0,
        max: 100,
      },
    },
  };

  const fourSide4 = {
    name: '观察屏',
    target: [
      'style.screen.FixedCircle.bottomMargin',
      'style.screen.FixedCircle.leftMargin',
      'style.screen.FixedCircle.scaleY',
      'style.screen.FixedCircle.scaleX',
    ],
    options: {
      vmiddle: {
        valueIndex: 0,
        step: 5,
        min: 0,
        max: document.body.clientHeight,
      },
      hmiddle: {
        valueIndex: 1,
        step: 5,
        min: 0,
        max: document.body.clientWidth,
      },
      side: {
        valueIndex: 2,
        step: 0.1,
        min: 1,
        max: 3,
      },
      bottom: {
        valueIndex: 3,
        step: 0.1,
        min: 1,
        max: 3,
      },
    },
  };

  const fourSide5 = {
    name: '尺位置',
    target: [
      'style.measure.Square.bottomMargin',
      'style.measure.Square.leftMargin',
      'style.measure.Square.dsHeight',
      'style.measure.Square.leftPadding',
    ],
    options: {
      vmiddle: {
        valueIndex: 0,
        step: 5,
        min: 0,
        max: document.body.clientHeight,
      },
      hmiddle: {
        valueIndex: 1,
        step: 5,
        min: 0,
        max: document.body.clientWidth,
      },
      side: {
        valueIndex: 2,
        step: 2,
        min: 0,
        max: document.body.clientWidth,
      },
      bottom: {
        valueIndex: 3,

        step: 4,
        min: 0,
        max: document.body.clientWidth,
      },
    },
  };
  const fourSide6 = {
    name: '尺高宽',
    target: [
      'style.measure.Square.upHeight',
      'style.measure.Square.downHeight',
      'style.measure.Square.fontHeight',
      'style.measure.Square.sfontHeight',
    ],
    options: {
      vmiddle: {
        valueIndex: 0,
        step: 2,
        min: 0,
        max: document.body.clientHeight,
      },
      hmiddle: {
        valueIndex: 1,
        step: 2,
        min: 0,
        max: document.body.clientWidth,
      },
      side: {
        valueIndex: 2,
        step: 2,
        min: 0,
        max: document.body.clientWidth,
      },
      bottom: {
        valueIndex: 3,
        step: 2,
        min: 0,
        max: document.body.clientWidth,
      },
    },
  };

  const fourSide7 = {
    name: '尺字',
    target: [
      'style.measure.Square.fontSize',
      'style.measure.Square.sfontSize',
      'style.measure.Square.lineWidth',
      'style.measure.Square.mm2px',
    ],
    options: {
      vmiddle: {
        valueIndex: 0,
        step: 2,
        min: 0,
        max: document.body.clientHeight,
      },
      hmiddle: {
        valueIndex: 1,
        step: 2,
        min: 0,
        max: document.body.clientWidth,
      },
      side: {
        valueIndex: 2,
        step: 2,
        min: 2,
        max: 100,
      },
      bottom: {
        valueIndex: 3,
        step: 0.5,
        min: 0,
        max: document.body.clientWidth,
      },
    },
  };

  const [all, setAll] = useImmer([fourSide1, fourSide2, fourSide3]);

  useEffect(() => {
    const re = [fourSide1, fourSide2, fourSide3];
    if (instrumentConfig.screen.type === 'FixedCircle') {
      re.push(fourSide4);
    }
    if (instrumentConfig.measure.type === 'Square') {
      re.push(fourSide5);
      re.push(fourSide6);
      re.push(fourSide7);
    }
    setAll(re);
  }, [instrumentConfig, setAll]);

  const RenderingSettings = all.map((s) => {
    const values = parseRequireArray(s.target, undefined, styleConfig);

    return (
      <div
        key={s.name}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div>{s.name}</div>
        <FourSide
          values={values}
          options={s.options}
          onChange={(values: number[]) => {
            const newSetDict = s.target.map((t, i) => [t, values[i]]);
            parseSet(Object.fromEntries(newSetDict), undefined, setStyleConfig);
          }}
        />
      </div>
    );
  });

  return <>{RenderingSettings}</>;
}
