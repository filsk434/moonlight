function enemyAggro() {
    if(isInAggroRange(player,enemy3) && currentMap == map2) {
        magnetice(player,enemy3);
        let enemyAggro = Math.random()*1000;
        if(enemyAggro >= 999) {
            shootArrow(enemy3.x, enemy3.y);
        }
        //shootArrow(enemy3.x, enemy3.y);
        if(isCollide(player,enemy3)) {
            player.hp -= 0.1;
        }
    }
}
