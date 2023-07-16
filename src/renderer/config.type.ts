export interface LenConfig {
  [key:string]:any;
  id: number;
  uname: string;
  name: string;
  distancemm: number;
  hide: boolean;
  option: Record<string, any>;
}

export type LightType = "D65"

export interface LightConfig{
  type:LightType;
  filter:number
}

export interface ScreenConfig {
  type: 0|1;
  seemm: number;
  require: Record<string, string>;
  func: string;
}

export interface MeasureConfig {
  type: 0|1;
  initmm: number;
}

export interface ControlConfig {
  showmm: number[];
  move: number[];
}

export interface StatusConfig {
  offsetmm: number;
}

export interface InstrumentConfig {
  name: string;
  lens: LenConfig[];
  light: LightConfig;
  screen: ScreenConfig;
  measure: MeasureConfig;
  control: ControlConfig;
  status: StatusConfig;
}

export interface StyleConfig {
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
  screen: {
    mmwidth: number;
    mmheight: number;
    mm2px: number;
    scaleX: number;
    scaleY: number;
    leftMargin: number;
    bottomMargin: number;
  };
  measure: {
    mm2px: number;

    upHeight: number;
    downHeight: number;
    dsHeight: number;
    fontHeight: number;
    sfontHeight: number;

    fontSize: number;
    sfontSize: number;
    lineWidth: number;
    leftPadding: number;
    upPadding: number;

    leftMargin: number;
    bottomMargin: number;
  };
}
