const OBSTACLES = [
  ['detroit_sedan', 155, 60], ['detroit_muscle_car', 165, 65],
  ['detroit_pickup_truck', 170, 65], ['detroit_barrel', 50, 60],
  ['detroit_dumpster', 90, 70], ['detroit_hydrant', 40, 55],
];
const AIR = [
  ['detroit_crow', 55, 45], ['detroit_broken_drone', 75, 35],
];

export function spawnDetroitEnemy(width, height, groundY, scrollSpeed) {
  const useAir = Math.random() < 0.3;
  if (useAir) {
    const [sprite, w, h] = AIR[Math.floor(Math.random() * AIR.length)];
    const y = 60 + Math.random() * (groundY - 160);
    return { x: width + 50, y, width: w, height: h, vx: -(scrollSpeed * 1.5), hp: 1, isTarget: true, isObstacle: false, spriteType: sprite, scoreValue: 130 };
  }
  const [sprite, w, h] = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
  return { x: width + 50, y: groundY - h, width: w, height: h, vx: -(scrollSpeed * 1.5), hp: 1, isTarget: false, isObstacle: true, spriteType: sprite, scoreValue: 0 };
}
