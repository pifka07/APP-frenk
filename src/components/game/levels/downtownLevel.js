const GROUND = [
  ['worker', 50, 90, true, false, 100], ['cop', 50, 90, true, false, 150],
  ['granny', 45, 85, true, false, 120], ['dog', 60, 55, true, false, 80],
  ['cat', 45, 55, true, false, 80], ['fruit_vendor', 55, 90, true, false, 100],
  ['car', 155, 60, false, true, 0], ['ac_unit', 65, 65, false, true, 0],
  ['trash_can', 45, 60, false, true, 0],
];
const AIR = [
  ['eagle', 80, 65, true, false, 200], ['drone', 75, 35, true, false, 150],
  ['seagull', 55, 40, true, false, 100],
];

export function spawnDowntownEnemy(width, height, groundY, scrollSpeed) {
  const useAir = Math.random() < 0.3;
  const pool = useAir ? AIR : GROUND;
  const [sprite, w, h, isTarget, isObstacle, score] = pool[Math.floor(Math.random() * pool.length)];
  const y = useAir ? 60 + Math.random() * (groundY - 160) : groundY - h;
  return { x: width + 50, y, width: w, height: h, vx: -(scrollSpeed * 1.5), hp: 1, isTarget, isObstacle, spriteType: sprite, scoreValue: score };
}
