const NPC_COUNT = 10;
const BIRD_COUNT = 3;
const DRONE_COUNT = 3;

export function spawnBerlinEnemy(width, height, groundY, scrollSpeed) {
  const roll = Math.random();
  let sprite, w, h, isTarget, isObstacle, score, y;

  if (roll < 0.5) {
    const n = 1 + Math.floor(Math.random() * NPC_COUNT);
    sprite = `berlin_npc${n}`; w = 50; h = 90; isTarget = true; isObstacle = false; score = 100;
    y = groundY - h;
  } else if (roll < 0.75) {
    const n = 1 + Math.floor(Math.random() * BIRD_COUNT);
    sprite = `berlin_bird${n}`; w = 50; h = 40; isTarget = true; isObstacle = false; score = 80;
    y = 50 + Math.random() * (groundY - 150);
  } else {
    const n = 1 + Math.floor(Math.random() * DRONE_COUNT);
    sprite = `berlin_drone${n}`; w = 75; h = 35; isTarget = true; isObstacle = false; score = 150;
    y = 50 + Math.random() * (groundY - 150);
  }

  return { x: width + 50, y, width: w, height: h, vx: -(scrollSpeed * 1.5), hp: 1, isTarget, isObstacle, spriteType: sprite, scoreValue: score };
}
