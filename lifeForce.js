const LVL_MAX = 1;
const PRIMARY_AXIS_LEN = 700;
const SECONDARY_AXIS_LEN = 500;
const SCROLLING_SPEED = 0.12;
const POWUP_CHOICE = 5;
const MAX_INVULNERABILITY = 60;
const SPACESHIP_SPEED_LIMIT = 0.5;
const UNIT_MAP = 20;


var ctx = null;
var cvs = null;

var score;
var lives;
var pos_on_map = 0;
var unit_vector = [0,0];
var in_play;
var level;
var vertical_oriented;
var eligible_powup;
var lvl_size = [];
var width;
var height;

var dt;
var old;
var delta;
var delta_scrolling;

var arrow = {up: false, right: false, down: false, left: false};
var shoot = false;

var rect = {x: -1, y: -1, width: 0, height: 0};
var dir = {x: 0, y: 0};
var powups = [];
var bullet = {rect: {}, dir: {}, exists: false, power: 0, speed: 0, friend_bul: false, sprite: ""};
var bullets = [];
var weapon = {until_shot: 0, delay: 0, bullet: {}};
var foe = {rect: {}, type: ' ', shooting: false, weapon: {}, has_powup: false, speed: 0, hp: 0, earned_points: 0, sprite: ""};
var foes = [[]];
var space_ship = {rect: {}, speed: 0, weapon: {}, lvl_weapon: 0, missile: false, ripple: false, laser: false, force: false, invulnerability: false, invulnerability_timer: 0, sprite: ""};
var wall = {rect: {}, type: ' ', destroyable: false, sprite: "", destroyed: false};
var walls = [[]];
var min_wall_on_screen_index = [];
var lvl_maps = [];
var victory = false;

init = function() {
	
	cvs = document.getElementById("cvs");
    ctx = cvs.getContext("2d");
	
	in_play = false;
	lives = 5;
	eligible_powup = -1;
	vertical_oriented = false;
	orient_update(vertical_oriented);
	
	lvl_maps.push(
	["----------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
	 "-----------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWW----------------------WWWWWWWWWWWWWWWWWWWWWWW------------------------------------------WWWWWWWWWWWWWWWWWWW-----------WWWWWWWWWWW-------------WWWWWWWWWWWWWWWWWW-WWWWWWWWWWWWWWWW----------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------w---------w-------w----w--------w-------w-------w-----w--------w-----ww-----w-----------------------n----------n--------n----------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWW-----------------------WWWWWWWWWWWWWWWWWWWWW--------------------------------------------WWWWWWWWWWWWWWWWW------------WWWWWWWWWWW-------------WWWWWWWWWWWWWWWWWW--WWWWWWWWWWWWWW---------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-------------m------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB--------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------WWWWWWWWWWWWWWWWWWWWW----------------------------------------WWWWWWWWWWWWWTWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW---------------------w---------w-----w----w---------w-------s------w-----w---------w---ss--w---s-----------------------------m---------m---------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW-------------------------WWWWWWWWWWWWWWWWWWW----------------------------------------------WWWWWWWWWWWWWWW--------------WWWWWWWWW---------------WWWWWWWWWWWWWWWW----WWWWWWWWWWWW---------------m---------------------------------------------------------------------------m-----------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB------------------------C---------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------------------------BBBBBBBBBBBBBBBBBBBBB--------------------WWWWWWWWWWWWWWWWWWWW------------------------------------------WWWWWWWWWWWWWWWWWWWW---WWWWWWWWWWWWWWWWW---------------------WWWWWWWWWWWWWWWWWWWWWWWWWWTWWWWWWWWWWWW----------------------w----------w-www----w----------w--------w------w-----w-------s---w-----wws--------------------------------------------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW---------------------------WWWWWWWWWWWWWWW-------------------------------------------------WWWWWWWWWWWWW---------------WWWWWWWWW----------------WWWWWWWWWWWWWW------WWWWWWWWWW--------------------------------------------------------------------------------------------M------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------------------c-------c----------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW--------------------------------------------WWWWWWWWWWWWWWWWWW----WWWWWWWWWWWWWWW---m-------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------w----------w-------w-----------w--------www--w-------sw-wwwwww-w-----w-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW-----------------------------WWWWWWWWWWW----------------------------------------------------WWWWWWWWWWW-----------------WWWWWWW-----------------WWWWWWWWWWWWWW------WWWWWWWWWW--------------------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------------------------------------------c---------------c-------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWW----------------------------------------------WWWWWWWWWWWWWWWW------WWWWWWWWWWWWW-------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------w-------www-------w-------------w-------s--s--------w--w------w-----w------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWW-----------------------------------m----------------------------------------------------------------------------------------------------M---------WWWWWWWWWWWW--------WWWWWWWW---------------------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWW------------------------------------------------WWWWWWWWWWWWWW--------WWWWWWTWWWW-------------------------------------C-------------------------------------------------w----ww---wwwwwww---------------w-----s----w---wwww----w----s-----sw------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "--------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWW-----------------------------------m-------------------------WWWWWWWW-------------------------------------------------------------------------------WWWWWWWWWW---------WWWWWWWW---------------------------------------------------------------------------------------------m--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWW--------------------------------------------------WWWWWWWWWWWW----------WWWWWWWWW-----------------------------------------------------------------------------------------wwww------w-----w---------------w---w------s-w-------w----s-----w--------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "---------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWW-------------------------------------M-----------------------WWWWWWWWWW-------------------------------------------------------------------------------WWWWWWWW-----------WWWWWW----------------------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBB--------------WWWWWWWWWWW----------------------------------------------------WWWWWWWWWW------------WWWWWWW-----------------------------------------------------------------------------------------w-------w-------w-----------------s-w--------w-------s----w-----s---------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------WWWWWWWWWW-------------------------------------m-----------------------WWWWWWWWWWW---------------------------------------------------------------------------------------------------WWWW--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------N----------N----------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------WWWWWWWWWW-----------------------------------------------------WWWWWWWW--------------WWWWW-----------------------------------------------------------------------------------------w-------w---------w-----------------w--------s-s------wwww------s-w--------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------f-f-f-f-f-F---------------f-f-f-f-f-F-------------------f-f-f-f-f-F-----------------------WWWWWWWW---------------------------------------m---------------------WWWWWWWWWWWWWW--------------------------------------------------------------------------------------------------m--------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBB-------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------BBBBBBBBBBBBBBBBBBBB----------------------BBBBBBBBBBBBBBBBBBBBBBBBBBB--------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBB----------WWWWWWWW---------------------------------------------------------WWW-----------------WWW-------------------------------------------------------------------------------------------w-----w-----------w-----------------s------w-w--------s--------w--w-------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------b-----------------W",
	 "---------------------------------------------------------------------------------------------------------------------------------------------------------------------------M---------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------------------------M-------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------------------------------------BB-------------BBBBBBBBB-------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW-----------------------------------------------------------------wwwww-----------w-----------------w-w----s---w--------sw-----w----w------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------------------m------------------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBB-----------------------BBBBBBBBBBBBBBBBBB-----------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB--------------------------------------------------------------m------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWW---------------------------------------------------------------w-----w---------w-----------------w---s--w-----s---------w---w------s-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------m---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------n-----------n----------------------------------------------------------------------M---------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------------w-------w-------w------------------w---w-w-----ww---------w--w--------w----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------f-f-f-f-f-F---------------f-f-f-f-f-F------f-f-f-f-f-F---------------------------------------WWWWWWWWW--------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------m-------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------WWWWWWWWWWWWWWWWWWWWWWWWTWWWWWWWW---------------------------------------------------------w---------wwwwwwww-----------------s-----w-----w--w---------sw--------s-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "--------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWW--------------------------------------------------------WWWWWWWWWWWWWWWWWW---------------------------------------------------------------------------------m--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------m------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------------------w---------w--------w----------------s------s----s---w---------w--------w-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWW------------------WWWWWW--------------------------------WWWWWWWWWWWWWWWW----------------------------------------------------------------------------------M-------------------------------------------------------------------------------------------------m------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------m-----------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------w-------ww---------w--------------w-------w---w-----wsw------w-------w------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWW----------------WWWWWWWW-------------------------------WWWWWWWWWWWWWWWW----------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------m-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------w-----w--w---------w------------w---------w-w-----w---w----s-w----ws-------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWW---------------WWWWWWWWWW-------------------------------WWWWWWWWWWWWWW-----------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------m----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------------------------wwwwww----w--------w------------w----------w------w----w--s---s--w---------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWW--------------WWWWWWWWWW--------------------------------WWWWWWWWWWWW-----------------------------------------------------------------------------------WWWWW----------------------------------------------------------------------------------------------m------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW---m-----------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------------------------------------------w---w--w--w--------w------------w-----------w-----w------ww-----s-s---------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWW------------WWWWWWWWWWWWWW----------------------------------------------------------------------------------------------------------------------------WWWWWWW-----------------m---------------------------------------------------------------------------M----------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------------c--------------c----------------------BBBBBBBBBBBBBBBBBBBBBB--------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----C--------------------------------------www-----ww-ww--------w-ww---------w-------------w---w---------w---s-w-w--------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWW-----------WWWWWWWWWWWWWW-----------------------------------------------------WWWWWWWW--------------------------------------------------------------WWWWWWWWW--------------------------------------------------------------------------------------------m-------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------c-------c-------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------w---w----w----w------w----w--------s--------------sww-----------sww-w---w-------------------------------------------------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWW----------WWWWWWWWWWWWWWWW---------------------------------------------------WWWWWWWWWW------------------------------------------------------------WWWWWWWWWWW-----------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------m-----------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------C-------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWTWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWTWWWWWWWWWWWWW----------------w----w--w-w---------w------w------w---------------w---------------s--w---w----------------------------------m---------m---------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWW---------WWWWWWWWWWWWWWWWWW-------------------------------------------------WWWWWWWWWWWW----------------------------------------------------------WWWWWWWWWWWWW---------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------m---------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------w-----www---ww------w--------w----w-----------------w--------------w---w---w-----------------------------N---------N--------N----------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "---------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"]);
	
	document.addEventListener("keydown", keyPress);
	document.addEventListener("keyup", keyRelease);

	level = 0;
	
	lvl_create();
	
	for (var i = 0; i <= 49; i++) {
		bullet = {rect: {x: 0, y: 0, width: 5, height: 5},dir: {x: -1, y: 0}, exists: false, power: 0, speed: 0, friend_bul: false};
		bullets[i] = bullet;
	}
	
	for (var i = 0; i <= 19; i++) {
		powup = {rect: {x: 0, y: 0, height: 10, width: 10}, exists: false};
		powups[i] = powup;
	}
	
	space_ship.rect = {x: (width / 2 - 20) * - unit_vector[1] + 20 * unit_vector[0], y: (height / 2 - 10) * unit_vector[0] + (height - 40) * - unit_vector[1] , width: 40, height: 20};
	space_ship.speed = 0.25;
	space_ship.weapon = {until_shot: 0, delay: 15, bullet: {rect:{}, exists: false, power: 1, speed: 0.60, friend_bul: true}};
	var img = new Image();
	img.src = "img/space_ship_" + unit_vector[0] + ".png";
	space_ship.sprite = img;
	
	menu();
}

menu = function() {
	ctx.font = "30px Arial";
	ctx.fillStyle = "#FF0000";
	ctx.fillText("Press enter to start a new game", width / 2 - 100, height / 2);
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
	delta_scrolling = dt * SCROLLING_SPEED;
	
	pos_on_map += delta_scrolling;
	
	if (shoot) {
		playerShoot();
	}
	
	spaceShipMove(space_ship, arrow, delta, unit_vector);
	
	if (space_ship.weapon.until_shot > 0) {
		space_ship.weapon.until_shot--;
	}

	bulletsMove(bullets, delta_scrolling, dt, unit_vector);
	
	foesUpdate(foes[level], powups, space_ship, dt, unit_vector);
	
	for (var i = 0; i <= powups.length - 1; i++) {
		if (collides(space_ship, powups[i]) && powups[i].exists) {
			powups[i].exists = false;
			eligible_powup++;
			eligible_powup %= POWUP_CHOICE;
		}
	}
	
	if (collidesWall(space_ship, bullets, walls) && !space_ship.invulnerability) {
		life_lost();
	}

	if (space_ship.invulnerability_timer > 0) {
		space_ship.invulnerability_timer--;
	}
	
	if (space_ship.invulnerability_timer == 0) {
		space_ship.invulnerability = false;
	}
	
}

spaceShipMove = function(space_ship, arrow, delta, unit_vector) {
	space_ship.rect.x += delta_scrolling * unit_vector[0];
	space_ship.rect.y += delta_scrolling * unit_vector[1];
	
	if (arrow.right) {
		space_ship.rect.x += delta;
		if (space_ship.rect.x + space_ship.rect.width - pos_on_map * unit_vector[0] >= width) {
			space_ship.rect.x = width - space_ship.rect.width + pos_on_map * unit_vector[0];
		}
	}
	if (arrow.left) {
		space_ship.rect.x -= delta;
		if (space_ship.rect.x - pos_on_map * unit_vector[0] <= 0) {
			space_ship.rect.x = pos_on_map * unit_vector[0];
		}
	}
	if (arrow.down) {
		space_ship.rect.y += delta;
		if (space_ship.rect.y + space_ship.rect.height - pos_on_map * unit_vector[1] >= height) {
			space_ship.rect.y = height - space_ship.rect.height + pos_on_map * unit_vector[1];
		}
	}
	if (arrow.up) {
		space_ship.rect.y -= delta;
		if (space_ship.rect.y - pos_on_map * unit_vector[1] <= 0) {
			space_ship.rect.y = pos_on_map * unit_vector[1];
		}
	}
}

bulletsMove = function(bullets, delta_scrolling, dt, unit_vector) {
		for (var i = 0; i <= bullets.length - 1; i++) {
		if (bullets[i].exists) {
			bullets[i].rect.x += bullets[i].dir.x * (dt * bullets[i].speed) + delta_scrolling * unit_vector[0];
			bullets[i].rect.y += bullets[i].dir.y * (dt * bullets[i].speed) + delta_scrolling * unit_vector[1];
			if (bullets[i].friend_bul && space_ship.ripple) {
				bullets[i].rect.height += dt * bullets[i].speed * 0.1;
				bullets[i].rect.x -= dt * bullets[i].speed * 0.05 * unit_vector[0];
				bullets[i].rect.y -= dt * bullets[i].speed * 0.05 * unit_vector[1];
			}
			if (!entity_on_screen(bullets[i])) {
				reset_bullet(bullets[i]);
			} 
		}
	}
}

foesUpdate = function(foes, powups, space_ship, dt, unit_vector) {
	for (var i = 0; i <= foes.length - 1; i++) {
		if (foes[i].hp > 0 && entity_on_screen(foes[i])) { 
			switch (foes[i].type.toLowerCase()) {
				case 'c': {
					foes[i].rect.x -= dt * foes[i].speed;
					if (foeCollidesWall(foes[i], walls)) {
						foes[i].rect.x += dt * foes[i].speed;
						foes[i].rect.y += foes[i].rect.y >= HEIGHT / 2 ? dt * foes[i].speed : - dt * foes[i].speed;   
					}
				} break;
			}

			for (var j = 0; j <= bullets.length - 1; j++) {
				if (collides(bullets[j], foes[i]) && bullets[j].friend_bul) {
					foes[i].hp -= bullets[j].power;
					reset_bullet(bullets[j]);
					if (foes[i].has_powup && foes[i].hp <= 0) {
						for (var k = 0; k <= powups.length - 1; k++) {
							if (!powups[k].exists) {
								powups[k].exists = true;
								powups[k].rect.x = foes[i].rect.x;
								powups[k].rect.y = foes[i].rect.y;
								break;
							}
						}
					}
				}
			}
			
			if (!(space_ship.invulnerability) && collides(space_ship, foes[i])) {
				if (space_ship.force) {
					space_ship.force = false;
					space_ship.rect.x = foes[i].rect.x - space_ship.rect.width - 5;
				} else {
					life_lost()
				}
			}
		}
		
		if (foes[i].hp <= 0 && foes[i].type == 'b') {
			in_play = false;
			victory = true;
			break;
		}
	}
}

render = function() {
	ctx.clearRect(0, 0, ctx.width, ctx.height);
	
	for (var i = 0; i <= bullets.length - 1; i++) {
		if (bullets[i].exists) {
			if (bullets[i].friend_bul) {
				if (bullets[i].dir.y != 0) {
					ctx.fillStyle = "#0000FF";
				} else {
					ctx.fillStyle = "#FF0000";
				}
			}
			rectFill(bullets[i]);
		}
	}
	
	for (var i = 0; i <= powups.length - 1; i++) {
		ctx.fillStyle = "#f49e42";
		if (powups[i].exists) {
			rectFill(powups[i]);
		}
	}
	
	for (i = 0; i <= foes[0].length - 1; i++) {
		if (foes[level][i].hp > 0  && entity_on_screen(foes[level][i])) {
			ctx.drawImage(foes[level][i].sprite, foes[level][i].rect.x - pos_on_map * unit_vector[0], foes[level][i].rect.y - pos_on_map * unit_vector[1], foes[level][i].rect.width, foes[level][i].rect.height);
		}
	}
	
	for (var i = 0; i <= walls[level].length - 1; i++) {
		for (var j = min_wall_on_screen_index[i]; j <= walls[level][i].length - 1; j++) {
			if (!entity_on_screen(walls[level][i][j])) { 
				break;
			}
			
			/* if (!walls[level][i][j].destroyed) {
				switch (walls[level][i][j].type) {
					case 'w': {
						ctx.fillStyle = "#d854a1";
						rectFill(walls[level][i][j]);
					} break;
					case 'W': {
						ctx.fillStyle = "#f49e42";
						rectFill(walls[level][i][j]);
					} break;
					case 'B': {
						ctx.fillStyle = "#f49e42";
						rectFill(walls[level][i][j]);
					} break;
					default: {
						ctx.fillStyle = "#FFFFFF";
					}
				}
			} */
			
			if (!walls[level][i][j].destroyed) {
				ctx.drawImage(walls[level][i][j].sprite, walls[level][i][j].rect.x - pos_on_map * unit_vector[0], walls[level][i][j].rect.y - pos_on_map * unit_vector[1], walls[level][i][j].rect.width, walls[level][i][j].rect.height);
			}
		}	
	}
	
	if (space_ship.invulnerability && (space_ship.invulnerability_timer % 4 == 1 || space_ship.invulnerability_timer % 4 == 2)) {
		ctx.fillStyle = "#FFFFFF";
		rectFill(space_ship);
	} else {
		ctx.drawImage(space_ship.sprite, space_ship.rect.x - pos_on_map * unit_vector[0], space_ship.rect.y - pos_on_map * unit_vector[1], space_ship.rect.width, space_ship.rect.height);
	}
	
	if (space_ship.force) {
		ctx.strokeStyle = "#42ebf4"
		ctx.strokeRect(space_ship.rect.x, space_ship.rect.y, space_ship.rect.width, space_ship.rect.height);
	}
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, height, width, 100);
	
	powup_choice_render();
	ctx.strokeStyle = "#FFFFFF";
	for (i = 0; i <= POWUP_CHOICE - 1; i++) {
		ctx.strokeRect(i * 25, ctx.height - 75, 20, 5);
	}
	
	if (!in_play && !victory) {
		ctx.font = "30px Arial";
		ctx.fillText("Game Over, you lose !", width / 2 - 100, height / 2);
	}
	
	if (victory) {
		ctx.font = "30px Arial";
		ctx.fillText("Congratulations, you won !", width / 2 - 100, height / 2);
	}
}

lvl_create = function() {
	for (var i = 0; i <= lvl_maps[level].length - 1; i++) {
		min_wall_on_screen_index.push(0);
		walls[level].push([]);
		for (var j = 0; j <= lvl_maps[level][i].length - 1; j++) {
			if ("WwB".indexOf(lvl_maps[level][i].charAt(j)) > -1) {
				wall = {rect: {x: j * UNIT_MAP, y: i * UNIT_MAP, width: UNIT_MAP, height: UNIT_MAP}, type: lvl_maps[level][i].charAt(j)};
				wall.destroyable = (lvl_maps[level][i].charAt(j).toLowerCase() === lvl_maps[level][i].charAt(j));
				var img = new Image();
				if (wall.destroyable) {
					img.src = "img/wall_" + wall.type + ".png";
				} else {
					img.src = "img/wall" + wall.type + ".png";
				}
				wall.sprite = img;
				wall.destroyed = false;
				walls[level][i].push(wall);
			
			} else if ("fFcCmnNsTb".indexOf(lvl_maps[level][i].charAt(j)) > -1) {
				foe = {rect: {x: j * UNIT_MAP, y: i * UNIT_MAP, width: UNIT_MAP, height: UNIT_MAP}, type: lvl_maps[level][i].charAt(j)};
				foe.has_powup = !(lvl_maps[level][i].charAt(j).toLowerCase() === lvl_maps[level][i].charAt(j));
				foe.hp = foe.has_powup ? 3 : 1;
				foe.speed = 0.25;
				foe.earned_points = 10;
				var img = new Image();
				if (foe.has_powup) {
					img.src = "img/foe" + foe.type + ".png";
				} else {
					img.src = "img/foe_" + foe.type + ".png";
				}
				foe.sprite = img;
				foes[level].push(foe);
				
			}
		}
	}
}

collides = function(a, b) {
	return a.rect.x < b.rect.x + b.rect.width && a.rect.x + a.rect.width > b.rect.x && a.rect.y < b.rect.y + b.rect.height && a.rect.height + a.rect.y > b.rect.y;
}

collidesWall = function(space_ship, bullets, walls) {
	var has_collided_space_ship = false;
	for (var i = 0; i <= walls[level].length - 1; i++) {
		while (pos_on_map > walls[level][i][min_wall_on_screen_index[i]].rect.x + walls[level][i][min_wall_on_screen_index[i]].rect.width) {
			min_wall_on_screen_index[i]++;
		}
		
		for (var j = min_wall_on_screen_index[i]; j <= walls[level][i].length - 1; j++) {
			if (!entity_on_screen(walls[level][i][j])) {
				break;
			}
			
			
			if (collides(space_ship, walls[level][i][j]) && !walls[level][i][j].destroyed) {
				has_collided_space_ship = true;
			}

			
			for (k = 0; k <= bullets.length - 1; k++) {
				if (bullets[k].exists && collides(bullets[k], walls[level][i][j]) && !walls[level][i][j].destroyed) {
					reset_bullet(bullets[k]);
					if (walls[level][i][j].destroyable) {
						walls[level][i][j].destroyed = true;
					}
				}
			}
		}
	}
	return has_collided_space_ship;
}

foeCollidesWall = function(foe, walls) {
	var has_collided = false;
	for (var i = 0; i <= walls[level].length - 1; i++) {
		while (pos_on_map > walls[level][i][min_wall_on_screen_index[i]].rect.x + walls[level][i][min_wall_on_screen_index[i]].rect.width) {
			min_wall_on_screen_index[i]++;
		}
		
		for (var j = min_wall_on_screen_index[i]; j <= walls[level][i].length - 1; j++) {
			if (!entity_on_screen(walls[level][i][j])) {
				break;
			}
			
			
			if (collides(foe, walls[level][i][j])) {
				has_collided = true;
			}
		}
	}
}
rectFill = function(a) {
	ctx.fillRect(a.rect.x - pos_on_map * unit_vector[0], a.rect.y - pos_on_map * unit_vector[1], a.rect.width, a.rect.height);
}

playerShoot = function() {
	var second_shot;
	
	if (space_ship.weapon.until_shot == 0) {
		space_ship.weapon.until_shot = space_ship.weapon.delay;
		for (var i = 0; i <= bullets.length - 1; i++) {
			if (!bullets[i].exists) {
				var j = i;
				var k = 0;
				while (((space_ship.laser && k <= 4) || k < 1) && j <= bullets.length - 1) {
					if (!bullets[j].exists) {
						bullets[j].exists = true;
						bullets[j].rect.x = space_ship.rect.x + (space_ship.rect.width / 2) * - unit_vector[1] + (space_ship.rect.width - k * 10) * unit_vector[0];
						bullets[j].rect.y = space_ship.rect.y + (space_ship.rect.height / 2) * unit_vector[0] + (space_ship.rect.height - k * 10) * - unit_vector[1];
						bullets[j].rect.width = 5;
						bullets[j].rect.height = 5;
						bullets[j].dir.x = unit_vector[0];
						bullets[j].dir.y = unit_vector[1];
						bullets[j].friend_bul = true;
						bullets[j].power = space_ship.weapon.bullet.power;
						bullets[j].speed = space_ship.weapon.bullet.speed;
						k++;
					}
					j++;
				}
				if (space_ship.missile) {
					second_shot = 0;
					for (var l = i; l <= bullets.length - 1; l++) {
						if (!bullets[l].exists) {
							bullets[l].exists = true;	
							bullets[l].rect.x = space_ship.rect.x + (space_ship.rect.width / 2) * - unit_vector[1] + (space_ship.rect.width) * unit_vector[0];
							bullets[l].rect.y = space_ship.rect.y + (space_ship.rect.height / 2) * unit_vector[0] + (space_ship.rect.height) * - unit_vector[1];
							bullets[l].rect.width = 5;
							bullets[l].rect.height = 5;
							bullets[l].dir.x = unit_vector[1] + unit_vector[0] - 2 * second_shot * unit_vector[1];
							bullets[l].dir.y = unit_vector[1] + unit_vector[0] - 2 * second_shot * unit_vector[0];
							bullets[l].friend_bul = true;
							bullets[l].power = space_ship.weapon.bullet.power;
							bullets[l].speed = space_ship.weapon.bullet.speed;
							second_shot += 1;
							if (second_shot == 2) {
								break;
							}
						}
					}
				}
				break;
			}
		}
	}
}

orient_update = function(vertical_oriented) {
	if (vertical_oriented) {
		unit_vector[0] = 0;
		unit_vector[1] = -1;
		width = SECONDARY_AXIS_LEN;
		height = PRIMARY_AXIS_LEN;
		cvs.width += width;
		cvs.height += height;
	} else {
		unit_vector[0] = 1;
		unit_vector[1] = 0;
		width = PRIMARY_AXIS_LEN;
		height = SECONDARY_AXIS_LEN;
		cvs.width += width;
		cvs.height += height;
	}
	ctx.width = cvs.width;
    ctx.height = cvs.height;
}

powup_activ = function() {
	switch (eligible_powup) {
		case 0:
			space_ship.speed += space_ship.speed < SPACESHIP_SPEED_LIMIT ? 0.05 : 0;
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
	ctx.font = "30px Verdana";
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
		space_ship.rect.x = (width / 2 - space_ship.rect.width / 2) * - unit_vector[1] + pos_on_map * unit_vector[0];
		space_ship.rect.y = (height / 2 - space_ship.rect.height / 2) * unit_vector[0] + (pos_on_map - height + space_ship.rect.height) * unit_vector[1];
	} else {
		in_play = false;
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

entity_on_screen = function (entity) {
	return (entity.rect.x + entity.rect.width >= pos_on_map * unit_vector[0] && entity.rect.x <= pos_on_map * unit_vector[0] + width && entity.rect.y >= pos_on_map * unit_vector[1] && entity.rect.y - height <= pos_on_map * unit_vector[1] + height);
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
			shoot = true;
			break;
		case 13 :
			if (!in_play) {
				in_play = true;
				old = Date.now()
				game();
			} else {
				powup_activ();
			}	
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
		case 32 :
			shoot = false;
	}
}

window.onload = init;