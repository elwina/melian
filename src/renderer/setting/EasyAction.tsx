import { Space, Button, Upload, message, Tooltip, ColorPicker } from 'antd';
import { DateTime } from 'luxon';
import { ElectronHandler } from 'main/preload';
import { useEffect, useRef, useState } from 'react';
import {
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose,
} from 'react-icons/vsc';
import { FaRegLightbulb } from 'react-icons/fa';
import {
  DownloadOutlined,
  UploadOutlined,
  ExpandOutlined,
  FileTextOutlined,
  SkinOutlined,
} from '@ant-design/icons';
import { InstrumentConfig, StyleConfig } from 'renderer/typing/config.type';
import { Updater } from 'use-immer';
import { autoResize } from 'renderer/utils/autoResize';
import { sleep } from 'renderer/utils/common';

interface propsType {
  styleConfig: StyleConfig;
  setStyleConfig: Updater<StyleConfig>;
  instrumentConfig: InstrumentConfig;
  onLoadStyle: (config: StyleConfig) => void;
}

export default function EasyAction({
  styleConfig,
  setStyleConfig,
  instrumentConfig,
  onLoadStyle,
}: propsType) {
  let ipcRenderer: ElectronHandler['ipcRenderer'] | null;
  try {
    ipcRenderer = window.electron.ipcRenderer
      ? window.electron.ipcRenderer
      : null;
  } catch {
    ipcRenderer = null;
  }
  const web = !ipcRenderer;

  const [messageApi, contextHolder] = message.useMessage();

  const dPathRef = useRef('');
  const download = async () => {
    if (web) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(
        new Blob([JSON.stringify(styleConfig, null, 2)])
      );
      a.download = `${DateTime.now().toFormat(
        'yyyyLLdd-HH:mm:ss'
      )}.mstyle.json`;
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
    setStyleConfig((draft) => {
      draft.global.dark = !draft.global.dark;
    });
  };

  const [resizeNum, setResizeNum] = useState(0);
  const [onResize, setOnResize] = useState(false);
  // const cilckResize = () => {
  //   setIfFirstResize(!ifFirstResize);
  //   document.getElementById('autoResize')?.click();
  // };
  useEffect(() => {
    if (resizeNum % 3 !== 0) {
      document.getElementById('autoResize')?.click();
    } else {
      setOnResize(false);
    }
  }, [resizeNum]);

  useEffect(() => {
    if (onResize) {
      messageApi.loading('自动调整中', 0);
    } else {
      messageApi.destroy();
    }
  }, [onResize]);

  return (
    <>
      {contextHolder}
      <Space.Compact id="easyaction">
        <Tooltip title="开/关灯">
          <Button
            icon={<FaRegLightbulb />}
            type={styleConfig.global.dark ? 'primary' : 'default'}
            onClick={darkChange}
            id="turnoff"
          />
        </Tooltip>
        <ColorPicker
          value={styleConfig.global.primaryColor}
          presets={[
            {
              label: 'Recommended',
              colors: [
                '#1677ff',
                '#722ed1',
                '#7cb305',
                '#cf1322',
                '#fa541c',
                '#eb2f96',
              ],
            },
          ]}
          disabledAlpha
          placement="topRight"
          onChange={(color) => {
            setStyleConfig((draft) => {
              draft.global.primaryColor = color.toHexString();
            });
          }}
        >
          <Tooltip title="换肤">
            <Button icon={<SkinOutlined />} />
          </Tooltip>
        </ColorPicker>
        <Tooltip title="自动定位">
          <Button
            icon={<ExpandOutlined />}
            onClick={async () => {
              setOnResize(true);
              autoResize(styleConfig, instrumentConfig, setStyleConfig);
              await sleep(1500);
              setResizeNum(resizeNum + 1);
              // cilckResize();
            }}
            type={onResize ? 'primary' : 'default'}
            id="autoResize"
          />
        </Tooltip>
        <Tooltip title="查看讲义">
          <Button
            icon={<FileTextOutlined />}
            onClick={() => {
              setStyleConfig((draft) => {
                draft.global.front = true;
              });
            }}
          />
        </Tooltip>
        <div id="iostyle">
          <Tooltip title="保存样式">
            <Button icon={<DownloadOutlined />} onClick={download} />
          </Tooltip>
          <Tooltip title="加载样式">
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
                      const newStyleConfig = JSON.parse(
                        e.target.result as string
                      );
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
          </Tooltip>
        </div>
        <Tooltip title="最大化">
          <Button
            icon={<VscChromeMaximize />}
            onClick={() => {
              if (ipcRenderer) ipcRenderer.maximize();
            }}
          />
        </Tooltip>
        <Tooltip title="还原">
          <Button
            icon={<VscChromeRestore />}
            onClick={() => {
              if (ipcRenderer) ipcRenderer.unmaximize();
            }}
          />
        </Tooltip>
        <Tooltip title="关闭">
          <Button
            icon={<VscChromeClose />}
            onClick={() => {
              if (ipcRenderer) ipcRenderer.close();
            }}
          />
        </Tooltip>
      </Space.Compact>
    </>
  );
}
