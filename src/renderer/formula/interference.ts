export function singleLight(d: number, r0: number, la: number, n = 1) {
  // 单色光光强叠加
  // d 双缝间距
  // r0 双缝到光屏
  // n 折射率
  // la 波长

  const pi = Math.PI;
  const k = (2 * pi) / la;
  const delta = (y: number) => {
    return (n * d * y) / r0;
  };
  return (y: number) => {
    return 1 * Math.cos((((2 * pi) / la) * n * d * y) / r0 / 2) ** 2;
  };
}
