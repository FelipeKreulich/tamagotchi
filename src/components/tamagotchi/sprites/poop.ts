import type { PixelGrid } from "../Sprite";

const _ = 0;
const O = 1;
const B = 2;
const M = 4;

export const poopFrameA: PixelGrid = [
  [_, _, _, O, O, _, _, _],
  [_, _, O, B, B, O, _, _],
  [_, _, O, B, M, O, _, _],
  [_, O, B, B, B, B, O, _],
  [_, O, B, M, B, B, O, _],
  [O, B, B, B, B, B, B, O],
  [O, B, B, M, B, B, B, O],
  [O, O, O, O, O, O, O, O],
];

export const poopFrameB: PixelGrid = [
  [_, _, _, O, O, _, _, _],
  [_, _, O, B, B, O, _, _],
  [_, _, O, M, B, O, _, _],
  [_, O, B, B, B, M, O, _],
  [_, O, B, B, B, B, O, _],
  [O, B, M, B, B, B, B, O],
  [O, B, B, B, B, M, B, O],
  [O, O, O, O, O, O, O, O],
];
