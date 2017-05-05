const LVL_MAX = 1;
const PRIMARY_AXIS_LEN = 500000;
const SECONDARY_AXIS_LEN = 10000;
const SCROLLING_SPEED = 4;
const WIDTH = 800;
const HEIGHT = 500;
const POWUP_CHOICE = 5;
const MAX_INVULNERABILITY = 60;

var ctx = null;

var score;
var lives;
var pos_on_map = 0;
var in_play;
var level;
var vertical_oriented;
var eligible_powup;
var lvl_size = [];

var dt;
var old = Date.now();
var delta;

var arrow = {up: false, right: false, down: false, left: false};

var rect = {x: -1, y: -1, width: 0, height: 0};
var dir = {x: 0, y: 0};
var powups = [];
var bullet = {rect: {}, dir: {}, exists: false, power: 0, speed: 0, friend_bul: false};
var bullets = [];
var weapon = {until_shot: 0, delay: 0, bullet: {}};
var foe = {rect: {}, type: ' ', shooting: false, weapon: {}, has_powup: false, speed: 0, hp: 0, earned_points: 0};
var foes = [[]];
var space_ship = {rect: {}, speed: 0, weapon: {}, lvl_weapon: 0, missile: false, ripple: false, laser: false, force: false, invulnerability: false, invulnerability_timer: 0};
var wall = {rect: {}, type: ' ', destroyable: false};
var walls = [[]];

init = function() {
    ctx = document.getElementById("cvs").getContext("2d");
    ctx.width = document.getElementById("cvs").width;
    ctx.height = document.getElementById("cvs").height;
	
	in_play = true;
	lives = 5;
	eligible_powup = 0;
	vertical_oriented = false;
	
	document.addEventListener("keydown", keyPress);
	document.addEventListener("keyup", keyRelease);

	level = 1;
	
	foes[0][0] = {rect: {x: 950, y: HEIGHT / 2, width: 40, height: 20}, type: 'm', shooting: false, weapon: {}, has_powup: true, speed: 10, hp: 5, earned_points: 0}; //dummy foe to test with
	
	walls[0][0] = {rect: {x: 1200, y: HEIGHT - 40, width: 40, height: 40}, type: 's', destroyable: false};
	
	for (i = 0; i <= 29; i++) {
		bullet = {rect: {x: 0, y: 0, width: 5, height: 5},dir: {x: -1, y: 0}, exists: false, power: 0, speed: 0, friend_bul: false};
		bullets[i] = bullet;
	}
	
	for (i = 0; i <= 19; i++) {
		powup = {rect: {x: 0, y: 0, height: 10, width: 10}, exists: false};
		powups[i] = powup;
	}
	
	space_ship.rect = {x: 0, y: HEIGHT / 2, width: 40, height: 20};
	space_ship.speed = 0.25;
	space_ship.weapon = {until_shot: 0, delay: 30, bullet: {rect:{}, exists: false, power: 1, speed: 0.40, friend_bul: true}};
	game();
}

game = function() {
	update(Date.now());
	render();
	if (in_play) {
		requestAnimationFrame(game);
	}
}

update = function(d) {
	dt = d - old;
	old = d;
	delta = dt * space_ship.speed;
	
	if (arrow.right) {
		space_ship.rect.x += delta;
		if (vertical_oriented) { //ugly but...
			if (space_ship.rect.x + space_ship.rect.width >= WIDTH) {
				space_ship.rect.x = WIDTH - space_ship.rect.width;
			}
		} else {
			if (space_ship.rect.x + space_ship.rect.width - pos_on_map >= WIDTH) {
				space_ship.rect.x = WIDTH - space_ship.rect.width + pos_on_map;
			}
		}
 
	}
	if (arrow.left) {
		space_ship.rect.x -= delta;
		if (vertical_oriented) {
			if (space_ship.rect.x <= 0) {
				space_ship.rect.x = 0;
			}
		} else {
			if (space_ship.rect.x - pos_on_map <= 0) {
				space_ship.rect.x = 0 + pos_on_map;
			}
		}
	}
	if (arrow.down) {
		space_ship.rect.y += delta;
		if (vertical_oriented) {
			if (space_ship.rect.y + space_ship.rect.height >= HEIGHT) {
				space_ship.rect.y = HEIGHT - space_ship.rect.height;
			} //later...
		} else {
			if (space_ship.rect.y + space_ship.rect.height >= HEIGHT) {
				space_ship.rect.y = HEIGHT - space_ship.rect.height;
			}
		}
	}
	if (arrow.up) {
		space_ship.rect.y -= delta;
		if (vertical_oriented) {
			if (space_ship.rect.y <= 0) {
				space_ship.rect.y = 0;
			} //later...
		} else {
			if (space_ship.rect.y <= 0) {
				space_ship.rect.y = 0;
			}			
		}
	}
	
	if (space_ship.weapon.until_shot > 0) {
		space_ship.weapon.until_shot--;
	}
	
	for (i = 0; i <= bullets.length - 1; i++) {
		if (bullets[i].exists) {
			if (vertical_oriented) {
				bullets[i].rect.x += bullets[i].dir.x * (delta / space_ship.speed * bullets[i].speed);
				bullets[i].rect.y += bullets[i].dir.y * (delta / space_ship.speed * bullets[i].speed);
				if (bullets[i].friend_bul && space_ship.ripple) {
					bullets[i].rect.height += delta / space_ship.speed * bullets[i].speed * 0.1;
					bullets[i].rect.y -= delta / space_ship.speed * bullets[i].speed * 0.05;
				}
				
				if (bullets[i].rect.x >= WIDTH || bullets[i].rect.x <= - bullets[i].rect.width || bullets[i].rect.y >= HEIGHT || bullets[i].rect.y <= - bullets[i].rect.height) {
					reset_bullet(bullets[i]);
				}
				//later...
			} else {
				bullets[i].rect.x += bullets[i].dir.x * (delta / space_ship.speed * bullets[i].speed) + SCROLLING_SPEED;
				bullets[i].rect.y += bullets[i].dir.y * (delta / space_ship.speed * bullets[i].speed);
				if (bullets[i].friend_bul && space_ship.ripple) {
					bullets[i].rect.height += delta / space_ship.speed * bullets[i].speed * 0.1;
					bullets[i].rect.y -= delta / space_ship.speed * bullets[i].speed * 0.05;
				}
				if (bullets[i].rect.x - pos_on_map >= WIDTH || bullets[i].rect.x - pos_on_map <= - bullets[i].rect.width || bullets[i].rect.y >= HEIGHT || bullets[i].rect.y <= - bullets[i].rect.height) {
					reset_bullet(bullets[i]);
				}
			}
		}
	}
	
	for (i = 0; i <= foes[level - 1].length - 1; i++) {
		if (foes[level - 1][i].hp > 0) {
			for (j = 0; j <= bullets.length - 1; j++) {
				if (collides(bullets[j], foes[level - 1][i]) && bullets[j].friend_bul) {
					foes[level - 1][i].hp -= bullets[j].power;
					reset_bullet(bullets[j]);
					if (foes[level - 1][i].has_powup && foes[level - 1][i].hp <= 0) {
						for (k = 0; k <= powups.length - 1; k++) {
							if (!powups[k].exists) {
								powups[k].exists = true;
								powups[k].rect.x = foes[level - 1][i].rect.x;
								powups[k].rect.y = foes[level - 1][i].rect.y;
								break;
							}
						}
					}
				}
			}
			
			if (!(space_ship.invulnerability) && collides(space_ship, foes[level - 1][i])) {
				if (space_ship.force) {
					space_ship.force = false;
					space_ship.rect.x = foes[level - 1][i].rect.x - space_ship.rect.width - 5;
				} else {
					life_lost()
				}
			}
		}
	}
	
	for (i = 0; i <= powups.length - 1; i++) {
		if (collides(space_ship, powups[i]) && powups[i].exists) {
			powups[i].exists = false;
			eligible_powup++;
			eligible_powup %= POWUP_CHOICE;
		}
	}
	
	for (i = 0; i <= walls[level - 1].length - 1; i++) {
		for (j = 0; j <= bullets.length - 1; j++) {
			if (bullets[j].exists && collides(bullets[j], walls[level - 1][i])) {
				reset_bullet(bullets[j]);
			}
		}
		if (!(space_ship.invulnerability) && collides(space_ship, walls[level - 1][i])) {
			life_lost();
		}
	}
	
	if (space_ship.invulnerability_timer > 0) {
		space_ship.invulnerability_timer--;
	}
	
	if (space_ship.invulnerability_timer == 0) {
		space_ship.invulnerability = false;
	}
	
	if (vertical_oriented) {
		space_ship.rect.y += SCROLLING_SPEED;
	} else {
		space_ship.rect.x += SCROLLING_SPEED;
	}
	
	pos_on_map += SCROLLING_SPEED;
	if (space_ship.rect.x <= 1000) {
		console.log(space_ship.rect.x);
	}
}

render = function() {
	ctx.clearRect(0, 0, ctx.width, ctx.height);
	
	if (space_ship.invulnerability && (space_ship.invulnerability_timer % 4 == 1 || space_ship.invulnerability_timer % 4 == 2)) {
		ctx.fillStyle = "#FFFFFF";
	} else {
		ctx.fillStyle = "#FF0000";
	}
	rectFill(space_ship);
	
	if (space_ship.force) {
		ctx.strokeStyle = "#42ebf4"
		ctx.strokeRect(space_ship.rect.x, space_ship.rect.y, space_ship.rect.width, space_ship.rect.height);
	}
	
	for (i = 0; i <= bullets.length - 1; i++) {
		if (bullets[i].exists) {
			if (bullets[i].friend_bul) {
				if (bullets[i].dir.y != 0) {
					ctx.fillStyle = "#0000FF";
				} else {
					ctx.fillStyle = "#FFFF00";
				}
			}
			rectFill(bullets[i]);
		}
	}

	for (i = 0; i <= foes[0].length - 1; i++) {
		if (foes[level - 1][i].hp > 0) {
			switch (foes[level - 1][i].type ) {
				case 'm': {
					ctx.fillStyle = "#0000FF";
					rectFill(foes[level - 1][i]);
				}
				default: {
					ctx.fillStyle = "#FFFFFF";
				}
			}
		}
	}
	
	for (i = 0; i <= powups.length - 1; i++) {
		ctx.fillStyle = "#f49e42";
		if (powups[i].exists) {
			rectFill(powups[i]);
		}
	}
	
	for (i = 0; i <= walls[level - 1].length - 1; i++) {
		switch (walls[level - 1][i].type) {
			case 's': {
				ctx.fillStyle = "#d854a1";
				rectFill(walls[level - 1][i]);
			}
			default: {
				ctx.fillStyle = "#FFFFFF";
			}
		}
	}
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, HEIGHT, WIDTH, 100);
	
	powup_choice_render();
	ctx.strokeStyle = "#FFFFFF";
	for (i = 0; i <= POWUP_CHOICE - 1; i++) {
		ctx.strokeRect(i * 25, ctx.height - 75, 20, 5);
	}
}

collides = function(a, b) {
	return a.rect.x < b.rect.x + b.rect.width && a.rect.x + a.rect.width > b.rect.x && a.rect.y < b.rect.y + b.rect.height && a.rect.height + a.rect.y > b.rect.y;
}

rectFill = function(a) {
	if (vertical_oriented) {
		ctx.fillRect(a.rect.x, a.rect.y - pos_on_map, a.rect.width, a.rect.height);
	} else {
		ctx.fillRect(a.rect.x - pos_on_map, a.rect.y, a.rect.width, a.rect.height);
	}
}

playerShoot = function() {
	if (space_ship.weapon.until_shot == 0) {
		space_ship.weapon.until_shot = space_ship.weapon.delay;
		for (i = 0; i <= bullets.length - 1; i++) {
			if (!bullets[i].exists) {
				var j = i;
				var k = 0;
				while (((space_ship.laser && k <= 4) || k < 1) && j <= bullets.length - 1) {
					if (!bullets[j].exists) {
						bullets[j].exists = true;
						bullets[j].rect.x = space_ship.rect.x + space_ship.rect.width - k * 10;
						bullets[j].rect.y = space_ship.rect.y + space_ship.rect.height / 2;
						bullets[j].rect.width = 5;
						bullets[j].rect.height = 5;
						bullets[j].dir.x = 1;
						bullets[j].dir.y = 0;
						bullets[j].friend_bul = true;
						bullets[j].power = space_ship.weapon.bullet.power;
						bullets[j].speed = space_ship.weapon.bullet.speed;
						k++;
					}
					j++;
				}
				if (space_ship.missile) {
					for (l = i; l <= bullets.length - 1; l++) {
						if (!bullets[l].exists) {
							bullets[l].exists = true;	
							bullets[l].rect.x = space_ship.rect.x + space_ship.rect.width;
							bullets[l].rect.y = space_ship.rect.y + space_ship.rect.height / 2;
							bullets[l].rect.width = 5;
							bullets[l].rect.height = 5;
							bullets[l].dir.x = 1;
							bullets[l].dir.y = 1;
							bullets[l].power = 5;
							bullets[l].speed = space_ship.weapon.bullet.speed;
							for (m = l; m <= bullets.length - 1; m++) {
								if (!bullets[m].exists) {
									bullets[m].exists = true;	
									bullets[m].rect.x = space_ship.rect.x + space_ship.rect.width;
									bullets[m].rect.y = space_ship.rect.y + space_ship.rect.height / 2;
									bullets[m].rect.width = 5;
									bullets[m].rect.height = 5;
									bullets[m].dir.x = 1;
									bullets[m].dir.y = -1;
									bullets[m].power = 5;
									bullets[m].speed = space_ship.weapon.bullet.speed;
									break;
								}
							}
							break;
						}
					}
				}
				break;
			}
		}
	}
}

powup_activ = function() {
	switch (eligible_powup) {
		case 0:
			space_ship.speed += 0.05;
			break;
		case 1:
			space_ship.missile = true;
			break;
		case 2:
			space_ship.laser = true;
			break;
		case 3:
			space_ship.ripple = true;
			space_ship.weapon.power = 3;
			break;
		case 4:
			space_ship.force = true;
			break;
		default:
			
	}
	eligible_powup = -1;
}

powup_choice_render = function() {
	ctx.font = "30 px Verdana";
	ctx.fillStyle = "#FFFFFF";
	var powup_name;
	switch (eligible_powup) {
		case 0:
			powup_name = "Speed";
			break;
		case 1:
			powup_name = "Missile";
			break;
		case 2:
			powup_name = "Laser";
			break;
		case 3:
			powup_name = "Ripple";
			break;
		case 4:
			powup_name = "Force";
			break;
		default:
			powup_name = "";
			break;
	}
	ctx.fillText(powup_name, 125, ctx.height - 75);
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(eligible_powup * 25, ctx.height - 75, 20, 5);
}

life_lost = function() {
	if (lives > 1) {
		lives--;
		space_ship.invulnerability = true;
		space_ship.invulnerability_timer = MAX_INVULNERABILITY;
		space_ship.force = false;
		space_ship.missile = false;
		space_ship.laser = false;
		eligible_powup = 0;
		if (vertical_oriented) {
			space_ship.rect.x = 0;
			space_ship.rect.y = HEIGHT / 2 - space_ship.rect.height / 2;
			//later...
		} else {
			space_ship.rect.x = pos_on_map;
			space_ship.rect.y = HEIGHT / 2 - space_ship.rect.height / 2;
		}
	} else {
		in_play = false;
		ctx.font = "30px Arial";
		ctx.fillText("Game Over", WIDTH / 2, HEIGHT / 2);
	}
}

reset_bullet = function(bullet) {
	bullet.rect = {x: -1, y: -1, width: 0, height: 0};
	bullet.dir = {x: 0, y: 0};
	bullet.exists = false;
	bullet.power = 0;
	bullet.speed = 0;
	bullet.friend_bul = false;
}

keyPress = function(e) {
	switch (e.keyCode) {
		case 37 :
			arrow.left = true;
			break;
		case 38 :
			arrow.up = true;
			break;
		case 39 :
			arrow.right = true;
			break;
		case 40 :
			arrow.down = true;
			break;
		case 32 :
			playerShoot();
			break;
		case 13 :
			powup_activ();
			break;
	}
}

keyRelease = function(e) {
	switch (e.keyCode) {
		case 37 :
			arrow.left = false;
			break;
		case 38 :
			arrow.up = false;
			break;
		case 39 :
			arrow.right = false;
			break;
		case 40 :
			arrow.down = false;
			break;
	}
}

window.onload = init;
