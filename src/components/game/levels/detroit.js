// Detroit Level Configuration

const GROUND_NPCS = [
    { spriteType:'detroit_sedan',weight:5,isVehicle:true },
    { spriteType:'detroit_muscle_car',weight:4,isVehicle:true },
    { spriteType:'detroit_pickup_truck',weight:4,isVehicle:true },
    { spriteType:'detroit_barrel',weight:5,isVehicle:false },
    { spriteType:'detroit_dumpster',weight:4,isVehicle:false },
    { spriteType:'detroit_hydrant',weight:3,isVehicle:false }
];
const AIR_NPCS = [
    { spriteType:'detroit_crow',weight:6 },
    { spriteType:'detroit_broken_drone',weight:4 }
];
function weightedRandom(pool) {
    let r=Math.random()*pool.reduce((s,e)=>s+e.weight,0);
    for(const item of pool){r-=item.weight;if(r<=0)return item;}
    return pool[0];
}

export function spawnDetroitEnemy(width, height, groundY, scrollSpeed) {
    const isAir = Math.random() < 0.35;
    if (isAir) {
        const npc = weightedRandom(AIR_NPCS);
        return { x:width+20, y:40+Math.random()*(groundY*0.6), vx:-scrollSpeed,
            width:70, height:70, spriteType:npc.spriteType, hp:1,
            isTarget:true, isObstacle:true, scoreValue:120,
            erratic:npc.spriteType==='detroit_crow' };
    } else {
        const npc = weightedRandom(GROUND_NPCS);
        const w=npc.isVehicle?264:70, h=npc.isVehicle?156:90;
        return { x:width+20, y:groundY-h, vx:npc.isVehicle?-scrollSpeed*1.5:-scrollSpeed,
            width:w, height:h, spriteType:npc.spriteType, hp:1,
            isTarget:true, isObstacle:true, scoreValue:npc.isVehicle?200:100 };
    }
}
