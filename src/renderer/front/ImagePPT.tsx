import { Button, Carousel, Image } from 'antd';
import { useState } from 'react';
import { InstrumentConfig } from 'renderer/typing/config.type';
import { getImg } from './getImg';
import './imagePPT.css';

interface propsType {
  instrumentConfig: InstrumentConfig;
  nowPage: number;
}

export function ImagePPT({ instrumentConfig, nowPage }: propsType) {
  if (!instrumentConfig.des?.content) return <div />;
  const imgs = getImg(instrumentConfig.des?.content);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <img
          src={imgs[nowPage]}
          alt="教义PPT"
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      </div>
    </>
  );
}
