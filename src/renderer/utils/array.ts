// 归一化函数，若全部为相同值则输出全1数组
export function normalization(array: number[]) {
  const min = Math.min(...array);
  const max = Math.max(...array);
  if (max === min) {
    return array.map(() => 1);
  } else {
    return array.map((v) => (v - min) / (max - min));
  }
}

// 数组逐个乘法
export function multiplyArrays(arr1: number[], arr2: number[]) {
  return arr1.map((v, i) => v * arr2[i]);
}
