import convex_lens01_svg from '../../../assets/lens/convex_lens01.svg';
import single_slit01_svg from '../../../assets/lens/single_slit01.svg';
import light01_svg from '../../../assets/lens/light01.svg';
import double_slit01_svg from '../../../assets/lens/double_slit01.svg';
import measure_lens01_svg from '../../../assets/lens/measure_lens01.svg';

export interface LenModelConfig {
  height: number;
  width: number;

  imgurl: string;
}
export const lensConfig: Map<string, LenModelConfig> = new Map([
  [
    'convex_lens01',
    {
      height: 60,
      width: 30,
      imgurl: convex_lens01_svg,
    },
  ],
  [
    'single_slit01',
    {
      height: 20,
      width: 15,
      imgurl: single_slit01_svg,
    },
  ],
  [
    'light01',
    {
      height: 40,
      width: 30,
      imgurl: light01_svg,
    },
  ],
  [
    'filter01',
    {
      height: 20,
      width: 15,
      imgurl: single_slit01_svg,
    },
  ],
  [
    'double_slit01',
    {
      height: 20,
      width: 15,
      imgurl: double_slit01_svg,
    },
  ],
  [
    'measure_head01',
    {
      height: 60,
      width: 60,
      imgurl: measure_lens01_svg,
    },
  ],
]);
