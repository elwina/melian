import { useBoolean, useSize } from 'ahooks';
import { Button, Space, Switch } from 'antd';
import { boolean, max } from 'mathjs';
import { ElementType, useEffect, useState } from 'react';
import {
  InstrumentConfig,
  SettingType,
  StyleConfig,
} from 'renderer/config.type';
import {
  parseRequire,
  parseRequireArray,
  parseSet,
} from 'renderer/utils/parseRequire';
import { Updater } from 'use-immer';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import ButtonSlider from './ButtonSlider';
import EasyAction from './EasyAction';
import StyleAdjust from './StyleAdjust';
import TwoArrow from './TwoArrow';

interface propsType {
  styleConfig: StyleConfig;
  instrumentConfig: InstrumentConfig;
  setInstrumentConfig: Updater<InstrumentConfig>;
  setStyleConfig: Updater<StyleConfig>;
}

const settingComponent: Record<SettingType, ElementType> = {
  ButtonSlider: ButtonSlider,
  TwoArrow: TwoArrow,
};

export default function LoadSetting({
  styleConfig,
  instrumentConfig,
  setInstrumentConfig,
  setStyleConfig,
}: propsType) {
  const settingConfig = instrumentConfig.setting;

  const RenderingSettings = settingConfig.map((s) => {
    const SettingComponent = settingComponent[s.type];
    // const firstValue = parseRequire(
    //   { first: s.target[0] },
    //   instrumentConfig
    // ).first;

    const values = parseRequireArray(s.target, instrumentConfig, styleConfig);

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
          values={values}
          options={s.options}
          onChange={(values: number[]) => {
            const newSetDict = s.target.map((t, i) => [t, values[i]]);
            parseSet(
              Object.fromEntries(newSetDict),
              setInstrumentConfig,
              setStyleConfig
            );
          }}
        />
      </div>
    );
  });

  const [ifNotStyle, { set: setIfNotStyle }] = useBoolean(true);
  const [settingHeight, setSettingHeight] = useState(110);
  const [settingWidth, setSettingWidth] = useState(
    document.body.clientWidth - 20
  );

  useEffect(() => {
    window.addEventListener('resize', () =>
      setSettingWidth(document.body.clientWidth - 20)
    );
    return () => {
      window.removeEventListener('resize', () =>
        setSettingWidth(document.body.clientWidth - 20)
      );
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 10,
          left: 0,
          width: settingWidth,
          height: settingHeight,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginLeft: 10,
          marginRight: 10,
        }}
      >
        <Space
          direction="vertical"
          align="center"
          // style={{
          //   display: 'inline-flex',
          //   flexDirection: 'column',
          //   alignItems: 'center',
          //   justifyContent: 'space-around',
          // }}
        >
          <Switch
            checkedChildren="参数调节"
            unCheckedChildren="样式调节"
            checked={ifNotStyle}
            onChange={setIfNotStyle}
          />
          <Space.Compact>
            <Button
              icon={<ArrowUpOutlined />}
              onClick={() => {
                setSettingHeight(settingHeight + 2);
              }}
            />
            <Button
              icon={<ArrowDownOutlined />}
              onClick={() => {
                setSettingHeight(settingHeight - 2);
              }}
            />
          </Space.Compact>
        </Space>
        {!ifNotStyle ? (
          <StyleAdjust
            styleConfig={styleConfig}
            setStyleConfig={setStyleConfig}
          />
        ) : (
          RenderingSettings
        )}
        <EasyAction
          styleConfig={styleConfig}
          onLoadStyle={(config) => {
            setStyleConfig(config);
          }}
        />
      </div>
    </>
  );
}
