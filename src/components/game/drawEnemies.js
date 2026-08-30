export function drawEnemies(ctx, enemies, IMAGES, animFrame, isImageValid, SPRITE_MAP) {
    enemies.forEach(e => {
        if (!e.spriteType) {
            ctx.font = '30px serif';
            ctx.fillText('📦', e.x + e.width/2, e.y + e.height/2);
            return;
        }

        let sheet, sx, sy, sw, sh;
        const setFullImage = (img) => {
            if (isImageValid(img)) { sheet = img; sx = 0; sy = 0; sw = img.width; sh = img.height; return true; }
            return false;
        };

        if (IMAGES[e.spriteType] && isImageValid(IMAGES[e.spriteType])) {
            setFullImage(IMAGES[e.spriteType]);
        } else {
            sheet = IMAGES.enemiesSheet;
            const frames = SPRITE_MAP.enemies[e.spriteType] || SPRITE_MAP.enemies.car;
            const def = frames[0];
            sx = def.x * sheet.width; sy = def.y * sheet.height;
            sw = def.w * sheet.width; sh = def.h * sheet.height;
        }

        ctx.save();
        ctx.translate(e.x + e.width/2, e.y + e.height/2);
        const af = animFrame;
        const st = e.spriteType;
        if (st==='car'||st==='cop') ctx.translate(0,Math.sin(af*0.5)*2);
        else if (st==='granny'||st==='snail') ctx.rotate(Math.sin(af*0.2)*0.1);
        else if (st==='fly') ctx.translate(Math.sin(af*0.8)*5,Math.cos(af*0.8)*5);
        else if (st==='squirrel') ctx.translate(0,Math.abs(Math.sin(af*0.4))*-10);
        else if (st==='business_person'||st==='tourist') ctx.translate(Math.sin(af*0.3)*2,0);
        else if (st.startsWith('detroit_')) ctx.translate(Math.sin(af*0.15)*1.5,0);
        else if (st.includes('bird')||st.includes('pigeon')) ctx.translate(0,Math.sin(af*0.4)*3);
        else if (st==='rooftop_sparrow') ctx.translate(0,Math.sin(af*0.6)*2);
        else if (st.includes('drone')||st.includes('balloon')) ctx.translate(0,Math.sin(af*0.3)*2);
        else if (st.startsWith('berlin_npc')) ctx.translate(Math.sin(af*0.1)*0.5,0);
        else if (st.startsWith('backrooms_shadow')) {
            ctx.globalAlpha = 0.7 + Math.sin(af * 0.2) * 0.2;
            ctx.translate(Math.sin(af*0.3)*2, 0);
        }

        if (sheet && isImageValid(sheet)) {
            ctx.drawImage(sheet, sx, sy, sw, sh, -e.width/2, -e.height/2, e.width, e.height);
        } else {
            ctx.fillStyle = e.isObstacle && !e.isTarget ? '#ff6644' : '#4488ff';
            ctx.fillRect(-e.width/2, -e.height/2, e.width, e.height);
        }
        ctx.globalAlpha = 1.0;
        ctx.restore();
    });
}
