import convex_lens01_svg from '../../../assets/lens/convex_lens01.svg';
import single_slit01_svg from '../../../assets/lens/single_slit01.svg';
import light01_svg from '../../../assets/lens/light01.svg';
import double_slit01_svg from '../../../assets/lens/double_slit01.svg';
import measure_lens01_svg from '../../../assets/lens/measure_lens01.svg';
import measure_lens02_svg from '../../../assets/lens/measure_lens02.svg';
import board01_svg from '../../../assets/lens/board01.svg';
import raster01_svg from '../../../assets/lens/raster01.svg';
import polarizer01_svg from '../../../assets/lens/polarizer01.svg';
import crystal01_svg from '../../../assets/lens/crystal01.svg';
import holes01_svg from '../../../assets/lens/holes01.svg';
import needle01_svg from '../../../assets/lens/needle01.svg';
import bead01_svg from '../../../assets/lens/bead01.svg';
import laser01_svg from '../../../assets/lens/laser01.svg';

export interface LenModelConfig {
  height: number;
  width: number;

  imgurl: string;
}
export const lensConfig: Map<string, LenModelConfig> = new Map([
  [
    'convex_lens01',
    {
      height: 20,
      width: 15,
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
      width: 20,
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
  [
    'measure_head02',
    {
      height: 60,
      width: 25,
      imgurl: measure_lens02_svg,
    },
  ],
  [
    'board01',
    {
      height: 60,
      width: 15,
      imgurl: board01_svg,
    },
  ],
  [
    'raster01',
    {
      height: 40,
      width: 15,
      imgurl: raster01_svg,
    },
  ],
  [
    'polarizer01',
    {
      height: 30,
      width: 15,
      imgurl: polarizer01_svg,
    },
  ],
  [
    'crystal01',
    {
      height: 30,
      width: 30,
      imgurl: crystal01_svg,
    },
  ],
  [
    'holes01',
    {
      height: 60,
      width: 15,
      imgurl: holes01_svg,
    },
  ],
  [
    'needle01',
    {
      height: 60,
      width: 80,
      imgurl: needle01_svg,
    },
  ],
  [
    'bead01',
    {
      height: 60,
      width: 60,
      imgurl: bead01_svg,
    },
  ],
  [
    'laser01',
    {
      height: 30,
      width: 10,
      imgurl: laser01_svg,
    },
  ],
]);
