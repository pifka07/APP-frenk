const GROUND = [
  ['worker', 50, 90, true, false, 100], ['cat', 45, 55, true, false, 80],
  ['cop', 50, 90, true, false, 150], ['ac_unit', 65, 65, false, true, 0],
];

export function spawnBackroomsEnemy(width, height, groundY, scrollSpeed) {
  const [sprite, w, h, isTarget, isObstacle, score] = GROUND[Math.floor(Math.random() * GROUND.length)];
  return { x: width + 50, y: groundY - h, width: w, height: h, vx: -(scrollSpeed * 1.5), hp: 1, isTarget, isObstacle, spriteType: sprite, scoreValue: score };
}
