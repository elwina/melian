import { normalization } from 'renderer/utils/array';

export function light2rgb(la: number): [number, number, number, number] {
  // ka 纳米
  let r;
  let g;
  let b;
  if (la >= 420 && la <= 440) {
    r = (-255 * (la - 440)) / (440 - 420);
    g = 0;
    b = 255;
  } else if (la > 440 && la <= 490) {
    r = 0;
    g = (255 * (la - 440)) / (490 - 440);
    b = 255;
  } else if (la > 490 && la <= 510) {
    r = 0;
    g = 255;
    b = (-255 * (la - 510)) / (510 - 490);
  } else if (la > 510 && la <= 580) {
    r = (255 * (la - 510)) / (580 - 510);
    g = 255;
    b = 0;
  } else if (la > 580 && la <= 645) {
    r = 255;
    g = (-255 * (la - 645)) / (645 - 580);
    b = 0;
  } else if (la > 645 && la <= 720) {
    r = 255;
    g = 0;
    b = 0;
  } else {
    r = 0;
    g = 0;
    b = 0;
  }
  return [r, g, b, 255];
}

export function mutiLight2rgb(wave: number[], instense: number[]) {
  let total = 0;
  let rr = 0;
  let rg = 0;
  let rb = 0;

  let ifInf = false;
  for (let i = 0; i < wave.length; i++) {
    const w = wave[i];
    const ins = instense[i];

    if (ins === Infinity) {
      ifInf = true;
    }

    if (w < 420 || w > 720) {
      // 不可见光
      continue;
    }
    total++;
    let [r, g, b, a] = light2rgb(w);
    a = 255;

    r = r * ins;
    g = g * ins;
    b = b * ins;

    rr = rr + r;
    rg = rg + g;
    rb = rb + b;
  }
  rr = rr / total;
  rg = rg / total;
  rb = rb / total;

  // if (Number.isNaN(rr)) {
  //   rr = 255;
  // }
  // if (Number.isNaN(rg)) {
  //   rg = 255;
  // }
  // if (Number.isNaN(rb)) {
  //   rb = 255;
  // }

  if (ifInf && wave.length > 1) {
    return [255, 255, 255, 255];
  }

  return [rr, rg, rb, 255];
}
