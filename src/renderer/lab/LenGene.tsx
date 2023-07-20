import { CSSProperties, useEffect, useRef } from 'react';
import { InstrumentConfig, StyleConfig } from 'renderer/config.type';
import Len from './Len';

interface propsType {
  styleConfig: StyleConfig;
  instrumentConfig: InstrumentConfig;
}
export default function LenGene({ styleConfig, instrumentConfig }: propsType) {
  const { lens } = instrumentConfig;

  return (
    <>
      {lens.map((len) => {
        return <Len key={len.id} lenConf={len} styleConfig={styleConfig} />;
      })}
    </>
  );
}
