import {load_sprites, draw_sprite_map, get_sprite} from './images';
import {layer0Sprite, layer0Map, layer1, get_ground_info, draw_over_player, layer1flattened, blocks_player} from 'background';
import {GameState, Direction, CopyBounds} from './types';
import {game_loop} from './animation';


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
  char_pos: {x: 32, y: 64},
  last_pos: {x: 512, y: 684},
  ms_passed: 0,
  direction: Direction.North,
  walking: false,
  walk_start: 0,
  speed: 0,
  frames_wanted: false,
};
const keyArray: {[key: string]: boolean} = {};

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
