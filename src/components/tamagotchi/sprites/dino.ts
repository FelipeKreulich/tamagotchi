import type { PixelGrid } from "../Sprite";

const _ = 0;
const O = 1;
const B = 2;
const E = 3;
const M = 4;

export const dinoHappyA: PixelGrid = [
  [_, _, _, _, _, O, O, O, O, _, _, _],
  [_, _, _, _, O, B, B, B, B, O, _, _],
  [_, _, _, O, B, B, E, B, B, O, _, _],
  [_, _, O, B, B, B, B, B, B, B, O, _],
  [_, O, B, B, B, B, M, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, O, _, _],
  [O, B, B, B, O, B, B, O, _, _, _, _],
  [_, O, B, O, _, _, _, _, _, _, _, _],
  [_, O, O, _, _, O, B, O, _, _, _, _],
  [_, O, O, _, _, O, O, _, _, _, _, _],
];

export const dinoHappyB: PixelGrid = [
  [_, _, _, _, _, O, O, O, O, _, _, _],
  [_, _, _, _, O, B, B, B, B, O, _, _],
  [_, _, _, O, B, E, B, E, B, O, _, _],
  [_, _, O, B, B, B, B, B, B, B, O, _],
  [_, O, B, B, B, M, M, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, O, _, _],
  [O, B, B, O, B, B, O, B, _, _, _, _],
  [_, O, O, _, _, O, _, _, _, _, _, _],
  [_, O, O, _, _, O, B, O, _, _, _, _],
  [_, O, O, _, _, O, O, _, _, _, _, _],
];

export const dinoSad: PixelGrid = [
  [_, _, _, _, _, O, O, O, O, _, _, _],
  [_, _, _, _, O, B, B, B, B, O, _, _],
  [_, _, _, O, B, B, E, B, B, O, _, _],
  [_, _, O, B, B, B, B, B, B, B, O, _],
  [_, O, B, B, M, B, B, B, B, B, O, _],
  [O, B, B, B, B, B, M, M, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, O, _, _],
  [O, B, B, B, O, B, B, O, _, _, _, _],
  [_, O, B, O, _, _, _, _, _, _, _, _],
  [_, O, O, _, _, O, B, O, _, _, _, _],
  [_, O, O, _, _, O, O, _, _, _, _, _],
];

export const dinoSick: PixelGrid = [
  [_, _, _, _, _, O, O, O, O, _, _, _],
  [_, _, _, _, O, B, M, B, B, O, _, _],
  [_, _, _, O, B, B, E, B, M, O, _, _],
  [_, _, O, B, M, B, B, B, B, B, O, _],
  [_, O, B, B, B, M, B, M, B, B, O, _],
  [O, B, M, B, B, B, M, B, B, B, O, _],
  [O, B, B, M, B, B, B, B, B, O, _, _],
  [O, B, B, B, O, B, B, O, _, _, _, _],
  [_, O, B, O, _, _, _, _, _, _, _, _],
  [_, O, O, _, _, O, B, O, _, _, _, _],
  [_, O, O, _, _, O, O, _, _, _, _, _],
];

export const dinoSleeping: PixelGrid = [
  [_, _, _, _, _, O, O, O, O, _, _, _],
  [_, _, _, _, O, B, B, B, B, O, _, _],
  [_, _, _, O, B, M, B, M, B, O, _, _],
  [_, _, O, B, B, B, B, B, B, B, O, _],
  [_, O, B, B, B, M, M, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, O, _, _],
  [O, B, B, B, O, B, B, O, _, _, _, _],
  [_, O, B, O, _, _, _, _, _, _, _, _],
  [_, O, O, _, _, O, B, O, _, _, _, _],
  [_, O, O, _, _, O, O, _, _, _, _, _],
];

export const dinoDirty: PixelGrid = [
  [_, _, _, _, _, O, O, O, O, _, _, _],
  [_, _, _, M, O, B, B, B, M, O, _, _],
  [_, _, _, O, B, B, E, B, B, O, _, _],
  [_, _, O, B, M, B, B, B, B, B, O, _],
  [_, O, B, B, B, B, M, B, B, B, O, _],
  [O, B, B, M, B, B, B, M, B, B, O, _],
  [O, B, B, B, B, M, B, B, B, O, _, _],
  [O, B, B, B, O, B, B, O, _, _, _, _],
  [_, O, B, O, _, _, _, _, _, _, _, _],
  [_, O, O, _, _, O, B, O, _, _, _, _],
  [_, O, O, _, _, O, O, _, _, _, _, _],
];

export const dinoDead: PixelGrid = [
  [_, _, _, _, _, O, O, O, O, _, _, _],
  [_, _, _, _, O, B, B, B, B, O, _, _],
  [_, _, _, O, B, M, B, M, B, O, _, _],
  [_, _, O, B, B, B, B, B, B, B, O, _],
  [_, O, B, B, M, B, B, B, B, B, O, _],
  [O, B, B, B, B, M, M, M, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, O, _, _],
  [O, B, B, B, O, B, B, O, _, _, _, _],
  [_, O, B, O, _, _, _, _, _, _, _, _],
  [_, O, O, _, _, O, B, O, _, _, _, _],
  [_, O, O, _, _, O, O, _, _, _, _, _],
];
