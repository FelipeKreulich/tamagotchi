import type { PixelGrid } from "../Sprite";

const _ = 0;
const O = 1;
const B = 2;
const E = 3;
const M = 4;

export const catHappyA: PixelGrid = [
  [O, O, _, _, _, _, _, _, _, _, O, O],
  [O, B, O, _, _, _, _, _, _, O, B, O],
  [O, B, B, O, O, O, O, O, O, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, E, B, B, B, B, B, B, E, B, O],
  [O, B, B, B, B, M, M, B, B, B, B, O],
  [O, B, B, B, O, B, B, O, B, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [_, O, B, B, B, B, B, B, B, B, O, _],
  [_, _, O, O, B, B, B, B, O, O, _, _],
  [_, _, _, _, O, O, O, O, _, _, _, _],
];

export const catHappyB: PixelGrid = [
  [O, O, _, _, _, _, _, _, _, _, O, O],
  [O, B, O, _, _, _, _, _, _, O, B, O],
  [O, B, B, O, O, O, O, O, O, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, E, B, B, B, B, B, B, E, B, O],
  [O, B, B, B, B, M, M, B, B, B, B, O],
  [O, B, B, B, B, O, O, B, B, B, B, O],
  [O, B, B, B, O, B, B, O, B, B, B, O],
  [_, O, B, B, B, B, B, B, B, B, O, _],
  [_, _, O, O, B, B, B, B, O, O, _, _],
  [_, _, _, _, O, O, O, O, _, _, _, _],
];

export const catSad: PixelGrid = [
  [O, O, _, _, _, _, _, _, _, _, O, O],
  [O, B, O, _, _, _, _, _, _, O, B, O],
  [O, B, B, O, O, O, O, O, O, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, B, E, B, B, B, B, E, B, B, O],
  [O, B, B, B, B, M, M, B, B, B, B, O],
  [O, B, B, O, B, B, B, B, O, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [_, O, B, B, B, B, B, B, B, B, O, _],
  [_, _, O, O, B, B, B, B, O, O, _, _],
  [_, _, _, _, O, O, O, O, _, _, _, _],
];

export const catSick: PixelGrid = [
  [O, O, _, _, _, _, _, _, _, _, O, O],
  [O, B, O, _, M, _, _, M, _, O, B, O],
  [O, B, B, O, O, O, O, O, O, B, B, O],
  [O, B, M, B, B, B, B, B, M, B, B, O],
  [O, B, E, M, B, B, B, M, B, E, B, O],
  [O, B, B, B, B, M, M, B, B, B, B, O],
  [O, B, M, B, O, B, B, O, B, M, B, O],
  [O, B, B, B, M, B, B, M, B, B, B, O],
  [_, O, B, M, B, B, B, B, M, B, O, _],
  [_, _, O, O, B, B, B, B, O, O, _, _],
  [_, _, _, _, O, O, O, O, _, _, _, _],
];

export const catSleeping: PixelGrid = [
  [O, O, _, _, _, _, _, _, _, _, O, O],
  [O, B, O, _, _, _, _, _, _, O, B, O],
  [O, B, B, O, O, O, O, O, O, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, M, M, B, B, B, B, M, M, B, O],
  [O, B, B, B, B, M, M, B, B, B, B, O],
  [O, B, B, B, O, B, B, O, B, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [_, O, B, B, B, B, B, B, B, B, O, _],
  [_, _, O, O, B, B, B, B, O, O, _, _],
  [_, _, _, _, O, O, O, O, _, _, _, _],
];

export const catDirty: PixelGrid = [
  [O, O, _, _, _, M, _, _, _, _, O, O],
  [O, B, O, M, _, _, _, M, _, O, B, O],
  [O, B, B, O, O, O, O, O, O, B, B, O],
  [O, B, M, B, B, B, M, B, B, B, B, O],
  [O, B, E, B, B, B, B, B, B, E, B, O],
  [O, B, B, M, B, M, M, B, M, B, B, O],
  [O, B, B, B, O, B, B, O, B, B, B, O],
  [O, B, M, B, B, M, B, B, B, M, B, O],
  [_, O, B, B, B, B, B, B, B, B, O, _],
  [_, _, O, O, B, B, B, B, O, O, _, _],
  [_, _, _, _, O, O, O, O, _, _, _, _],
];

export const catDead: PixelGrid = [
  [O, O, _, _, _, _, _, _, _, _, O, O],
  [O, B, O, _, _, _, _, _, _, O, B, O],
  [O, B, B, O, O, O, O, O, O, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, B, M, B, B, B, B, M, B, B, O],
  [O, B, B, B, M, B, B, M, B, B, B, O],
  [O, B, B, B, O, B, B, O, B, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [_, O, B, B, B, B, B, B, B, B, O, _],
  [_, _, O, O, B, B, B, B, O, O, _, _],
  [_, _, _, _, O, O, O, O, _, _, _, _],
];
