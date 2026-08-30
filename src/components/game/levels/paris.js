const GROUND = [
  ['paris_tourist', 50, 88, true, false, 100], ['watch_seller', 50, 90, true, false, 110],
  ['paris_mime', 50, 90, true, false, 120], ['police_man', 50, 90, true, false, 150],
  ['paris_car', 155, 60, false, true, 0],
];
const AIR = [
  ['paris_pigeon', 50, 42, true, false, 80], ['paris_balloon', 50, 75, true, false, 100],
];

export function spawnParisEnemy(width, height, groundY, scrollSpeed) {
  const useAir = Math.random() < 0.3;
  const pool = useAir ? AIR : GROUND;
  const [sprite, w, h, isTarget, isObstacle, score] = pool[Math.floor(Math.random() * pool.length)];
  const y = useAir ? 50 + Math.random() * (groundY - 160) : groundY - h;
  return { x: width + 50, y, width: w, height: h, vx: -(scrollSpeed * 1.5), hp: 1, isTarget, isObstacle, spriteType: sprite, scoreValue: score };
}
