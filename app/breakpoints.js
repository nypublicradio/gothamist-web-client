const xsmall = 360;
const small = 550;
const medium = 768;
const large = 850;
const xlarge = 1024;
const xxlarge = 1280;
const xxxlarge = 1500;

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
