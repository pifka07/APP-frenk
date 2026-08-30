const GROUND = [
  ['squirrel', 50, 55, true, false, 100], ['snail', 55, 45, true, false, 80],
  ['raccoon', 60, 65, true, false, 100], ['trash_can', 45, 60, false, true, 0],
];
const AIR = [
  ['fly', 40, 35, true, false, 60],
];

export function spawnParkEnemy(width, height, groundY, scrollSpeed) {
  const useAir = Math.random() < 0.25;
  const pool = useAir ? AIR : GROUND;
  const [sprite, w, h, isTarget, isObstacle, score] = pool[Math.floor(Math.random() * pool.length)];
  const y = useAir ? 50 + Math.random() * (groundY - 140) : groundY - h;
  return { x: width + 50, y, width: w, height: h, vx: -(scrollSpeed * 1.5), hp: 1, isTarget, isObstacle, spriteType: sprite, scoreValue: score };
}
