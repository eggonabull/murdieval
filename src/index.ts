import {load_sprites} from './images';
import {get_ground_info, blocks_player} from 'background';
import {GameState, Direction} from './types';
import {
  animate_bg,
  animate_fg,
  init_animation,
  final_animation_step,
} from './animation';

let game_canvas_ctx: CanvasRenderingContext2D;
let old_timestamp = 0;
let frame_requested = false;

const gs: GameState = {
  ticks: 0,
  cwidth: 0,
  cheight: 0,
  camera_pos: {x: 0, y: 0},
  char_pos: {x: 32, y: 64},
  last_pos: {x: 512, y: 684},
  ms_passed: 0,
  direction: Direction.North,
  walking: false,
  walk_start: 0,
  speed: 0,
  frames_wanted: true,
};
const keyArray: {[key: string]: boolean} = {};

function update_gs(gs: GameState) {
  const last_pos = gs.char_pos;
  if (is_key_down('w')) {
    gs.walking = true;
    gs.direction = Direction.North;
    gs.speed = gs.speed < 0.05 ? 0.05 : gs.speed >= 0.2 ? 0.2 : gs.speed + 0.01;
    gs.char_pos = {
      ...gs.char_pos,
      y: Math.round(gs.char_pos.y - gs.speed * gs.ms_passed),
    };
  } else if (is_key_down('a')) {
    gs.walking = true;
    gs.direction = Direction.West;
    gs.speed = gs.speed < 0.05 ? 0.05 : gs.speed >= 0.2 ? 0.2 : gs.speed + 0.01;
    gs.char_pos = {
      ...gs.char_pos,
      x: Math.round(gs.char_pos.x - gs.speed * gs.ms_passed),
    };
  } else if (is_key_down('s')) {
    gs.walking = true;
    gs.direction = Direction.South;
    gs.speed = gs.speed < 0.05 ? 0.05 : gs.speed >= 0.2 ? 0.2 : gs.speed + 0.01;
    gs.char_pos = {
      ...gs.char_pos,
      y: Math.round(gs.char_pos.y + gs.speed * gs.ms_passed),
    };
  } else if (is_key_down('d')) {
    gs.walking = true;
    gs.direction = Direction.East;
    gs.speed = gs.speed < 0.05 ? 0.05 : gs.speed >= 0.2 ? 0.2 : gs.speed + 0.01;
    gs.char_pos = {
      ...gs.char_pos,
      x: Math.round(gs.char_pos.x + gs.speed * gs.ms_passed),
    };
  } else {
    gs.speed = 0;
    gs.walking = false;
  }

  if (get_ground_info(gs.char_pos).some(x => blocks_player.includes(x))) {
    gs.char_pos = last_pos;
  }

  if (gs.char_pos.x < 0) gs.char_pos.x = 0;
  if (gs.char_pos.y < 0) gs.char_pos.y = 0;
  // Todo: figure out how to do without bg_render
  // if (gs.char_pos.x > bg_render.width - 16) gs.char_pos.x = bg_render.width - 16;
  // if (gs.char_pos.y > bg_render.height - 32) gs.char_pos.y = bg_render.height - 32;
}

window.onfocus = function () {
  if (!frame_requested) {
    frame_requested = true;
    gs.frames_wanted = true;
    window.requestAnimationFrame(game_loop);
  }
};

window.onblur = function () {
  frame_requested = false;
};

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

function game_loop(timestamp: DOMHighResTimeStamp) {
  frame_requested = false;
  gs.ms_passed = timestamp - old_timestamp;
  if (gs.ms_passed > 10) {
    gs.ticks += 1;
    old_timestamp = timestamp;
  }
  update_gs(gs);
  animate_bg(gs);
  animate_fg(gs);
  final_animation_step(game_canvas_ctx);
  if (gs.frames_wanted) {
    window.requestAnimationFrame(game_loop);
    frame_requested = true;
  }
}

function begin() {
  document.onkeydown = on_key_down;
  document.onkeyup = on_key_up;
  console.log('Beginning...');
  const game_canvas = document.getElementById(
    'game_canvas'
  ) as HTMLCanvasElement;

  const can_ctx = game_canvas.getContext('2d');
  if (can_ctx === null) {
    console.log('bad bgctx');
    return;
  }
  game_canvas_ctx = can_ctx;
  gs.cwidth = game_canvas.width;
  gs.cheight = game_canvas.height;

  init_animation(game_canvas);
  //console.log("fg_render", fg_render)

  window.requestAnimationFrame(game_loop);
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
