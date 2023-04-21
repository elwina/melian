import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Len() {
  const [le, setLe] = useState(10);
  const sty: React.CSSProperties = {
    position: 'absolute',
    bottom: 50,
    height: 100,
    left: le,
    width: 20,
    backgroundColor: 'red',
  };

  return (
    <div style={sty}>
      <FontAwesomeIcon
        icon={faArrowLeft}
        onClick={() => {
          setLe(le - 10);
        }}
      />
      <FontAwesomeIcon
        icon={faArrowRight}
        onClick={() => {
          setLe(le + 10);
        }}
      />

      <div>透镜</div>
    </div>
  );
}
