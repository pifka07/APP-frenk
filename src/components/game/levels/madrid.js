const GROUND = [
  ['madrid_waiter', 50, 90, true, false, 100], ['madrid_flamenco', 50, 92, true, false, 120],
  ['madrid_tourist_girl', 50, 88, true, false, 100], ['madrid_flower_girl', 50, 90, true, false, 100],
  ['madrid_elderly', 50, 85, true, false, 80], ['madrid_flight_attendant', 50, 92, true, false, 110],
  ['madrid_boy_tourist', 45, 85, true, false, 90], ['madrid_car', 155, 60, false, true, 0],
];
const AIR = [
  ['madrid_pigeon', 50, 42, true, false, 80], ['madrid_parrot', 45, 50, true, false, 100],
  ['madrid_sparrow', 40, 35, true, false, 70], ['madrid_drone', 75, 35, true, false, 150],
  ['madrid_balloon', 50, 75, true, false, 100],
];

export function spawnMadridEnemy(width, height, groundY, scrollSpeed) {
  const useAir = Math.random() < 0.35;
  const pool = useAir ? AIR : GROUND;
  const [sprite, w, h, isTarget, isObstacle, score] = pool[Math.floor(Math.random() * pool.length)];
  const y = useAir ? 50 + Math.random() * (groundY - 150) : groundY - h;
  return { x: width + 50, y, width: w, height: h, vx: -(scrollSpeed * 1.5), hp: 1, isTarget, isObstacle, spriteType: sprite, scoreValue: score };
}
