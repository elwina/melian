export function normalization(array: number[]) {
  const min = Math.min(...array);
  const max = Math.max(...array);
  const re = array.map((v) => (v - min) / (max - min));
  return re;
}
