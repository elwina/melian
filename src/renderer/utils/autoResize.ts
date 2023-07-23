import { max } from 'mathjs';
import { lensConfig } from 'renderer/lab/lensConfig';
import type {
  InstrumentConfig,
  StyleConfig,
} from 'renderer/typing/config.type';
import { Updater } from 'use-immer';

export function autoResize(
  styleConfig: StyleConfig,
  instrumentConfig: InstrumentConfig,
  setStyleConfig: Updater<StyleConfig>,
  re = true
) {
  const bodyHeight = document.body.clientHeight;
  const bodyWidth = document.body.clientWidth;

  const screenHTML = document.getElementById('screen');
  const measureHTML = document.getElementById('measure');
  const ctrlHTML = document.getElementById('ctrl');
  const switchExpHTML = document.getElementById('switchExp');
  const settingHTML = document.getElementById('setting');

  const upDownPercent = [0.5, 0.5];

  const ifMeasure = instrumentConfig.measure.type !== 'None';

  const adjustScreen = (h: number, w: number) => {
    const type = instrumentConfig.screen.type;
    if (!screenHTML) return;
    const nowHeight = screenHTML.clientHeight;
    const nowWidth = screenHTML.clientWidth;

    if (type === 'Board') {
      const oldXScale = styleConfig.screen[type].scaleX;
      const oldYScale = styleConfig.screen[type].scaleY;
      const newXScale = (oldXScale * w) / nowWidth;
      const newYScale = (oldYScale * h) / nowHeight;
      setStyleConfig((draft) => {
        draft.screen[type].scaleX = newXScale;
        draft.screen[type].scaleY = newYScale;
      });
    }
    if (type === 'BoardPolar') {
      const targethw = Math.min(h, w);
      const oldScale = styleConfig.screen[type].scaleX;
      const newScale = (oldScale * targethw) / nowWidth;
      setStyleConfig((draft) => {
        draft.screen[type].scaleX = newScale;
        draft.screen[type].scaleY = newScale;
      });
    }

    if (type === 'FixedCircle' || type === 'FixedCirclePolar') {
      const targethw = Math.min(h, w);
      const oldScale = styleConfig.screen[type].scaleX;
      const newScale = (oldScale * targethw) / nowWidth;
      setStyleConfig((draft) => {
        draft.screen[type].scaleX = newScale;
        draft.screen[type].scaleY = newScale;
      });
    }
  };

  const adjustScreenPos = (b: number) => {
    const type = instrumentConfig.screen.type;
    if (!screenHTML) return;

    if (
      type === 'Board' ||
      type === 'BoardPolar' ||
      type === 'FixedCircle' ||
      type === 'FixedCirclePolar'
    ) {
      // 定位
      setStyleConfig((draft) => {
        if (b) {
          draft.screen[type].bottomMargin = b;
        }
      });
    }
  };

  const adjustScreenCenter = (half = false) => {
    const type = instrumentConfig.screen.type;
    if (!screenHTML) return;
    const nowHeight = screenHTML.clientHeight;
    const nowWidth = screenHTML.clientWidth;
    const nowLeft = screenHTML.getBoundingClientRect().left;

    let move = (bodyWidth - nowWidth) / 2 - nowLeft;
    if (half) {
      move = (bodyWidth / 2 - nowWidth) / 2 - nowLeft;
    }

    if (
      type === 'Board' ||
      type === 'BoardPolar' ||
      type === 'FixedCircle' ||
      type === 'FixedCirclePolar'
    ) {
      // 定位
      setStyleConfig((draft) => {
        draft.screen[type].leftMargin += move;
      });
    }
  };

  const adjustMeasure = (h: number, w: number, l: number, b?: number) => {
    const type = instrumentConfig.measure.type;
    if (!measureHTML) return;
    const nowHeight = measureHTML.clientHeight;
    const nowWidth = measureHTML.clientWidth;

    if (type === 'Square' || type === 'Circle') {
      // 定位
      setStyleConfig((draft) => {
        draft.measure[type].leftMargin = l;
        if (b) draft.measure[type].bottomMargin = b;
      });
    }

    if (type === 'Circle') {
      const scale1 = h / nowHeight;
      const scale2 = w / nowWidth;
      const scale = Math.min(scale1, scale2);
      setStyleConfig((draft) => {
        draft.measure[type].seeSize *= scale;
        draft.measure[type].bigHeight *= scale;

        draft.measure[type].mainLine *= scale;
        draft.measure[type].hLine *= scale;

        draft.measure[type].mm2px *= scale;
      });
    }
  };

  const adjustMeasureHCenter = (t: number) => {
    const type = instrumentConfig.measure.type;
    if (!measureHTML) return;
    const nowHeight = measureHTML.clientHeight;
    const nowTop = measureHTML.getBoundingClientRect().top;

    const move = -t / 2 + (nowHeight / 2 + nowTop);

    if (type === 'Square' || type === 'Circle') {
      // 定位
      setStyleConfig((draft) => {
        draft.measure[type].bottomMargin += move;
      });
    }
  };

  // 上部调节
  const recUpSize = bodyHeight * upDownPercent[0];
  if (ifMeasure) {
    // 平分策略
    const halfWidth = bodyWidth / 2;
    const per = 0.9;
    const tarHeight = recUpSize * per;
    const tarWidth = halfWidth * per;
    const wpad = 80;
    const hpad = 20;
    adjustScreen(tarHeight, tarWidth);
    adjustScreenPos(bodyHeight - recUpSize + hpad);
    adjustScreenCenter(true);

    adjustMeasure(tarHeight, tarWidth, wpad + halfWidth, undefined);
    adjustMeasureHCenter(recUpSize - hpad);
  } else {
    // 占满
    const per = 0.8;
    const tarHeight = recUpSize * per;
    const tarWidth = bodyWidth * per;
    const hpad = 20;
    adjustScreenPos(bodyHeight - recUpSize + hpad);
    adjustScreen(tarHeight, tarWidth);

    adjustScreenCenter();
  }

  // 下部调节
  // setting
  let maxSettingHeight = 0;
  if (settingHTML) {
    for (let i = 0; i < settingHTML.children.length; i++) {
      const child = settingHTML.children[i] as HTMLElement;
      maxSettingHeight = max(child.clientHeight, maxSettingHeight);
    }
  }
  setStyleConfig((draft) => {
    draft.setting.height = maxSettingHeight;
  });

  const recSettingSize = maxSettingHeight;

  const shpad = 20;

  const recDownSize = bodyHeight * upDownPercent[1] - recSettingSize - shpad;
  const recDownBottom = recSettingSize + shpad;

  const adjustDown = () => {
    if (!ctrlHTML) return;
    let nowCtrlTopHeight = 0;
    for (let i = 0; i < ctrlHTML.children.length; i++) {
      const child = ctrlHTML.children[i] as HTMLElement;
      nowCtrlTopHeight = max(child.clientHeight, nowCtrlTopHeight);
    }

    let nowMaxLenHeight = 0;
    let mostName = 0;

    for (let i = 0; i < instrumentConfig.lens.length; i++) {
      const len = instrumentConfig.lens[i];
      if (len.hide) continue;
      let lenHeight = lensConfig.get(len.uname)?.height;
      if (!lenHeight) continue;
      lenHeight = lenHeight * styleConfig.holder.lenScaleY;
      nowMaxLenHeight = max(lenHeight, nowMaxLenHeight);

      mostName = max(len.name.length, mostName);
    }

    const recNameHeight = 20 * mostName;
    const recLenStickHeightMin = bodyHeight / 40;

    const nowHolderHeight = styleConfig.holder.holderHeight;
    const nowLenHeight = styleConfig.holder.upHeight;

    const hpad = 10;
    const targetLenHeight =
      recDownSize - nowCtrlTopHeight - nowHolderHeight - hpad;

    let yScale = 1;
    const nowSLenMH = targetLenHeight - recNameHeight - recLenStickHeightMin;
    yScale = (nowSLenMH / nowMaxLenHeight) * styleConfig.holder.lenScaleY;

    const xScale = yScale * 1.1;

    const targetBaseLineHeight = nowSLenMH / 2 + recLenStickHeightMin;

    setStyleConfig((draft) => {
      draft.holder.upHeight = targetLenHeight;
      draft.holder.baselineHeight = targetBaseLineHeight;
      draft.holder.lenScaleY = yScale;
      draft.holder.lenScaleX = xScale;
    });

    if (!switchExpHTML) return;
    const nowSwitchWidth = switchExpHTML.clientWidth;
    const targetSwitchBottom = recSettingSize + shpad;

    // 定位
    setStyleConfig((draft) => {
      draft.holder.bottomMargin = recDownBottom + nowCtrlTopHeight;

      draft.setting.expHeight = targetSwitchBottom;
    });
  };
  adjustDown();

  // 调整横线
  const adjustHolderWidth = () => {
    if (!switchExpHTML) return;
    const nowSwitchWidth = switchExpHTML.clientWidth;

    const widthper = 0.9;
    const targetHolderWidth = (bodyWidth - nowSwitchWidth) * widthper;

    // 得到镜头最远
    let maxLenDis = 0;
    for (let i = 0; i < instrumentConfig.lens.length; i++) {
      const len = instrumentConfig.lens[i];
      if (len.hide) continue;
      maxLenDis = max(len.distancemm, maxLenDis);
    }
    const moredis = 50;
    const targetHolderWidthmm = maxLenDis + moredis;

    const targetXScale = targetHolderWidth / targetHolderWidthmm;

    // 定位
    const targetleft = ((bodyWidth - nowSwitchWidth) * (1 - widthper)) / 2;

    setStyleConfig((draft) => {
      draft.holder.holderWidthmm = targetHolderWidthmm;
      draft.holder.xScale = targetXScale;

      draft.holder.leftMargin = targetleft;
    });
  };
  adjustHolderWidth();
}
