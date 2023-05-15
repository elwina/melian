import convex_lens01 from '../../../assets/lens/convex_lens01.svg';

export interface LenConfig {
  height: number;
  width: number;

  imgurl: string;
}
export const lensConfig: Record<string, LenConfig> = {
  convex_lens01: {
    height: 60,
    width: 30,
    imgurl: convex_lens01,
  },
};
