import {Layer, Sprite, DrawInstruction, sprite_cell_size} from 'types';

let images_needed = 0;
let images_loaded = 0;

const images: {[key in Sprite]?: HTMLImageElement} = {};
let _callback: CallableFunction;

export function draw_sprite_map(
  sprite: Sprite,
  map: string,
  overlay: HTMLCanvasElement | undefined = undefined,
  width: number | undefined = undefined,
): HTMLCanvasElement | undefined {
  const sprite_map = get_sprite(sprite);
  if (!sprite_map) return;

  let lines = map.split('\n');

  if (
    lines.length > 0 &&
    lines[0].length === 0 &&
    lines[lines.length - 1].length === 0
  ) {
    lines.pop();
    lines.shift();
  }

  console.log("lines[0]", lines[0])
  if (lines[0][0] === ' ') {
    for (let line = 0; line < lines.length; line += 1) {
      let leading_spaces = lines[0].match(/^ +(?:\w)/);
      if (leading_spaces && leading_spaces.length) {
        var lead_trim = leading_spaces[0].length;
        console.log(line, lines[line], lines[line].substring(lead_trim))
        lines[line] = lines[line].substring(lead_trim);
      }
    }
  }

  const map_width = width || (lines[0].length * sprite_cell_size) / 2;
  const map_height = lines.length * sprite_cell_size;

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
        x_char -= 6;
      }
      if (y_char >= 97) {
        y_char -= 6;
      }
      x_char -= 65;
      y_char -= 65;
      const sx = x_char * sprite_cell_size;
      const sy = y_char * sprite_cell_size;
      const dx = (ci / 2) * sprite_cell_size;
      const dy = li * sprite_cell_size;
      ctx.drawImage(sprite_map, sx, sy, sprite_cell_size, sprite_cell_size, dx, dy, sprite_cell_size, sprite_cell_size);
    }
  }
  return canvas;
}

function draw_instruction(target: HTMLCanvasElement, instruction: DrawInstruction) {
  const sprite = get_sprite(instruction.def.sprite);
  if (!sprite) return;

  const ctx = target.getContext('2d');
  if (!ctx) return;

  const {x, y} = instruction.pos;
  if (instruction.def.copy_bound) {
    const {l, t, w, h} = instruction.def.copy_bound;
    ctx.drawImage(sprite, l, t, w, h, x, y, w, h);
  } else if (instruction.def.map) {
    const rendered = draw_sprite_map(instruction.def.sprite, instruction.def.map);
    if (rendered) {
      ctx.drawImage(rendered, x * sprite_cell_size, y * sprite_cell_size);
    }
  }
}

export function draw_layer(layer: Layer, target: HTMLCanvasElement) {
  for (const instruction of layer) {
    draw_instruction(target, instruction);
  }
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
