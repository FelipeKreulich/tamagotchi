import type { PixelGrid } from "../Sprite";

const _ = 0; // transparent
const O = 1; // outline
const B = 2; // body
const E = 3; // eye
const M = 4; // mouth / accent

export const blobHappyA: PixelGrid = [
  [_, _, _, O, O, O, O, O, _, _, _, _],
  [_, _, O, B, B, B, B, B, O, _, _, _],
  [_, O, B, B, B, B, B, B, B, O, _, _],
  [O, B, B, E, B, B, E, B, B, B, O, _],
  [O, B, B, E, B, B, E, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, B, B, M, M, M, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [_, O, B, B, B, B, B, B, B, O, _, _],
  [_, _, O, O, B, B, B, O, O, _, _, _],
  [_, _, _, _, O, O, O, _, _, _, _, _],
];

export const blobHappyB: PixelGrid = [
  [_, _, _, _, O, O, O, O, O, _, _, _],
  [_, _, _, O, B, B, B, B, B, O, _, _],
  [_, _, O, B, B, B, B, B, B, B, O, _],
  [_, O, B, B, E, B, B, E, B, B, B, O],
  [_, O, B, B, E, B, B, E, B, B, B, O],
  [_, O, B, B, B, B, B, B, B, B, B, O],
  [_, O, B, B, M, M, M, M, B, B, B, O],
  [_, O, B, B, B, M, M, B, B, B, B, O],
  [_, _, O, B, B, B, B, B, B, B, O, _],
  [_, _, _, O, O, B, B, B, O, O, _, _],
  [_, _, _, _, _, O, O, O, _, _, _, _],
];

export const blobSad: PixelGrid = [
  [_, _, _, O, O, O, O, O, _, _, _, _],
  [_, _, O, B, B, B, B, B, O, _, _, _],
  [_, O, B, B, B, B, B, B, B, O, _, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, B, E, B, B, E, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, B, B, M, M, M, B, B, B, O, _],
  [O, B, B, M, B, B, B, M, B, B, O, _],
  [_, O, B, B, B, B, B, B, B, O, _, _],
  [_, _, O, O, B, B, B, O, O, _, _, _],
  [_, _, _, _, O, O, O, _, _, _, _, _],
];

export const blobSick: PixelGrid = [
  [_, _, _, O, O, O, O, O, _, _, _, _],
  [_, _, O, B, B, B, B, B, O, _, _, _],
  [_, O, B, B, M, B, M, B, B, O, _, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, M, E, B, B, E, M, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, B, M, B, M, B, M, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [_, O, B, M, B, B, B, M, B, O, _, _],
  [_, _, O, O, B, B, B, O, O, _, _, _],
  [_, _, _, _, O, O, O, _, _, _, _, _],
];

export const blobSleeping: PixelGrid = [
  [_, _, _, O, O, O, O, O, _, _, _, _],
  [_, _, O, B, B, B, B, B, O, _, _, _],
  [_, O, B, B, B, B, B, B, B, O, _, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, B, M, M, B, M, M, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, B, B, M, M, M, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [_, O, B, B, B, B, B, B, B, O, _, _],
  [_, _, O, O, B, B, B, O, O, _, _, _],
  [_, _, _, _, O, O, O, _, _, _, _, _],
];

export const blobDirty: PixelGrid = [
  [_, _, _, O, O, O, O, O, _, _, _, _],
  [_, _, O, B, B, M, B, B, O, _, _, _],
  [_, O, B, M, B, B, B, M, B, O, _, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, B, E, B, M, E, B, B, B, O, _],
  [O, B, M, B, B, B, B, B, M, B, O, _],
  [O, B, B, B, M, M, M, B, B, B, O, _],
  [O, B, B, B, B, B, B, B, M, B, O, _],
  [_, O, B, B, M, B, B, B, B, O, _, _],
  [_, _, O, O, B, M, B, O, O, _, _, _],
  [_, _, _, _, O, O, O, _, _, _, _, _],
];

export const blobDead: PixelGrid = [
  [_, _, _, O, O, O, O, O, _, _, _, _],
  [_, _, O, B, B, B, B, B, O, _, _, _],
  [_, O, B, B, B, B, B, B, B, O, _, _],
  [O, B, M, B, B, B, B, B, M, B, O, _],
  [O, B, B, M, B, B, B, M, B, B, O, _],
  [O, B, B, B, B, B, B, B, B, B, O, _],
  [O, B, B, B, M, M, M, B, B, B, O, _],
  [O, B, B, M, B, M, B, M, B, B, O, _],
  [_, O, B, B, B, B, B, B, B, O, _, _],
  [_, _, O, O, B, B, B, O, O, _, _, _],
  [_, _, _, _, O, O, O, _, _, _, _, _],
];
