export type Sprite = 'overworld' | 'character';

export type Position = {x: number; y: number};

export type CopyBounds = {
  l: number;
  t: number;
  w: number;
  h: number;
}

export enum Direction {
  South,
  East,
  North,
  West,
}

export type GameState = {
  ticks: number;
  cwidth: number;
  cheight: number;
  camera_pos: Position;
  char_pos: Position;
  last_pos: Position;
  ms_passed: number;
  direction: Direction;
  walking: boolean;
  walk_start: number;
  speed: number;
};
