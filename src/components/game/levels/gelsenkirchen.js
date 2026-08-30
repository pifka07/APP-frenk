// Gelsenkirchen Level Enemy Spawning

const groundEnemyTypes = [
    { type:'gelsenkirchen_npc1',weight:1 },{ type:'gelsenkirchen_npc2',weight:1 },
    { type:'gelsenkirchen_npc3',weight:1 },{ type:'gelsenkirchen_npc4',weight:1 },
    { type:'gelsenkirchen_npc5',weight:1 },{ type:'gelsenkirchen_npc6',weight:1 },
    { type:'gelsenkirchen_npc7',weight:1 },{ type:'gelsenkirchen_npc8',weight:1 },
    { type:'gelsenkirchen_npc9',weight:1 },{ type:'gelsenkirchen_npc10',weight:1 },
    { type:'gelsenkirchen_npc11',weight:1 }
];
const airEnemyTypes = [
    { type:'gelsenkirchen_bird1',weight:2 },{ type:'gelsenkirchen_bird2',weight:2 },
    { type:'gelsenkirchen_bird3',weight:2 },{ type:'gelsenkirchen_drone1',weight:1 },
    { type:'gelsenkirchen_drone2',weight:1 },{ type:'gelsenkirchen_drone3',weight:1 },
    { type:'gelsenkirchen_drone4',weight:1 },{ type:'gelsenkirchen_drone5',weight:1 },
    { type:'gelsenkirchen_drone6',weight:1 }
];

export function spawnGelsenkirchenEnemy(width, height, groundY, scrollSpeed) {
    const enemy = { x:width+50, y:0, vx:-scrollSpeed, vy:0, hp:1, spriteType:'', isTarget:true, isObstacle:true, width:80, height:120, scoreValue:10 };
    const spawnAir = Math.random() < 0.5;
    const pool = spawnAir ? airEnemyTypes : groundEnemyTypes;
    let random = Math.random() * pool.reduce((s,t)=>s+t.weight,0);
    let selectedType = pool[0].type;
    for (const t of pool) { random -= t.weight; if (random <= 0) { selectedType = t.type; break; } }
    enemy.spriteType = selectedType;
    if (spawnAir) {
        enemy.width = 60; enemy.height = 60;
        enemy.y = 50 + Math.random() * (groundY - 90 - 50);
        enemy.erratic = true;
    } else {
        const minY = groundY - 70;
        enemy.y = minY + Math.random() * (groundY - enemy.height - minY);
    }
    return enemy;
}
