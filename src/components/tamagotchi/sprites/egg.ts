import type { PixelGrid } from "../Sprite";

const _ = 0;
const O = 1; // outline
const B = 2; // body
const S = 3; // shine / highlight

const eggFrameA: PixelGrid = [
  [_, _, _, _, O, O, O, O, _, _, _, _],
  [_, _, _, O, B, B, B, B, O, _, _, _],
  [_, _, O, B, S, B, B, B, B, O, _, _],
  [_, O, B, B, B, B, B, B, B, B, O, _],
  [_, O, B, S, B, B, B, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [_, O, B, B, B, B, B, B, B, B, O, _],
  [_, _, O, B, B, B, B, B, B, O, _, _],
  [_, _, _, O, O, O, O, O, O, _, _, _],
];

const eggFrameB: PixelGrid = [
  [_, _, _, _, O, O, O, O, _, _, _, _],
  [_, _, _, O, B, B, B, B, O, _, _, _],
  [_, _, O, B, B, B, B, B, B, O, _, _],
  [_, O, B, B, B, B, B, B, B, B, O, _],
  [_, O, B, B, B, S, B, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, B, S, B, B, B, B, S, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [_, O, B, B, B, B, B, B, B, B, O, _],
  [_, _, O, B, B, B, B, B, B, O, _, _],
  [_, _, _, O, O, O, O, O, O, _, _, _],
];

export const eggFrames = [eggFrameA, eggFrameB] as const;
