import React from 'react';
import Holder from './lab/Holder';
import Len from './lab/Len';

export default function Scene() {
  const sty: React.CSSProperties = {
    position: 'fixed',
    left: 30,
    top: 100,
    height: 300,
    width: 800,
  };

  return (
    <div style={sty}>
      <Len />
      <Len />
      <Len />
      <Len />
      <Holder />
    </div>
  );
}
