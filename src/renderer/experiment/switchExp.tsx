import { useMap } from 'ahooks';
import { Button, Select } from 'antd';
import { ElectronHandler } from 'main/preload';
import { useEffect, useRef, useState } from 'react';
import { InstrumentConfig } from 'renderer/config.type';
import { Updater } from 'use-immer';
import { defaultExpMap } from './default';

type propType = {
  exp: string;
  onChange: (name: string, config: InstrumentConfig) => void;
};

export default function SwitchExp({ exp, onChange }: propType) {
  let ipcRenderer: ElectronHandler['ipcRenderer'] | null;
  try {
    ipcRenderer = window.electron.ipcRenderer
      ? window.electron.ipcRenderer
      : null;
  } catch {
    ipcRenderer = null;
  }

  const [expMap, { set: setExpMap }] = useMap(defaultExpMap);

  async function loadExperiments() {
    if (ipcRenderer) {
      const re: InstrumentConfig[] = await ipcRenderer.invoke(
        'loadExperiments',
        []
      );
      re.forEach((conf) => {
        setExpMap(conf.name, conf);
      });
    }
  }

  useEffect(() => {
    loadExperiments();
  }, []);

  const [expOpt, setExpOpt] = useState([
    { label: 'loading', value: 'loading' },
  ]);
  const [ifOpen, setIfOpen] = useState<boolean>(false);
  useEffect(() => {
    const arr = Array.from(expMap);
    setIfOpen(false);
    setExpOpt(
      arr.map(([label, value]) => {
        return { label: label, value: label };
      })
    );
    setIfOpen(true);
  }, [expMap]);

  function changeConfig(name: string) {
    onChange(name, expMap.get(name) as InstrumentConfig);
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 200,
        right: 0,
        zIndex: 200,
      }}
    >
      <Select
        placement="topLeft"
        value={exp}
        options={expOpt}
        open={ifOpen}
        onChange={(value) => {
          changeConfig(value);
        }}
      />
      <br />
      <Button
        onClick={() => {
          loadExperiments();
        }}
      >
        刷新
      </Button>
    </div>
  );
}
