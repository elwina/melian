import React from 'react';

export default function Holder() {
  const sty: React.CSSProperties = {
    position: 'absolute',
    bottom: 20,
    width: 700,
    backgroundColor: 'yellow',
  };

  return <div style={sty}>这是一个光具座</div>;
}
