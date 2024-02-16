import { CIE_2015_10_Degree_Standard_Observer } from './CIE_2015_10_Degree_Standard_Observer';

export function light2rgb(la: number): [number, number, number, number] {
  // ka 纳米

  if (la > 780 || la < 390) {
    return [0, 0, 0, 255];
  }

  const newla = Math.round(la * 10);

  const [r, g, b] = CIE_2015_10_Degree_Standard_Observer[newla];

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

  if (ifInf && wave.length > 1) {
    return [255, 255, 255, 255];
  }

  return [rr, rg, rb, 255];
}
