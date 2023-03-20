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




export function game_loop(gs: GameState, timestamp: DOMHighResTimeStamp) {
  frame_requested = false;
  gs.ms_passed = timestamp - old_timestamp;
  if (gs.ms_passed > 10) {
    gs.ticks += 1;
    old_timestamp = timestamp;
  }
  update_gs(gs);
  animate_bg(gs);
  animate_fg(gs);
  game_canvas_ctx.drawImage(hidden_canvas, 0, 0, game_canvas_ctx.canvas.width, game_canvas_ctx.canvas.height);
  if (document.hasFocus()) {
    window.requestAnimationFrame(function (ts) { game_loop(gs, ts); });
    frame_requested = true;
  }
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
  let bgy = gs.cheight / 2 - (gs.char_pos.y);
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
