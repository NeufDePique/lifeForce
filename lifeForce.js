const LVL_MAX = 1;
const PRIMARY_AXE_LEN = 10000;
const SECONDARY_AXE_LEN = 500000;
const SCROLLING_SPEED = 4;
const WIDTH = 800;
const HEIGHT = 600;

var ctx = null;

var score;
var lives;
var level;
var level_orientation;
var eligible_power_up;
var lvl_size = [];
var current_map_progression;

var arrows = {up: false, right: false, down: false, left: false};

var rect = {x: 0, y: 0, width: 0, height: 0};
var power_ups = [];
var bullet = {rect: {}, exists: false, power: 0, speed: 0, friend_bul: false};
var bullets = [];
var weapon = {until_shot: 0, delay: 0, bullet: 0};
var foe = {rect: {}, type: ' ', shooting: false, weapon: 0, has_power_up: false, speed: 0, hp: 0, earned_points: 0};
var foes = [[]];
var space_ship = {rect: {}, speed: 0, weapon: {}, lvl_weapon: 0, missile: false, laser: false, force: false, invulnerability: false, invulnerability_timer: 0};
var wall = {rect: {}, type: ' ', destroyable: false};
var walls = [[]];



init = function() {
    ctx = document.getElementById("cvs").getContext("2d");
    ctx.width = document.getElementById("cvs").width;
    ctx.height = document.getElementById("cvs").height;
	for (i = 0; i <= 29; i++) {
		bullet = {rect: {}, exists: false, power: 0, speed: 0, friend_bul: false};
		bullets[i] = bullet;
	}
	space_ship.rect = {x: 0, y: ctx.height / 2, width: 40, height: 20};
	game();
}

game = function() {
	update(Date.now());
	render();
}

update = function(d) {
	
}

render = function() {
	ctx.clearRect(0, 0, ctx.width, ctx.height);
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(space_ship.rect.x, space_ship.rect.y, space_ship.rect.width, space_ship.rect.height);
}

window.onload = init;
