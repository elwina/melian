import { CSSProperties, useRef, useState } from 'react';
import SwitchExp from 'renderer/experiment/switchExp';
import { InstrumentConfig, StyleConfig } from 'renderer/typing/config.type';
import { Updater } from 'use-immer';
import backjpg from '../../../assets/back1.jpg';

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
    color: '#ffffff',
    fontSize: '2rem',
    fontFamily: 'STSong SimSun',

    marginTop: '2rem',
    backdropFilter: 'blur(5px)',
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

  const choices = Array.from(expMap.keys()).map((name) => {
    return (
      <button
        style={ustyle}
        type="button"
        onClick={() => {
          enterExp(name);
        }}
        key={name}
      >
        <div>{name}</div>
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
          gridTemplateColumns: '1fr 1fr',
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
              fontSize: '3rem',
              color: '#ffffff',
              fontFamily: 'STFangsong FangSong',

              marginTop: '2rem',
            }}
          >
            欢迎来到波动光学演示系统！
          </div>

          <button
            style={ustyle}
            type="button"
            onClick={() => {
              enterGuide();
            }}
          >
            <div>教程</div>
          </button>

          {choices}
        </div>
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
