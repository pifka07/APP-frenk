// Backrooms Level - The endless yellow corridors

export const spawnBackroomsEnemy = (width, height, groundY, scrollSpeed) => {
    const walkingNpcY = groundY * 0.98;
    const rand = Math.random();
    const isAir = Math.random() > 0.6;
    const heightVariation = Math.random() * 80;

    let enemy = {
        x: width + 50, y: groundY - 60,
        width: 50, height: 80,
        hp: 1, isTarget: true, isObstacle: true,
        scoreValue: 20, vx: -scrollSpeed, spriteType: 'backrooms_shadow'
    };

    if (!isAir) {
        if (rand < 0.4) {
            enemy.spriteType = 'backrooms_shadow'; enemy.width = 50; enemy.height = 90;
            enemy.y = walkingNpcY - 90 + heightVariation * 0.2;
            enemy.vx = -scrollSpeed * 0.9; enemy.scoreValue = 20; enemy.isObstacle = true;
        } else if (rand < 0.65) {
            enemy.spriteType = 'backrooms_shadow_tall'; enemy.width = 45; enemy.height = 110;
            enemy.y = walkingNpcY - 110 + heightVariation * 0.1;
            enemy.vx = -scrollSpeed * 0.7; enemy.scoreValue = 30; enemy.isObstacle = true;
        } else if (rand < 0.8) {
            enemy.spriteType = 'backrooms_shadow_low'; enemy.width = 70; enemy.height = 55;
            enemy.y = walkingNpcY - 55 + heightVariation * 0.3;
            enemy.vx = -scrollSpeed * 1.1; enemy.scoreValue = 25; enemy.isObstacle = true;
        } else {
            enemy.spriteType = 'backrooms_shadow'; enemy.width = 50; enemy.height = 90;
            enemy.y = walkingNpcY - 90 + heightVariation * 0.2;
            enemy.vx = -scrollSpeed * 1.4; enemy.scoreValue = 30; enemy.isObstacle = true;
        }
    } else {
        const flyHeight = 30 + Math.random() * (groundY * 0.5);
        const airRand = Math.random();
        if (airRand < 0.5) {
            enemy.spriteType = 'backrooms_shadow';
            enemy.isTarget = true; enemy.isObstacle = true;
            enemy.y = flyHeight; enemy.width = 50; enemy.height = 90;
            enemy.vx = -scrollSpeed * 1.2; enemy.scoreValue = 25;
        } else if (airRand < 0.75) {
            enemy.spriteType = 'backrooms_shadow_tall';
            enemy.isTarget = false; enemy.isObstacle = true;
            enemy.y = flyHeight; enemy.width = 45; enemy.height = 110;
            enemy.vx = -scrollSpeed * 1.8; enemy.scoreValue = 0;
        } else {
            enemy.spriteType = 'backrooms_shadow_low';
            enemy.isTarget = true; enemy.isObstacle = true;
            enemy.y = flyHeight; enemy.width = 70; enemy.height = 55;
            enemy.vx = -scrollSpeed * 1.0; enemy.scoreValue = 35;
        }
    }

    return enemy;
};
