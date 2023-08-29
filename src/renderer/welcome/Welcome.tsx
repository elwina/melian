import { Button, Space } from 'antd';
import { CSSProperties, useRef, useState } from 'react';
import {
  CaretUpOutlined,
  UpSquareOutlined,
  DownSquareOutlined,
  CheckOutlined,
  StopOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useKeyPress } from 'ahooks';

import SwitchExp from 'renderer/experiment/switchExp';
import { InstrumentConfig, StyleConfig } from 'renderer/typing/config.type';
import { Updater } from 'use-immer';
import backjpg from '../../../assets/back1.jpg';
import './Welcome.css';

interface propsType {
  styleConfig: StyleConfig;
  instrumentConfig: InstrumentConfig;
  setInstrumentConfig: Updater<InstrumentConfig>;
  setStyleConfig: Updater<StyleConfig>;
  onChange: (name: string, config: InstrumentConfig) => void;
}

export function Welcome({
  styleConfig,
  instrumentConfig,
  setInstrumentConfig,
  setStyleConfig,
  onChange,
}: propsType) {
  const [expMap, setExpMap] = useState(new Map<string, InstrumentConfig>());

  const ustyle: CSSProperties = {
    // color: '#ffffff',
    fontFamily: 'STSong,SimSun',
    marginTop: '2rem',
    // backdropFilter: 'blur(5px)',
  };

  function enterExp(name: string) {
    const config = expMap.get(name)!;
    onChange(name, config);
  }

  function enterGuide() {
    setStyleConfig((draft) => {
      draft.global.guide = true;
    });
    enterExp('杨氏双缝干涉');
  }
  const [ifKey, setIfKey] = useState(false);
  const [keynow, setKeynow] = useState(0);

  useKeyPress('uparrow', () => {
    document.getElementById('welcome-btn-up')?.click();
  });
  useKeyPress('downarrow', () => {
    document.getElementById('welcome-btn-down')?.click();
  });
  useKeyPress('enter', () => {
    document.getElementById('welcome-btn-enter')?.click();
  });

  const choices = Array.from(expMap.keys()).map((name, i) => {
    return (
      <button
        style={ustyle}
        className="custom-btn btn-5"
        type="button"
        onClick={() => {
          enterExp(name);
        }}
        key={name}
        id={`welcome-mainbtn-${i + 1}`}
      >
        <div>
          {ifKey && i + 1 === keynow && <SendOutlined />}
          {name}
        </div>
      </button>
    );
  });

  return (
    <>
      <div
        style={{
          backgroundColor: '#000000',
          backgroundImage: `url(${backjpg})`,

          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 5,
          userSelect: 'none',

          zIndex: 100000,

          display: 'grid',
          gridTemplateColumns: '9fr 16fr',
        }}
      >
        <div />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'top',
            alignItems: 'center',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              fontSize: '3.5rem',
              color: '#ffffff',
              fontFamily: 'STFangsong,FangSong',

              marginTop: '3rem',
              marginBottom: '2rem',
            }}
            className="title"
          >
            欢迎来到波动光学演示系统
          </div>

          <button
            style={ustyle}
            type="button"
            onClick={() => {
              enterGuide();
            }}
            className="custom-btn btn-5"
            id="welcome-mainbtn-0"
          >
            {ifKey && keynow === 0 && <SendOutlined />}
            教程（杨氏双缝）
          </button>

          {choices}
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: 100001,
        }}
      >
        <Space.Compact>
          <Button
            icon={<UpSquareOutlined />}
            onClick={() => {
              if (ifKey && keynow !== 0) {
                setKeynow(keynow - 1);
              } else if (!ifKey) {
                setIfKey(true);
                setKeynow(0);
              }
            }}
            id="welcome-btn-up"
          />
          <Button
            icon={<DownSquareOutlined />}
            onClick={() => {
              if (ifKey && keynow !== choices.length) {
                setKeynow(keynow + 1);
              } else if (!ifKey) {
                setIfKey(true);
                setKeynow(choices.length);
              }
            }}
            id="welcome-btn-down"
          />
          <Button
            icon={<CheckOutlined />}
            onClick={() => {
              if (ifKey) {
                setIfKey(false);
                document.getElementById(`welcome-mainbtn-${keynow}`)?.click();
              }
            }}
            id="welcome-btn-enter"
          />
          <Button
            icon={<StopOutlined />}
            onClick={() => {
              setIfKey(false);
            }}
          />
        </Space.Compact>
      </div>

      <SwitchExp
        exp=""
        styleConfig={styleConfig}
        setStyleConfig={setStyleConfig}
        onChange={() => {}}
        show={false}
        onChangeExp={(expMap) => {
          setExpMap(expMap);
        }}
      />
    </>
  );
}
