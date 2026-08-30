export function drawProjectiles(ctx, poops, animFrame, IMAGES, isImageValid) {
  poops.forEach(p => {
    if (!p.active) return;

    let img;
    if (p.type === 'triple') img = IMAGES.poopTriple;
    else if (p.type === 'laser') img = IMAGES.laserProjectile;
    else if (p.type === 'bone') img = IMAGES.boneProjectile;
    else img = IMAGES.poopProjectile;

    if (img && isImageValid(img)) {
      ctx.save();
      ctx.translate(p.x, p.y);
      if (p.type !== 'laser') {
        ctx.rotate(Math.atan2(p.vy, p.vx) + Math.PI / 2);
      }
      ctx.drawImage(img, -p.width / 2, -p.height / 2, p.width, p.height);
      ctx.restore();
    } else {
      ctx.fillStyle = p.type === 'laser' ? '#00ffff' : '#8B4513';
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.min(p.width, p.height) / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}
