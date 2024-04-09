export interface ScreenFixedCircleOptionsType {
  seemm: number;
  offsetmm: number;
  mmwidth: number;
  mmheight: number;
  require: Record<string, string>;
  func: string;
}

export interface ScreenFixedCircleStyleType {
  mm2px: number;

  scaleX: number;
  scaleY: number;
  leftMargin: number;
  bottomMargin: number;
}

export interface ScreenFixedCirclePolarOptionsType {
  seemm: number;
  offsetxmm: number;
  offsetymm: number;

  mmR: number;
  require: Record<string, string>;
  func: string;
}

export interface ScreenBoardOptionsType {
  color: string;

  require: Record<string, string>;
  func: string;
}

export interface ScreenBoardStyleType {
  mm2px: number;

  totalWidthmm: number;
  totalHeightmm: number;

  scaleX: number;
  scaleY: number;

  leftMargin: number;
  bottomMargin: number;
}

export interface ScreenBoardPolarOptionsType {
  color: string;

  require: Record<string, string>;
  func: string;
}

export interface ScreenBoardPolarStyleType {
  px2mm: number;

  totalWidthmm: number;
  totalHeightmm: number;

  scaleX: number;
  scaleY: number;

  leftMargin: number;
  bottomMargin: number;
}

export interface FastScreenBoardUniOptionsType {
  color: string;

  require: Record<string, string>;
  func: string;
}

export interface FastScreenBoardUniStyleType {
  mm2px: number;

  totalWidthmm: number;
  totalHeightmm: number;

  scaleX: number;
  scaleY: number;

  leftMargin: number;
  bottomMargin: number;
}
