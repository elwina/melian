import { StyleConfig } from 'renderer/config.type';
import { parseRequireArray, parseSet } from 'renderer/utils/parseRequire';
import { Updater } from 'use-immer';
import FourSide from './FourSide';

interface propsType {
  styleConfig: StyleConfig;
  // instrumentConfig: InstrumentConfig;
  // setInstrumentConfig: Updater<InstrumentConfig>;
  setStyleConfig: Updater<StyleConfig>;
}

export default function StyleAdjust({
  styleConfig,
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
      'style.screen.bottomMargin',
      'style.screen.leftMargin',
      'style.screen.scaleY',
      'style.screen.scaleX',
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
      'style.measure.bottomMargin',
      'style.measure.leftMargin',
      'style.measure.dsHeight',
      'style.measure.leftPadding',
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
      'style.measure.upHeight',
      'style.measure.downHeight',
      'style.measure.fontHeight',
      'style.measure.sfontHeight',
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
      'style.measure.fontSize',
      'style.measure.sfontSize',
      'style.measure.lineWidth',
      'style.measure.mm2px',
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

  const all = [
    fourSide1,
    fourSide2,
    fourSide3,
    fourSide4,
    fourSide5,
    fourSide6,
    fourSide7,
  ];

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
