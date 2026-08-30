// Berlin Level Enemy Spawning

const GROUND_ENEMIES = [
    { type:'berlin_npc1',weight:3 },{ type:'berlin_npc2',weight:3 },{ type:'berlin_npc3',weight:3 },
    { type:'berlin_npc4',weight:3 },{ type:'berlin_npc5',weight:3 },{ type:'berlin_npc6',weight:3 },
    { type:'berlin_npc7',weight:3 },{ type:'berlin_npc8',weight:3 },{ type:'berlin_npc9',weight:3 },
    { type:'berlin_npc10',weight:3 }
];
const AIR_ENEMIES = [
    { type:'berlin_bird1',weight:3 },{ type:'berlin_bird2',weight:3 },{ type:'berlin_bird3',weight:3 },
    { type:'berlin_drone1',weight:2 },{ type:'berlin_drone2',weight:2 },{ type:'berlin_drone3',weight:2 },
    { type:'fly',weight:2 },{ type:'eagle',weight:1 },{ type:'drone_l2',weight:1 },{ type:'balloon',weight:2 }
];

export function spawnBerlinEnemy(width, height, groundY, scrollSpeed) {
    const isAir = Math.random() < 0.5;
    const pool = isAir ? AIR_ENEMIES : GROUND_ENEMIES;
    const total = pool.reduce((s,e)=>s+e.weight,0);
    let rand = Math.random()*total;
    let selectedType = pool[0].type;
    for (const e of pool) { rand -= e.weight; if (rand <= 0) { selectedType = e.type; break; } }

    const baseHeight = 100;
    const enemy = {
        x: width+50,
        y: isAir ? 50+Math.random()*(groundY*0.67-50) : groundY-120,
        width: baseHeight*0.7, height: baseHeight,
        vx: -scrollSpeed, hp: 1,
        isTarget: true, isObstacle: true, scoreValue: 10,
        spriteType: selectedType, maintainAspect: true
    };
    if (selectedType.includes('drone')) { enemy.height=80; enemy.width=120; enemy.scoreValue=20; }
    else if (selectedType.includes('bird')) { enemy.height=80; enemy.width=80; enemy.scoreValue=15; }
    return enemy;
}
