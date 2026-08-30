const GROUND = [
  ['rome_tourist', 50, 88, true, false, 100], ['rome_priest', 50, 90, true, false, 120],
  ['rome_pizza_chef', 55, 90, true, false, 110], ['rome_vespa_driver', 80, 70, true, false, 130],
  ['rome_old_lady', 45, 85, true, false, 80], ['rome_gladiator', 55, 92, true, false, 150],
  ['rome_musician', 50, 90, true, false, 100], ['rome_car', 155, 60, false, true, 0],
];
const AIR = [
  ['rome_bird1', 50, 40, true, false, 80], ['rome_bird2', 50, 40, true, false, 80],
  ['rome_bird3', 50, 40, true, false, 80], ['rome_bird4', 50, 40, true, false, 80],
  ['rome_bird5', 50, 40, true, false, 80],
];

export function spawnRomeEnemy(width, height, groundY, scrollSpeed) {
  const useAir = Math.random() < 0.3;
  const pool = useAir ? AIR : GROUND;
  const [sprite, w, h, isTarget, isObstacle, score] = pool[Math.floor(Math.random() * pool.length)];
  const y = useAir ? 50 + Math.random() * (groundY - 150) : groundY - h;
  return { x: width + 50, y, width: w, height: h, vx: -(scrollSpeed * 1.5), hp: 1, isTarget, isObstacle, spriteType: sprite, scoreValue: score };
}
