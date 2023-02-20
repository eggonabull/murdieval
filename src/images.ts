let images_needed = 0;
let images_loaded = 0;

export type Sprite = 'overworld';

const images: {[key in Sprite]?: HTMLImageElement} = {};
let _callback: CallableFunction;

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
}

export function get_sprite(sprite: Sprite) {
  return images[sprite];
}
