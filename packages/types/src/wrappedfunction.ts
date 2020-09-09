/** JSDoc */
export interface WrappedFunction extends Function {
  [key: string]: any;
  __beidou__?: boolean;
  __beidou_wrapped__?: WrappedFunction;
  __beidou_original__?: WrappedFunction;
}
