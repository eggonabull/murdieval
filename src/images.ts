import {Sprite} from 'types';

let images_needed = 0;
let images_loaded = 0;
const sprite_size = 16;

const images: {[key in Sprite]?: HTMLImageElement} = {};
let _callback: CallableFunction;

export function draw_sprite_map(
  sprite: Sprite,
  map: string,
  overlay: HTMLCanvasElement | undefined = undefined
): HTMLCanvasElement | undefined {
  const sprite_map = get_sprite(sprite);
  if (!sprite_map) return;

  let lines;
  if (!overlay) {
    lines = map.split('\n').map(x => x.trim());
  } else {
    lines = map.split('\n');
  }
  if (
    lines.length > 0 &&
    lines[0].trim().length === 0 &&
    lines[lines.length - 1].trim().length === 0
  ) {
    lines.pop();
    lines.shift();
  }

  const map_width = (lines[0].length * sprite_size) / 2;
  const map_height = lines.length * sprite_size;

  let canvas;
  let ctx;
  if (overlay) {
    canvas = overlay;
    if (overlay.width !== map_width || overlay.height !== map_height) {
      console.log('Overlay size mismatch', sprite);
      return;
    }
    ctx = canvas.getContext('2d');
  } else {
    canvas = document.createElement('canvas');
    canvas.width = map_width;
    canvas.height = map_height;
    ctx = canvas.getContext('2d');
  }

  if (!ctx) {
    console.log('bad context');
    return;
  }

  for (let li = 0; li < lines.length; li += 1) {
    const line = lines[li];
    for (let ci = 0; ci < line.length; ci += 2) {
      let x_char = line.charCodeAt(ci + 1);
      let y_char = line.charCodeAt(ci);
      if (x_char < 65 || x_char > 123 || y_char < 65 || y_char > 123) {
        continue;
      }
      if (x_char >= 97) {
        x_char -= 7;
      }
      if (y_char >= 97) {
        y_char -= 7;
      }
      x_char -= 65;
      y_char -= 65;
      const sx = x_char * sprite_size;
      const sy = y_char * sprite_size;
      const dx = (ci / 2) * sprite_size;
      const dy = li * sprite_size;
      ctx.drawImage(sprite_map, sx, sy, 16, 16, dx, dy, 16, 16);
    }
  }
  return canvas;
}

function image_loaded(this: GlobalEventHandlers, ev: Event) {
  images_loaded += 1;
  if (ev.target instanceof HTMLImageElement) {
    if (ev.target.dataset.name) {
      images[ev.target.dataset.name as Sprite] = ev.target;
      if (images_loaded === images_needed) {
        _callback();
      }
    } else {
      console.log('bad name', ev.target.dataset.name);
    }
  } else {
    console.log('bad image_loaded event type', typeof ev.target);
  }
}

function load_image(name: Sprite, src: string) {
  images_needed += 1;
  const downloadingImage = new Image();
  downloadingImage.dataset.name = name;
  downloadingImage.onload = image_loaded;
  downloadingImage.src = src;
}

export function load_sprites(callback: CallableFunction) {
  _callback = callback;
  load_image('overworld', 'src/zelda-like-tilesets-and-sprites/Overworld.png');
  load_image('character', 'src/zelda-like-tilesets-and-sprites/character.png');
}

export function get_sprite(sprite: Sprite) {
  return images[sprite];
}
