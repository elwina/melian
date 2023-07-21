import { normalization } from 'renderer/utils/array';
import { D65Specteum, RedCyan } from './spectrum';

export type LightType = 'D65' | 'RedCyan';

export function getWaveInstense(lightType: LightType, filter: number) {
  let wave = [];
  let instense = [];
  if (filter < 0) {
    switch (lightType) {
      case 'D65':
        wave = D65Specteum.wave;
        instense = normalization(D65Specteum.instense);
        break;
      case 'RedCyan':
        wave = RedCyan.wave;
        instense = normalization(RedCyan.instense);
        break;
    }
  } else {
    wave = [filter];
    instense = [1];
  }
  return { wave, instense };
}
