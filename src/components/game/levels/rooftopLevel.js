const GROUND = [
  ['rooftop_ninja', 50, 88, true, false, 150], ['rooftop_sunbather', 55, 80, true, false, 100],
  ['rooftop_fitness', 50, 90, true, false, 100], ['rooftop_worker2', 50, 90, true, false, 100],
  ['rooftop_ninja2', 50, 88, true, false, 150], ['rooftop_ac2', 65, 65, false, true, 0],
];
const AIR = [
  ['rooftop_pigeon', 55, 45, true, false, 100], ['sparrow', 45, 35, true, false, 80],
];

export function spawnRooftopEnemy(width, height, groundY, scrollSpeed) {
  const useAir = Math.random() < 0.35;
  const pool = useAir ? AIR : GROUND;
  const [sprite, w, h, isTarget, isObstacle, score] = pool[Math.floor(Math.random() * pool.length)];
  const y = useAir ? 50 + Math.random() * (groundY - 150) : groundY - h;
  return { x: width + 50, y, width: w, height: h, vx: -(scrollSpeed * 1.5), hp: 1, isTarget, isObstacle, spriteType: sprite, scoreValue: score };
}
