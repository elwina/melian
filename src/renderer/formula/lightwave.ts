import { LightType } from 'renderer/config.type';
import { normalization } from 'renderer/utils/array';
import { D65Specteum } from './spectrum';

export function getWaveInstense(lightType: LightType, filter: number) {
  let wave = [];
  let instense = [];
  if (filter < 0) {
    switch (lightType) {
      case "D65":
        wave = D65Specteum.wave;
        instense = normalization(D65Specteum.instense);
    }
  } else {
    wave = [filter];
    instense = [1];
  }
  return { wave, instense };
}
