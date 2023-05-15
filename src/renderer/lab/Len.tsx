import { join } from 'path';
import {
  CSSProperties,
  Fragment,
  createElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { holderType, lenType } from 'renderer/Scene';
import DragMove from './DragMove';
import { lensConfig } from './lensConfig';

interface propsType {
  holderConf: holderType;
  lenConf: lenType;
}
export default function Len({ holderConf: hF, lenConf: lF }: propsType) {
  const lenConfig = lensConfig[lF.uname];
  if (lenConfig === undefined) {
    return <div />;
  }

  const canvaRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageReady, setImageReady] = useState(false);

  const { width: lenWidth, height: lenHeight, imgurl: svgurl } = lenConfig;

  const bottomCalc = hF.bottomMargin + hF.holderHeight;
  const leftCalc =
    hF.leftMargin +
    hF.leftPadding +
    lF.distancemm * hF.xScale -
    (lenWidth * hF.lenScaleX) / 2; // canvas左边界
  const heightCalc = hF.upHeight;
  const widthCalc = lenWidth * hF.lenScaleX;

  useEffect(() => {
    if (imageReady === false) {
      return;
    }

    const img = imageRef.current;
    if (img === null) {
      return;
    }

    if (canvaRef.current === null) {
      return;
    }
    const ctx = canvaRef.current.getContext('2d');
    if (ctx === null || ctx === undefined) {
      return;
    }

    const cwidth = canvaRef.current.width;
    const cheight = canvaRef.current.height;
    canvaRef.current.width = cwidth;
    canvaRef.current.height = cheight;

    // 画镜筒
    const t_w = 0.05 * cwidth;
    const tubeStartX = (cwidth - t_w) / 2 - t_w;
    const tubeStartY =
      cheight - hF.baselineHeight + (lenHeight * hF.lenScaleY) / 2;
    const tubeWidth = 2 * t_w;
    const tubeHeight = cheight - tubeStartY;
    ctx.save();
    ctx.fillStyle = '#686868';
    ctx.strokeStyle = '#000000';
    ctx.fillRect(tubeStartX, tubeStartY, tubeWidth, tubeHeight);
    ctx.strokeRect(tubeStartX, tubeStartY, tubeWidth, tubeHeight);

    ctx.restore();

    // 画镜面
    const imgStartX = 0;
    const imgStartY =
      cheight - hF.baselineHeight - (lenHeight * hF.lenScaleY) / 2;
    ctx.save();
    ctx.drawImage(
      img,
      imgStartX,
      imgStartY,
      lenWidth * hF.lenScaleX,
      lenHeight * hF.lenScaleY
    );
    ctx.restore();

    // 画字
    const textHeight = imgStartY;
    const textWidth = ctx.measureText(lF.name).width;
    const textStartH = new Array(lF.name.length).fill(0).map((_, i) => {
      return (textHeight * i) / lF.name.length;
    });
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.font = `normal ${hF.fontSize}px 黑体`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    textStartH.forEach((h, i) => {
      ctx.fillText(lF.name[i], cwidth / 2, h);
    });
  }, [imageReady, hF, lF]);

  return (
    <>
      <canvas
        style={{
          position: 'fixed',
          bottom: bottomCalc,
          left: leftCalc,
          backgroundColor: '#ffffff00',
        }}
        height={heightCalc}
        width={widthCalc}
        ref={canvaRef}
      />
      <div style={{ display: 'none' }}>
        <img
          src={svgurl}
          ref={imageRef}
          height={lenHeight}
          width={lenWidth}
          style={{ backgroundColor: '#ffffff00' }}
          onLoad={() => {
            setImageReady(true);
          }}
        />
      </div>
    </>
  );
}
