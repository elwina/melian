import young1 from '../../../assets/des/young1.png';
import young2 from '../../../assets/des/young2.png';
import young3 from '../../../assets/des/young3.png';
import fresnel_hole1 from '../../../assets/des/fresnel_hole1.png';
import fresnel_hole2 from '../../../assets/des/fresnel_hole2.png';
import fresnel_hole3 from '../../../assets/des/fresnel_hole3.png';
import fresnel_hole4 from '../../../assets/des/fresnel_hole4.png';
import opticalgrating1 from '../../../assets/des/opticalgrating1.png';
import opticalgrating2 from '../../../assets/des/opticalgrating2.png';
import opticalgrating3 from '../../../assets/des/opticalgrating3.png';
import polarization1 from '../../../assets/des/polarization1.png';
import polarization2 from '../../../assets/des/polarization2.png';
import polarization3 from '../../../assets/des/polarization3.png';
import polarization4 from '../../../assets/des/polarization4.png';
import singlesilt1 from '../../../assets/des/singlesilt1.png';
import singlesilt2 from '../../../assets/des/singlesilt2.png';
import singlesilt3 from '../../../assets/des/singlesilt3.png';
import singlesilt4 from '../../../assets/des/singlesilt4.png';

const reg: Record<string, string> = {
  young1: young1,
  young2: young2,
  young3: young3,
  fresnel_hole1: fresnel_hole1,
  fresnel_hole2: fresnel_hole2,
  fresnel_hole3: fresnel_hole3,
  fresnel_hole4: fresnel_hole4,
  opticalgrating1: opticalgrating1,
  opticalgrating2: opticalgrating2,
  opticalgrating3: opticalgrating3,
  polarization1: polarization1,
  polarization2: polarization2,
  polarization3: polarization3,
  polarization4: polarization4,
  singlesilt1: singlesilt1,
  singlesilt2: singlesilt2,
  singlesilt3: singlesilt3,
  singlesilt4: singlesilt4,
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
