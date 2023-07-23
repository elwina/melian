import type { LightType } from 'renderer/formula/lightwave';
import type { MeasureStyles, MeasureType } from 'renderer/measures/mReg';
import type { ScreenStyles, ScreenType } from 'renderer/screens/sReg';
import type { SettingType } from 'renderer/setting/LoadSetting';

export interface LenConfig {
  [key: string]: any;
  id: number;
  uname: string;
  name: string;
  distancemm: number;
  hide: boolean;
  option: Record<string, any>;
}

export interface LightConfig {
  type: LightType;
  filter: number;
}

export interface ScreenConfig {
  type: ScreenType;
  options: Record<string, any>;
}

export interface MeasureConfig {
  type: MeasureType;
  options: Record<string, any>;
}

export interface ControlConfig {
  showmm: number[];
  move: number[];
}

export interface SettingConfig {
  name: string;
  type: SettingType;
  target: string[];
  options: Record<string, any>;
}

export interface InstrumentConfig {
  name: string;
  lens: LenConfig[];
  light: LightConfig;
  screen: ScreenConfig;
  measure: MeasureConfig;
  control: ControlConfig;
  setting: SettingConfig[];
}

export interface StyleConfig {
  global: {
    dark: boolean;
  };
  holder: {
    leftMargin: number;
    bottomMargin: number;
    holderHeight: number;
    holderWidthmm: number;
    leftPadding: number;
    xScale: number;
    upHeight: number;
    fontSize: number;
    baselineHeight: number;
    lenScaleX: number;
    lenScaleY: number;
  };
  setting: {
    height: number;
    expHeight: number;
  };
  screen: ScreenStyles;
  measure: MeasureStyles;
}
