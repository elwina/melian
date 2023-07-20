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
