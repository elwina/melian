import young1 from '../../../assets/des/young1.png';
import young2 from '../../../assets/des/young2.png';
import young3 from '../../../assets/des/young3.png';

const reg: Record<string, string> = {
  young1: young1,
  young2: young2,
  young3: young3,
};

export function getImg(arr: string[]) {
  const re: string[] = [];

  for (let i = 0; i < arr.length; i++) {
    const str = arr[i];

    // 读取内置的图片
    if (str[0] === '[') {
      const key = str.slice(1, str.length - 1);
      re.push(reg[key]);
    } else {
      // 读取本地图片
    }
  }

  return re;
}
