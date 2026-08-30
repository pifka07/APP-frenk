// USA Level

const GROUND_NPCS = [
    { spriteType:'cop',weight:3 },{ spriteType:'granny',weight:3 },{ spriteType:'worker',weight:3 },
    { spriteType:'dog',weight:4 },{ spriteType:'fruit_vendor',weight:2 },
    { spriteType:'london_car',weight:3 },{ spriteType:'cat',weight:3 }
];
const AIR_NPCS = [
    { spriteType:'eagle',weight:4 },{ spriteType:'sparrow',weight:5 },
    { spriteType:'balloon',weight:3 },{ spriteType:'pigeon',weight:4 }
];
function weightedRandom(pool) {
    let r=Math.random()*pool.reduce((s,e)=>s+e.weight,0);
    for(const item of pool){r-=item.weight;if(r<=0)return item;}
    return pool[0];
}

export function spawnUSAEnemy(width, height, groundY, scrollSpeed) {
    const isAir = Math.random() < 0.35;
    if (isAir) {
        const npc = weightedRandom(AIR_NPCS);
        const w = npc.spriteType==='eagle' ? 80 : (npc.spriteType==='balloon' ? 60 : 55);
        return { x:width+20, y:40+Math.random()*(groundY*0.6), vx:-scrollSpeed,
            width:w, height:w, spriteType:npc.spriteType, hp:1,
            isTarget:true, isObstacle:false, scoreValue:120,
            erratic:npc.spriteType.includes('pigeon') };
    } else {
        const npc = weightedRandom(GROUND_NPCS);
        const isVehicle = npc.spriteType==='london_car';
        const w=isVehicle?120:60, h=isVehicle?60:90;
        return { x:width+20, y:groundY-h, vx:isVehicle?-scrollSpeed*1.5:-scrollSpeed,
            width:w, height:h, spriteType:npc.spriteType, hp:1,
            isTarget:true, isObstacle:isVehicle, scoreValue:isVehicle?200:100 };
    }
}
