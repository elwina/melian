export function normalization(array: number[]) {
  const min = Math.min(...array);
  const max = Math.max(...array);
  const re = array.map((v) => (v - min) / (max - min));
  return re;
}

export function multiplyArrays(arr1: number[], arr2: number[]) {
  var result = [];
  for (var i = 0; i < arr1.length; i++) {
    result.push(arr1[i] * arr2[i]);
  }
  return result;
}
