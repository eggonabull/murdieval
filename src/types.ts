export type Sprite = 'overworld' | 'character';

export type Position = {x: number; y: number};

export type SpriteMapStr = string;

export type CopyBounds = {
  l: number;
  t: number;
  w: number;
  h: number;
};

export type SpriteSourceDef = {
  sprite: Sprite;
  copy_bound?: CopyBounds;
  map?: SpriteMapStr;
};

export type DrawInstruction = {
  def: SpriteSourceDef;
  pos: Position;
};

export type Layer = DrawInstruction[];

export enum Direction {
  South,
  East,
  North,
  West,
}

export type SpriteDef = {
  sprite: Sprite;
  x: number;
  y: number;
};

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
