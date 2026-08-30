// Loads an image and attaches it to the IMAGES ref by key
export function loadTransparentNPC(IMAGES, key, url) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;
  IMAGES.current[key] = img;
}
