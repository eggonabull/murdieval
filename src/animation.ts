import {draw_sprite_map, get_sprite} from './images';
import {
  layer0Sprite,
  layer0Map,
  get_ground_info,
  draw_over_player,
  layer1flattened
} from 'background';
import {GameState, Direction, CopyBounds} from './types';

let hidden_canvas: HTMLCanvasElement;
let hidden_context: CanvasRenderingContext2D;
let bg_render: HTMLCanvasElement;
let fg_render: HTMLCanvasElement;

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

export function init_animation(game_canvas: HTMLCanvasElement) {
  hidden_canvas = document.createElement('canvas');
  const hidden_ctx = hidden_canvas.getContext('2d');
  if (!hidden_ctx) {
    console.log('bad context');
    return;
  }
  hidden_context = hidden_ctx;

  window.onresize = function () {
    game_canvas.width = (window.innerWidth + window.innerHeight) * 2 / 3;
    game_canvas.height = (window.innerWidth + window.innerHeight) * 2 / 3;
    game_canvas.style.width = window.innerWidth + "px";
    game_canvas.style.height = Math.round(window.innerWidth) + "px";
    hidden_canvas.width = 256 * Math.max(Math.round(game_canvas.width / 1024), 1);
    hidden_canvas.height = 192 * Math.max(Math.round(game_canvas.height / 768), 1);
  }
  window.onresize(new UIEvent('resize'));

  const bg_sprite_map = draw_sprite_map(layer0Sprite, layer0Map);
  if (!bg_sprite_map) {
    console.log('bad bg_sprite_map');
    return;
  }
  bg_render = bg_sprite_map;

  const fg_sprite_map = draw_sprite_map(layer0Sprite, layer1flattened, undefined, bg_sprite_map.width);
  if (!fg_sprite_map) {
    console.log('bad fg_sprite_map');
    return;
  }
  fg_render = fg_sprite_map;
}

export function animate_bg(gs: GameState) {
  let bgx = gs.cwidth / 2 - gs.char_pos.x;
  let bgy = gs.cheight / 2 - (gs.char_pos.y);
  if (bgx > 0) bgx = 0;
  if (bgy > 0) bgy = 0;
  if (bgx < gs.cwidth - bg_render.width) bgx = gs.cwidth - bg_render.width;
  if (bgy < gs.cheight - bg_render.height) bgy = gs.cheight - bg_render.height;
  gs.camera_pos = {x: bgx, y: bgy};
  hidden_context.drawImage(bg_render, bgx, bgy);
  hidden_context.drawImage(fg_render, bgx, bgy);
}

export function animate_fg(gs: GameState) {
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
  hidden_context.beginPath();
  hidden_context.fillStyle = 'white';
  hidden_context.fillRect(0, 0, 400, 20);
  hidden_context.fillStyle = 'black';
  hidden_context.fillText(`${gs.char_pos.x}, ${gs.char_pos.y} (${Math.floor(gs.char_pos.x / 16)}, ${Math.floor((gs.char_pos.y + 16) / 16)}), ${ginfo.join(" ")}`, 10, 10);
}

export function final_animation_step(game_canvas_ctx: CanvasRenderingContext2D) {
  game_canvas_ctx.drawImage(hidden_canvas, 0, 0, game_canvas_ctx.canvas.width, game_canvas_ctx.canvas.height);
}
