const LVL_MAX = 1;
const PRIMARY_AXE_LEN = 42;
const SECONDARY_AXE_LEN = 42;
const SCROLLING_SPEED = 42;
const WIDTH = 42;
const HEIGHT = 42;

var score;
var lives;
var level;
var level_orientation;
var eligible_power_up;
var lvl_size = [];
var current_map_progression;

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
	for (i = 0; i <= 29; i++) {
		bullet = {rect: {}, exists: false, power: 0, speed: 0, friend_bul: false};
		bullets[i] = bullet;
	}
}

window.onload = init;
