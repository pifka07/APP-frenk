const GROUND = [
  ['business_person', 50, 90, true, false, 120], ['tourist', 50, 88, true, false, 100],
  ['london_cop', 50, 90, true, false, 150], ['street_vendor', 55, 90, true, false, 100],
  ['street_musician', 50, 90, true, false, 100], ['london_car', 155, 60, false, true, 0],
];
const AIR = [
  ['pigeon', 55, 45, true, false, 80], ['london_pigeon', 50, 42, true, false, 80],
  ['balloon', 50, 70, true, false, 100], ['london_drone', 75, 35, true, false, 150],
];

export function spawnLondonEnemy(width, height, groundY, scrollSpeed) {
  const useAir = Math.random() < 0.35;
  const pool = useAir ? AIR : GROUND;
  const [sprite, w, h, isTarget, isObstacle, score] = pool[Math.floor(Math.random() * pool.length)];
  const y = useAir ? 50 + Math.random() * (groundY - 150) : groundY - h;
  return { x: width + 50, y, width: w, height: h, vx: -(scrollSpeed * 1.5), hp: 1, isTarget, isObstacle, spriteType: sprite, scoreValue: score, erratic: sprite === 'pigeon' || sprite === 'london_pigeon' };
}
