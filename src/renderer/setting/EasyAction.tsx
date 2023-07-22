import { Space, Button, Upload, message } from 'antd';
import { DateTime } from 'luxon';
import { ElectronHandler } from 'main/preload';
import { useRef } from 'react';
import {
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose,
} from 'react-icons/vsc';
import { FaRegLightbulb } from 'react-icons/fa';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { StyleConfig } from 'renderer/typing/config.type';

interface propsType {
  styleConfig: StyleConfig;
  onLoadStyle: (config: StyleConfig) => void;
}

export default function EasyAction({ styleConfig, onLoadStyle }: propsType) {
  let ipcRenderer: ElectronHandler['ipcRenderer'] | null;
  try {
    ipcRenderer = window.electron.ipcRenderer
      ? window.electron.ipcRenderer
      : null;
  } catch {
    ipcRenderer = null;
  }
  const web = !ipcRenderer;

  const dPathRef = useRef('');
  const download = async () => {
    if (web) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(
        new Blob([JSON.stringify(styleConfig, null, 2)])
      );
      a.download = `${DateTime.now().toFormat(
        'yyyyLLdd-HH:mm:ss'
      )}.melian.json`;
      a.click();
    }

    if (!web) {
      if (!ipcRenderer) return;
      const path = await ipcRenderer.invoke('saveConf', [
        dPathRef.current,
        styleConfig,
      ]);
      if (path !== '') {
        dPathRef.current = path;
      }
    }
  };

  const load = async () => {
    if (!ipcRenderer) return;
    const { status, config, path } = await ipcRenderer.invoke('loadConf', [
      dPathRef.current,
    ]);
    if (!status) {
      // 加载失败
      throw new Error('加载失败');
    } else {
      // 加载成功
      dPathRef.current = path;
      onLoadStyle(config);
    }
  };

  const darkChange = () => {
    document.getElementsByTagName('body')[0].className =
      document.getElementsByTagName('body')[0].className === 'dark-mode'
        ? 'light-mode'
        : 'dark-mode';
  };

  return (
    <Space.Compact>
      <Button icon={<FaRegLightbulb />} onClick={darkChange} />
      <Button icon={<DownloadOutlined />} onClick={download} />
      {web ? (
        <Upload
          beforeUpload={(file) => {
            if (file.type !== 'application/json') {
              message.error('请上传json文件');
            }
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
              if (e.target) {
                const newStyleConfig = JSON.parse(e.target.result as string);
                onLoadStyle(newStyleConfig);
              }
            };
            return false;
          }}
          accept=".mstyle.json"
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />} />
        </Upload>
      ) : (
        <Button icon={<UploadOutlined />} onClick={load} />
      )}
      <Button
        icon={<VscChromeMaximize />}
        onClick={() => {
          if (ipcRenderer) ipcRenderer.maximize();
        }}
      />{' '}
      <Button
        icon={<VscChromeRestore />}
        onClick={() => {
          if (ipcRenderer) ipcRenderer.unmaximize();
        }}
      />{' '}
      <Button
        icon={<VscChromeClose />}
        onClick={() => {
          if (ipcRenderer) ipcRenderer.close();
        }}
      />
    </Space.Compact>
  );
}
