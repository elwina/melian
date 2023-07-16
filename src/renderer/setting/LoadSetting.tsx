import { ElementType } from 'react';
import {
  InstrumentConfig,
  SettingType,
  StyleConfig,
} from 'renderer/config.type';
import { parseRequire, parseSet } from 'renderer/utils/parseRequire';
import { Updater } from 'use-immer';
import ButtonSlider from './ButtonSlider';

interface propsType {
  styleConfig: StyleConfig;
  instrumentConfig: InstrumentConfig;
  setInstrumentConfig: Updater<InstrumentConfig>;
}

const settingComponent: Record<SettingType, ElementType> = {
  ButtonSlider: ButtonSlider,
};

export default function LoadSetting({
  styleConfig,
  instrumentConfig,
  setInstrumentConfig,
}: propsType) {
  const settingConfig = instrumentConfig.setting;

  const RenderingSettings = settingConfig.map((s) => {
    const SettingComponent = settingComponent[s.type];

    const firstValue = parseRequire(
      { first: s.target[0] },
      instrumentConfig
    ).first;

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
        <SettingComponent
          value={firstValue}
          options={s.options}
          onChange={(value: number) => {
            const newSetDict = s.target.map((t) => [t, value]);
            parseSet(Object.fromEntries(newSetDict), setInstrumentConfig);
          }}
        />
      </div>
    );
  });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        left: 0,
        width: '100%',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      {RenderingSettings}
    </div>
  );
}
