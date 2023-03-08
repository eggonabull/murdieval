import {load_sprites, draw_sprite_map, get_sprite} from './images';
import {layer0Sprite, layer0Map, layer1, get_ground_info, draw_over_player, layer1flattened, blocks_player} from 'background';
import {GameState, Direction, CopyBounds} from './types';

let hidden_canvas: HTMLCanvasElement;
let hidden_context: CanvasRenderingContext2D;
let bg_render: HTMLCanvasElement;
let fg_render: HTMLCanvasElement;
let game_canvas_ctx: CanvasRenderingContext2D;
let old_timestamp = 0;
let frame_requested = false;

const gs: GameState = {
  ticks: 0,
  cwidth: 0,
  cheight: 0,
  camera_pos: {x: 0, y: 0},
  char_pos: {x: 32, y: 32},
  last_pos: {x: 512, y: 384},
  ms_passed: 0,
  direction: Direction.North,
  walking: false,
  walk_start: 0,
  speed: 0,
};
const keyArray: {[key: string]: boolean} = {};

window.onfocus = function () {
  if (!frame_requested) {
    frame_requested = true;
    window.requestAnimationFrame(gameLoop);
  }
};

window.onblur = function () {
  frame_requested = false;
};

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
  hidden_canvas = document.createElement('canvas');
  hidden_canvas.width = game_canvas.width;
  hidden_canvas.height = game_canvas.height;
  const hidden_ctx = hidden_canvas.getContext('2d');
  if (!hidden_ctx) {
    console.log('bad context');
    return;
  }
  hidden_context = hidden_ctx;

  const bg_sprite_map = draw_sprite_map(layer0Sprite, layer0Map);
  if (!bg_sprite_map) {
    console.log('bad bg_sprite_map');
    return;
  }
  bg_render = bg_sprite_map;

  console.log("layer1flattened", layer1flattened)
  const fg_sprite_map = draw_sprite_map(layer0Sprite, layer1flattened, undefined, bg_sprite_map.width);
  if (!fg_sprite_map) {
    console.log('bad fg_sprite_map');
    return;
  }
  fg_render = fg_sprite_map;
  //console.log("fg_render", fg_render)

  window.requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp: DOMHighResTimeStamp) {
  frame_requested = false;
  gs.ms_passed = timestamp - old_timestamp;
  if (gs.ms_passed > 10) {
    gs.ticks += 1;
    old_timestamp = timestamp;
  }
  update_gs(gs);
  animate_bg(gs);
  animate_fg(gs);
  game_canvas_ctx.drawImage(hidden_canvas, 0, 0);
  if (document.hasFocus()) {
    window.requestAnimationFrame(gameLoop);
    frame_requested = true;
  }
}

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

function get_char_bb(gs: GameState): CopyBounds {
  const w = 16;
  const h = 32;
  const l = gs.walking ? (Math.floor(gs.ticks / 5) % 4) * w : 0;
  let t;
  if (gs.direction === Direction.South) {
    t = 0;
  } else if (gs.direction === Direction.East) {
    t = h;
  } else if (gs.direction === Direction.North) {
    t = h * 2;
  } else if (gs.direction === Direction.West) {
    t = h * 3;
  } else {
    console.log('bad direction');
    t = 0;
  }
  return {l, t, w, h};
}

function animate_bg(gs: GameState) {
  let bgx = gs.cwidth / 2 - gs.char_pos.x;
  let bgy = gs.cheight / 2 - gs.char_pos.y;
  if (bgx > 0) bgx = 0;
  if (bgy > 0) bgy = 0;
  if (bgx < gs.cwidth - bg_render.width) bgx = gs.cwidth - bg_render.width;
  if (bgy < gs.cheight - bg_render.height) bgy = gs.cheight - bg_render.height;
  gs.camera_pos = {x: bgx, y: bgy};
  hidden_context.drawImage(bg_render, bgx, bgy);
  hidden_context.drawImage(fg_render, bgx, bgy);
}

function animate_fg(gs: GameState) {
  const c_sprite = get_sprite('character');
  if (!c_sprite) {
    console.log('bad c_sprite');
    return;
  }
  const char_bb = get_char_bb(gs);

  hidden_context.drawImage(
    c_sprite,
    char_bb.l,
    char_bb.t,
    char_bb.w,
    char_bb.h,
    gs.char_pos.x + gs.camera_pos.x,
    gs.char_pos.y + gs.camera_pos.y,
    char_bb.w,
    char_bb.h
  );

  // hidden_context.fillStyle = 'white';
  // hidden_context.fillRect(0, 0, 400, 20);
  // hidden_context.fillStyle = 'black';
  //let head_ginfo = get_ground_info({...gs.char_pos, y: gs.char_pos.y - 16});
  let ginfo = get_ground_info(gs.char_pos);

  if (ginfo.length > 1 && draw_over_player.includes(ginfo[1])) {
    let sx = Math.floor((gs.char_pos.x) / 16) * 16;
    let sy = Math.floor((gs.char_pos.y - 8) / 16 + 2) * 16;
    // hidden_context.beginPath();
    // hidden_context.rect(sx + gs.camera_pos.x - 16, sy + gs.camera_pos.y, 48, 32);
    // hidden_context.stroke();
    hidden_context.drawImage(fg_render, sx - 16, sy, 48, 32, sx + gs.camera_pos.x - 16, sy + gs.camera_pos.y, 48, 32);
  }

  // console.log("ginfo", ginfo);
  // hidden_context.fillText(`${gs.char_pos.x}, ${gs.char_pos.y} (${Math.floor(gs.char_pos.x / 16)}, ${Math.floor((gs.char_pos.y + 16) / 16)}), ${ginfo.join(" ")}`, 10, 10);
}

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
  if (gs.char_pos.x > bg_render.width - 16) gs.char_pos.x = bg_render.width - 16;
  if (gs.char_pos.y > bg_render.height - 32) gs.char_pos.y = bg_render.height - 32;
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
