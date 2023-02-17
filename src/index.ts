console.log('Try npm run lint/fix!');

let bg: HTMLCanvasElement;
let fg: HTMLCanvasElement;

var images_needed = 0;
var images_loaded = 0;
var images: {[key: string]: HTMLImageElement} = {};

function image_loaded(this: GlobalEventHandlers, ev: Event) {
  images_loaded += 1;
  if (ev.target instanceof HTMLImageElement) {
    if (ev.target.dataset.name) {
      images[ev.target.dataset.name] = ev.target;
      if (images_loaded == images_needed) {
        begin();
      }
    } else {
      console.log("bad name", ev.target.dataset.name)
    }
  } else {
    console.log("bad image_loaded event type", typeof ev.target)
  }
}

function loadImage(name: string, src: string) {
  images_needed += 1;
  var downloadingImage = new Image();
  downloadingImage.dataset.name = name;
  downloadingImage.onload = image_loaded;
  downloadingImage.src = src
}

function loadSprites() {
  loadImage("overworld", "src/zelda-like-tilesets-and-sprites/Overworld.png")
}

function begin() {
  bg = document.getElementById("bg") as HTMLCanvasElement;
  fg = document.getElementById("fg") as HTMLCanvasElement;
  bg.getContext("2d")?.drawImage(images["overworld"], 0, 0)
}

function init() {
  console.log("init", arguments);
  loadSprites();
}

document.onreadystatechange = init;