const LVL_MAX = 1;
const PRIMARY_AXE_LEN = 10000;
const SECONDARY_AXE_LEN = 500000;
const SCROLLING_SPEED = 4;
const WIDTH = 800;
const HEIGHT = 600;
const SPEED = 0.25;

var ctx = null;

var score;
var lives;
var level;
var vertical_oriented;
var eligible_powup;
var lvl_size = [];
var current_map_progression;

var dt;
var old = Date.now();
var delta;

var arrow = {up: false, right: false, down: false, left: false};

var rect = {x: 0, y: 0, width: 0, height: 0};
var powups = [];
var bullet = {rect: {}, exists: false, power: 0, speed: 0, friend_bul: false};
var bullets = [];
var weapon = {until_shot: 0, delay: 0, bullet: {}};
var foe = {rect: {}, type: ' ', shooting: false, weapon: {}, has_powup: false, speed: 0, hp: 0, earned_points: 0};
var foes = [[]];
var space_ship = {rect: {}, speed: 0, weapon: {}, lvl_weapon: 0, missile: false, laser: false, force: false, invulnerability: false, invulnerability_timer: 0};
var wall = {rect: {}, type: ' ', destroyable: false};
var walls = [[]];

init = function() {
    ctx = document.getElementById("cvs").getContext("2d");
    ctx.width = document.getElementById("cvs").width;
    ctx.height = document.getElementById("cvs").height;
	
	
	document.addEventListener("keydown", keyPress);
	document.addEventListener("keyup", keyRelease);

	level = 1;
	
	for (i = 0; i <= 29; i++) {
		bullet = {rect: {x: 0, y: 0, width: 5, height: 5}, exists: false, power: 0, speed: 0, friend_bul: false};
		bullets[i] = bullet;
	}
	space_ship.rect = {x: 0, y: ctx.height / 2, width: 40, height: 20};
	space_ship.weapon = {until_shot: 0, delay: 30, bullet: {rect:{}, exists: false, power: 1, speed: 0.20, friend_bul: true}};
	game();
}

game = function() {
	update(Date.now());
	render();
	requestAnimationFrame(game);
}

update = function(d) {
	dt = d - old;
	old = d;
	delta = dt * SPEED;
	
	if (arrow.right) {
		space_ship.rect.x += delta;
		if (space_ship.rect.x + space_ship.rect.width >= WIDTH) {
			space_ship.rect.x = WIDTH - space_ship.rect.width;
		}
	}
	if (arrow.left) {
		space_ship.rect.x -= delta;
		if (space_ship.rect.x <= 0) {
			space_ship.rect.x = 0;
		}
	}
	if (arrow.down) {
		space_ship.rect.y += delta;
		if (space_ship.rect.y + space_ship.rect.height >= HEIGHT) {
			space_ship.rect.y = HEIGHT - space_ship.rect.height;
		}
	}
	if (arrow.up) {
		space_ship.rect.y -= delta;
		if (space_ship.rect.y <= 0) {
			space_ship.rect.y = 0;
		}
	}
	
	if (space_ship.weapon.until_shot > 0) {
		space_ship.weapon.until_shot--;
	}
	
	for (i = 0; i <= bullets.length - 1; i++) {
		if (bullets[i].exists) {
			if (bullets[i].friend_bul) {
				bullets[i].rect.x += delta / SPEED * bullets[i].speed;
			} else {
				bullets[i].rect.x -= delta / SPEED * bullets[i].speed;
			}
			
			if (bullets[i].rect.x >= WIDTH || bullets[i].rect.x <= - bullets[i].rect.width) {
				bullets[i].exists = false;
			}
		}
	}
	
	for(i = 0; i <= foes[level - 1].length - 1; i++) {
		if (collides(space_ship, foes[level - 1][i]) {
			lives--;
			space_ship.rect.x = 0;
			space_ship.rect.y = HEIGHT / 2 - space_ship.rect.height / 2;
		}
	}
}

render = function() {
	ctx.clearRect(0, 0, ctx.width, ctx.height);
	ctx.fillStyle = "#FF0000";
	rectFill(space_ship);
	ctx.fillStyle = "#FFFF00";
	for (i = 0; i <= bullets.length - 1; i++) {
		if (bullets[i].exists) {
			if (bullets[i].friend_bul) {
				rectFill(bullets[i]);
			}
		}
	}
}

collides (rectA, rectB) {
	return ((b.rect.x + b.rect.largeur >= a.rect.x && b.rect.x <= a.rect.x + a.rect.largeur) || (b.rect.x <= a.rect.x + a.rect.largeur && b.rect.x + b.rect.largeur >= a.rect.x ) && ((b.rect.y + b.rect.hauteur >= a.rect.y) && (b.rect.y <= a.rect.y + a.rect.hauteur ) || (b.rect.y <= a.rect.y + a.rect.hauteur) && (b.rect.y + b.rect.hauteur >= a.rect.y)));
}

rectFill = function(a) {
	ctx.fillRect(a.rect.x, a.rect.y, a.rect.width, a.rect.height);
}

playerShoot = function() {
	if (space_ship.weapon.until_shot == 0) {
		space_ship.weapon.until_shot = space_ship.weapon.delay;
		for (i = 0; i <= bullets.length - 1; i++) {
			if (!bullets[i].exists) {
				bullets[i].exists = true;
				bullets[i].rect.x = space_ship.rect.x + space_ship.rect.width;
				bullets[i].rect.y = space_ship.rect.y + space_ship.rect.height / 2;
				bullets[i].friend_bul = true;
				bullets[i].power = space_ship.weapon.bullet.power;
				bullets[i].speed = space_ship.weapon.bullet.speed;
				break;
			}
		}
	}
}

keyPress = function(e) {
	switch (e.keyCode) {
		case 37 :
			console.log("yay");
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
