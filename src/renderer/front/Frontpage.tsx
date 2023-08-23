import { Button, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { Updater } from 'use-immer';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';

import type { InstrumentConfig, StyleConfig } from '../typing/config.type';
import { ImagePPT } from './ImagePPT';

export type DesType = 'image';

interface propsType {
  styleConfig: StyleConfig;
  instrumentConfig: InstrumentConfig;
  setInstrumentConfig: Updater<InstrumentConfig>;
  setStyleConfig: Updater<StyleConfig>;
}

export default function FrontPage({
  styleConfig,
  instrumentConfig,
  setInstrumentConfig,
  setStyleConfig,
}: propsType) {
  const [nowPage, setNowPage] = useState<number>(0);

  useEffect(() => {
    setNowPage(0);

    if (!instrumentConfig.des) {
      setStyleConfig((draft) => {
        draft.global.front = false;
      });
    }
  }, [instrumentConfig.name]);

  const totalPage = instrumentConfig.des?.content.length ?? 1;

  const SideRender = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        alignItems: 'center',
      }}
    >
      <Space
        direction="vertical"
        style={{ width: '100%' }}
        align="center"
        size="large"
      >
        <Tooltip title="进入已调整为最佳布局的实验操作界面" zIndex={10001}>
          <Button
            size="large"
            type="primary"
            block
            onClick={() => {
              setStyleConfig((draft) => {
                draft.global.front = false;
              });
              document.getElementById('autoResize')?.click();
            }}
            className="enter-btn"
          >
            进入并定位
          </Button>
        </Tooltip>

        <Tooltip title="进入现有布局的实验操作界面" zIndex={10001}>
          <Button
            size="large"
            block
            onClick={() => {
              setStyleConfig((draft) => {
                draft.global.front = false;
              });
            }}
          >
            直接进入
          </Button>
        </Tooltip>
        <Space.Compact block size="large" className="ppt-slider">
          <Button
            size="large"
            icon={<LeftCircleOutlined />}
            disabled={nowPage === 0}
            onClick={() => {
              setNowPage(nowPage - 1);
            }}
          />
          <Button
            icon={<RightCircleOutlined />}
            size="large"
            disabled={nowPage === totalPage - 1}
            onClick={() => {
              setNowPage(nowPage + 1);
            }}
          />
        </Space.Compact>
      </Space>
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)',

        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 5,
        userSelect: 'none',

        zIndex: 10000,

        display: 'grid',
        gridTemplateColumns: '10% 80% 10%',
        gridTemplateRows: '100%',
      }}
    >
      {SideRender}
      <div
        style={{
          gridColumn: '2 / 3',
          gridRow: '1 / 2',
        }}
      >
        {instrumentConfig.des?.type === 'image' ? (
          <ImagePPT instrumentConfig={instrumentConfig} nowPage={nowPage} />
        ) : (
          <div />
        )}
      </div>
      {SideRender}
    </div>
  );
}
