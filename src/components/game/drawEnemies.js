export function drawEnemies(ctx, enemies, IMAGES, animFrame, isImageValid, SPRITE_MAP) {
  enemies.forEach(e => {
    if (e.hp <= 0) return;
    const img = IMAGES[e.spriteType];
    if (img && isImageValid(img)) {
      const bob = (e.isTarget && !e.isObstacle)
        ? Math.sin(animFrame * 0.08 + e.x * 0.01) * 3
        : 0;
      ctx.drawImage(img, e.x, e.y + bob, e.width, e.height);
    } else {
      ctx.fillStyle = e.isObstacle ? '#ff6644' : '#4488ff';
      ctx.fillRect(e.x, e.y, e.width, e.height);
    }
  });
}
