import { Fragment, useEffect, useRef, useState } from 'react';
import { LenConfig, StyleConfig } from 'renderer/typing/config.type';
import { lensConfig } from './lensConfig';

interface propsType {
  styleConfig: StyleConfig;
  lenConf: LenConfig;
}
export default function Len({ styleConfig, lenConf: lF }: propsType) {
  const hStyle = styleConfig.holder;

  let lenConfig = lensConfig.get(lF.uname);
  if (lenConfig === undefined) {
    lenConfig = {
      width: 0,
      height: 0,
      imgurl: '',
    };
  }

  const canvaRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageReady, setImageReady] = useState(false);

  const { width: lenWidth, height: lenHeight, imgurl: svgurl } = lenConfig;

  const bottomCalc = hStyle.bottomMargin + hStyle.holderHeight;
  const leftCalc =
    hStyle.leftMargin +
    hStyle.leftPadding +
    lF.distancemm * hStyle.xScale -
    (lenWidth * hStyle.lenScaleX) / 2; // canvas左边界
  const heightCalc = hStyle.upHeight;
  const widthCalc = lenWidth * hStyle.lenScaleX + 2;

  useEffect(() => {
    if (imageReady === false) {
      return;
    }
    let lenConfig = lensConfig.get(lF.uname);
    if (lenConfig === undefined) {
      lenConfig = {
        width: 0,
        height: 0,
        imgurl: '',
      };
    }
    const { width: lenWidth, height: lenHeight, imgurl: svgurl } = lenConfig;

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
    const t_w = 2.5 * hStyle.xScale;
    const tubeStartX = cwidth / 2 - t_w;
    const tubeStartY =
      cheight - hStyle.baselineHeight + (lenHeight * hStyle.lenScaleY) / 2;
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
      cheight - hStyle.baselineHeight - (lenHeight * hStyle.lenScaleY) / 2;
    ctx.save();
    ctx.drawImage(
      img,
      imgStartX,
      imgStartY,
      lenWidth * hStyle.lenScaleX,
      lenHeight * hStyle.lenScaleY
    );
    ctx.restore();

    // 画字
    const textHeight = imgStartY;
    // const textWidth = ctx.measureText(lF.name).width;
    const textStartH = new Array(lF.name.length).fill(0).map((_, i) => {
      return (textHeight * i) / lF.name.length;
    });
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.font = `normal ${hStyle.fontSize}px 黑体`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    textStartH.forEach((h, i) => {
      ctx.fillText(lF.name[i], cwidth / 2, h);
    });
  }, [imageReady, hStyle, lF, lenConfig, styleConfig]);

  return (
    <>
      <div style={{ display: 'none' }}>
        <img
          src={svgurl}
          ref={imageRef}
          height={lenHeight}
          width={lenWidth}
          style={{ backgroundColor: '#ffffff00' }}
          alt=" "
          onLoad={() => {
            setImageReady(true);
          }}
        />
      </div>
      {!styleConfig.global.dark ? (
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
        </>
      ) : (
        <div
          style={{
            position: 'fixed',
            bottom: bottomCalc,
            left: leftCalc + widthCalc / 2,
            transform: 'translateX(-50%)',
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
          }}
        >
          {lF.name}
        </div>
      )}
    </>
  );
}
