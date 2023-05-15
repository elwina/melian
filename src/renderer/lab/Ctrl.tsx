import { Button } from 'antd';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import type { ctrlType, holderType, lenType } from 'renderer/Scene';
import { inArray } from 'renderer/utils/array';
import { Updater } from 'use-immer';
import { useState } from 'react';
import DragMove from './DragMove';

interface propsType {
  ctrlConf: ctrlType;
  holderConf: holderType;
  lensConf: lenType[];
  setLens: Updater<lenType[]>;
}

export default function Ctrl({
  ctrlConf: cF,
  holderConf: hF,
  lensConf: lF,
  setLens,
}: propsType) {
  const [ch, setch] = useState(document.body.clientHeight);
  document.body.onresize = () => {
    setch(document.body.clientHeight);
  };

  return (
    <div
      style={{
        position: 'fixed',

        left: hF.leftMargin,
        top: ch - hF.bottomMargin,
        width: 2 * hF.leftPadding + hF.holderWidthmm * hF.xScale,
      }}
    >
      {lF.map((len, i) => {
        return (
          <div
            key={len.id}
            style={{
              position: 'absolute',
              left: hF.leftPadding + len.distancemm * hF.xScale,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            <div>{inArray(i, cF.showmm) ? len.distancemm : ' '}</div>
            {inArray(i, cF.move) && (
              <>
                <DragMove
                  id={i}
                  lensConf={lF}
                  holderConf={hF}
                  setLens={setLens}
                />
                <AiFillCaretLeft
                  onClick={() => {
                    setLens((draft) => {
                      draft[i].distancemm -= 1;
                    });
                  }}
                />
                <AiFillCaretRight
                  onClick={() => {
                    setLens((draft) => {
                      draft[i].distancemm += 1;
                    });
                  }}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
