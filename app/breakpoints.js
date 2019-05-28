export const xsmall = 360;
export const small = 550;
export const medium = 768;
export const large = 850;
export const xlarge = 1024;
export const xxlarge = 1280;
export const xxxlarge = 1500;

export default {
  lessThanXsmall: `(max-width: ${xsmall - 1}px)`,
  xSmallAndUp: `(min-width: ${xsmall}px)`,
  smallAndUp: `(min-width: ${small}px)`,
  mediumAndUp: `(min-width: ${medium}px)`,
  largeAndUp: `(min-width: ${large}px)`,
  xLargeAndUp: `(min-width: ${xlarge}px)`,
  xxLargeAndUp: `(min-width: ${xxlarge}px)`,
  xxxLargeAndUp: `(min-width: ${xxxlarge}px)`,
};
