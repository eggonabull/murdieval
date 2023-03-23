import {
  Layer,
  Position,
  sprite_cell_size,
  SpriteMapStr,
  SpriteSourceDef,
} from './types';

function build_dirt_plot(width: number, height: number): SpriteSourceDef {
  const top = 'dA' + 'dB'.repeat(width - 2) + 'dC';
  const middle = 'eA' + 'eB'.repeat(width - 2) + 'eC';
  const bottom = 'fA' + 'fB'.repeat(width - 2) + 'fC';
  const map = top + '\n' + (middle + '\n').repeat(height - 2) + bottom;
  return {
    sprite: 'overworld',
    map: map,
  };
}

function build_horizontal_bush(length: number): SpriteSourceDef {
  const map = 'QA' + 'PC'.repeat(length - 2) + 'QB';
  return {
    sprite: 'overworld',
    map: map,
  };
}

function flatten(layer: Layer): SpriteMapStr {
  const map = ('  '.repeat(map_width) + '\n')
    .repeat(map_height)
    .slice(0, -1)
    .split('\n')
    .map(row => row.split(''));
  for (let i = 0; i < layer.length; i++) {
    const draw_instruction = layer[i];
    if (!draw_instruction.def.map) {
      /* no collision checking for bounding boxes definitions */
      continue;
    }
    draw_instruction.def.map
      .split('\n')
      .map(x => x.trim())
      .filter(x => x.length > 0)
      .forEach((row, y) => {
        //console.log('row', row, 'y', y)
        row
          .trim()
          .split('')
          .forEach((char, x) => {
            if (char !== ' ') {
              const ypos = draw_instruction.pos.y + y;
              const xpos = draw_instruction.pos.x * 2 + x;
              map[ypos][xpos] = char;
            }
          });
      });
  }
  return map.map(row => row.join('')).join('\n');
}

function create_collision_map(layer: Layer): SpriteMapStr[] {
  const result: SpriteMapStr[] = new Array<SpriteMapStr>(map_width * map_height).fill('  ');
  for (let i = 0; i < layer.length; i++) {
    const def = layer[i].def;
    if (!def.map) {
      /* no collision checking for bounding boxes definitions */
      continue;
    }
    const pos = layer[i].pos;
    const map = def.map.split('\n').map(row => row.trim()).filter(row => row.length > 0);
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x += 2) {
        const char = map[y][x] + map[y][x + 1];
        if (char === ' ' || char === '  ') {
          continue;
        }
        const index = (pos.y + y) * map_width + (pos.x + x / 2);
        result[index] = char;
      }
    }
  }
  return result;
}

export const house_def: SpriteSourceDef = {
  sprite: 'overworld',
  map: `
  AGAHAIAOAP
  BGBHBIBOBP
  CGCHCICJCK
  DGDHDIDJDK
  EGEHEIEJEK
  `,
};

export const up_house_def: SpriteSourceDef = {
  sprite: 'overworld',
  map: `
  ALAMANAJAK
  BLBMBNBJBK
  CLCMCNCOCP
  DLDMDNDODP
  ELEMENEOEP
  `,
};

export const crate: SpriteSourceDef = {
  sprite: 'overworld',
  map: `
  UVUW
  VVVW
  `,
};

export const log: SpriteSourceDef = {
  sprite: 'overworld',
  map: `
  FDFEFF
  `,
};

export const shrub: SpriteSourceDef = {
  sprite: 'overworld',
  map: `
  QFQG
  RFRG
  `,
};

export const draw_over_player = [
  'QF', 'QG', 'UV', 'UW', 'AL', 'AM',
  'AN', 'AO', 'AP', 'AG', 'AH', 'AI', 'AJ', 'AK',
  'PC', 'QA', 'QB',
];

export const blocks_player = [
  // log
  'FD', 'FE', 'FF', 
  // shrub
  'RF', 'RG',
  // crate
  'VV', 'VW',
  // water
  'HD', 'ID',
  // house
  'BG', 'BH', 'BI', 'BJ', 'BK',
  'CG', 'CH', 'CI', 'CJ', 'CK',
  'DG', 'DH', 'DI', 'DJ', 'DK',
  'EG', 'EH', 'EI', 'EJ', 'EK',
  // up house
  'BL', 'BM', 'BN', 'BO', 'BP',
  'CL', 'CM', 'CN', 'CO', 'CP',
  'DL', 'DM', 'DN', 'DO', 'DP',
  'EL', 'EM', 'EN', 'EO', 'EP',
];

/**
 * Layer0Map is a string that represents the map of the first layer of the game.
 * It is special and defines the height and width of the game and of the
 * collision map.
 */
export const layer0Sprite = 'overworld';
const layer0BaseMap = `
HDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHD
HDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHDHD
IDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDIDID
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdAdBdBdCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeBeBeCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
dBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBhBeBeBhAdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdBdB
eBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeB
eBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeB
eBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeB
eBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeBeB
fBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfB
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
`
  .split('\n')
  .map(row => row.trim())
  .filter(row => row.length > 0)
  .join('\n');
export const layer0: Layer = [
  {def: {sprite: layer0Sprite, map: layer0BaseMap}, pos: {x: 0, y: 0}},
  {def: build_dirt_plot(7, 7), pos: {x: 40, y: 14}},
];
const map_height = layer0BaseMap.split('\n').length;
const map_width = layer0BaseMap.split('\n')[0].length / 2;
console.log(
  'map_width: ',
  map_width,
  'map_height: ',
  map_height,
  'layer0Map',
  "'" + layer0BaseMap + "'"
);
export const layer0Map = flatten(layer0);

export const horizontal_bush_5 = build_horizontal_bush(5);

export const layer1: Layer = [
  {def: house_def, pos: {x: 21, y: 16}},
  {def: house_def, pos: {x: 34, y: 16}},
  {def: up_house_def, pos: {x: 14, y: 29}},
  //{def: crate, pos: {x: 14, y: 33}},
  {def: up_house_def, pos: {x: 21, y: 29}},
  {def: up_house_def, pos: {x: 35, y: 29}},
  {def: log, pos: {x: 8, y: 4}},
  {def: shrub, pos: {x: 1, y: 5}},
  {def: shrub, pos: {x: 5, y: 6}},
  {def: shrub, pos: {x: 3, y: 8}},
  {def: shrub, pos: {x: 5, y: 8}},
  {def: shrub, pos: {x: 8, y: 8}},
  {def: shrub, pos: {x: 2, y: 11}},
  {def: shrub, pos: {x: 5, y: 11}},
  {def: shrub, pos: {x: 3, y: 14}},
  {def: shrub, pos: {x: 3, y: 46}},
  {def: horizontal_bush_5, pos: {x: 41, y: 15}},
  {def: horizontal_bush_5, pos: {x: 41, y: 17}},
  {def: horizontal_bush_5, pos: {x: 41, y: 19}},
];

export const layer1flattened = flatten(layer1);
const collision_layers = [layer0Map, layer1flattened];
// console.log('layer0Map', layer0Map)
// console.log('layer1flattened', layer1flattened)

export function get_ground_info(pos: Position) {
  const y = Math.floor((pos.y + 24) / sprite_cell_size); /* foot position */
  const x = Math.floor((pos.x + 8) / sprite_cell_size);
  //console.log('map_width', map_width, 'map_height', map_height, 'x', x, 'y', y)
  const index = y * (map_width * 2 + 1) + x * 2;
  const result = [];

  for (let i = 0; i < collision_layers.length; i++) {
    //console.log('x', x, 'y', y, 'index', index, collision_layers[i][index] + collision_layers[i][index + 1])
    const layer = collision_layers[i];
    const char = layer[index] + layer[index + 1];
    result.push(`${char}`);
  }
  return result;
}
