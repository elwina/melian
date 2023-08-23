import { normalization } from 'renderer/utils/array';
import { D65Specteum, HG } from './spectrum';

export type LightType = 'D65' | 'HG';

export function getWaveInstense(lightType: LightType, filter: number) {
  let wave = [];
  let instense = [];
  if (filter < 0) {
    switch (lightType) {
      case 'D65':
        wave = D65Specteum.wave;
        instense = normalization(D65Specteum.instense);
        break;
      case 'HG':
        wave = HG.wave;
        instense = normalization(HG.instense);
        break;
    }
  } else {
    wave = [filter];
    instense = [1];
  }
  return { wave, instense };
}
