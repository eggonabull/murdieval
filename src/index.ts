import {load_sprites, ContextMgr} from './images';
import {animate_bg} from 'background';

let bgmgr: ContextMgr;
let ticks = 0;
let old_timestamp = 0;

function begin() {
  document.onkeydown = on_key_down;
  document.onkeyup = on_key_up;
  console.log('Beginning...');
  const bg = document.getElementById('bg') as HTMLCanvasElement;
  const bgctx = bg.getContext('2d');
  if (bgctx === null) {
    console.log('bad bgctx');
    return;
  }
  bgmgr = new ContextMgr(bgctx);

  window.requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp: DOMHighResTimeStamp) {
  ticks += 1;
  const ms_passed = timestamp - old_timestamp;
  if (ms_passed > 16) {
    ticks += 1;
    old_timestamp = timestamp;
  } else {
    return;
  }
  animate_bg(bgmgr);
  animate_fg(bgmgr, ticks);
  window.requestAnimationFrame(gameLoop);
}

type Position = {x: number; y: number};

enum Direction {
  South,
  East,
  North,
  West,
}

type GameState = {
  char_pos: Position;
  direction: Direction;
  walking: boolean;
  walk_start: number;
  speed: number;
};

const gs: GameState = {
  char_pos: {x: 256, y: 256},
  direction: Direction.North,
  walking: false,
  walk_start: 0,
  speed: 0,
};

const keyArray: {[key: string]: boolean} = {};

function on_key_down(ev: KeyboardEvent) {
  // Detect which key was pressed
  keyArray[ev.key] = true;
  // Repeat for each key you care about...
}

function on_key_up(ev: KeyboardEvent) {
  // Detect which key was released
  keyArray[ev.key] = false;
  // Repeat for each key you care about...
}

function is_key_down(key: string) {
  return keyArray[key];
}

function get_char_img(gs: GameState, ticks: number): string {
  const col = gs.walking ? String.fromCharCode(65 + (ticks % 16) / 4) : 'A';
  if (gs.direction === Direction.South) {
    return 'A' + col + '\nB' + col;
  } else if (gs.direction === Direction.East) {
    return 'C' + col + '\nD' + col;
  } else if (gs.direction === Direction.North) {
    return 'E' + col + '\nF' + col;
  } else if (gs.direction === Direction.West) {
    return 'G' + col + '\nH' + col;
  } else {
    console.log('bad direction');
    return 'A' + col + '\nB' + col;
  }
}

function animate_fg(fgmgr: ContextMgr, ticks: number) {
  if (is_key_down('w')) {
    gs.walking = true;
    gs.direction = Direction.North;
    gs.speed = gs.speed < 1 ? 1 : gs.speed >= 3 ? 3 : gs.speed + 0.1;
    gs.char_pos = {
      ...gs.char_pos,
      y: (gs.char_pos.y -= gs.speed),
    };
  } else if (is_key_down('a')) {
    gs.walking = true;
    gs.direction = Direction.West;
    gs.speed = gs.speed < 1 ? 1 : gs.speed >= 3 ? 3 : gs.speed + 0.1;
    gs.char_pos = {
      ...gs.char_pos,
      x: (gs.char_pos.x -= gs.speed),
    };
  } else if (is_key_down('s')) {
    gs.walking = true;
    gs.direction = Direction.South;
    gs.speed = gs.speed < 1 ? 1 : gs.speed >= 3 ? 3 : gs.speed + 0.1;
    gs.char_pos = {
      ...gs.char_pos,
      y: (gs.char_pos.y += gs.speed),
    };
  } else if (is_key_down('d')) {
    gs.walking = true;
    gs.direction = Direction.East;
    gs.speed = gs.speed < 1 ? 1 : gs.speed >= 3 ? 3 : gs.speed + 0.1;
    gs.char_pos = {
      ...gs.char_pos,
      x: (gs.char_pos.x += gs.speed),
    };
  } else {
    gs.speed = 0;
    gs.walking = false;
  }
  const cimg = get_char_img(gs, ticks);
  fgmgr.drawSpriteMap('character', cimg, gs.char_pos.x, gs.char_pos.y);
}

function init() {
  console.log('Initializing...');
  load_sprites(begin);
}

if (document.readyState === 'complete') {
  init();
} else {
  document.onreadystatechange = init;
}
