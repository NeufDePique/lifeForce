const LVL_MAX = 1;
const PRIMARY_AXIS_LEN = 700;
const SECONDARY_AXIS_LEN = 500;
const SCROLLING_SPEED = 0.15;
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
var old = Date.now();
var delta;
var delta_scrolling;

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
var min_wall_on_screen_index = [];
var lvl_maps = [];

init = function() {
	
	cvs = document.getElementById("cvs");
    ctx = cvs.getContext("2d");
	
	in_play = true;
	lives = 5;
	eligible_powup = -1;
	vertical_oriented = false;
	orient_update(vertical_oriented);
	
	lvl_maps.push(
	["----------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
	 "-----------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWW----------------------WWWWWWWWWWWWWWWWWWWWWWW------------------------------------------WWWWWWWWWWWWWWWWWWW-----------WWWWWWWWWWW-------------WWWWWWWWWWWWWWWWWW-WWWWWWWWWWWWWWWW----------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------w---------w-------w----w--------w-------w-------w-----w--------w-----ww-----w--------------------------------n----------n--------n----------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWW-----------------------WWWWWWWWWWWWWWWWWWWWW--------------------------------------------WWWWWWWWWWWWWWWWW------------WWWWWWWWWWW-------------WWWWWWWWWWWWWWWWWW--WWWWWWWWWWWWWW---------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-------------m------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB--------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------WWWWWWWWWWWWWWWWWWWWW----------------------------------------WWWWWWWWWWWWWTWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW---------------------w---------w-----w----w---------w-------s------w-----w---------w---ss--w---s--------------------------------------m---------m---------------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW-------------------------WWWWWWWWWWWWWWWWWWW----------------------------------------------WWWWWWWWWWWWWWW--------------WWWWWWWWW---------------WWWWWWWWWWWWWWWW----WWWWWWWWWWWW---------------m---------------------------------------------------------------------------m-----------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB------------------------C---------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------------------------BBBBBBBBBBBBBBBBBBBBB--------------------WWWWWWWWWWWWWWWWWWWW------------------------------------------WWWWWWWWWWWWWWWWWWWW---WWWWWWWWWWWWWWWWW---------------------WWWWWWWWWWWWWWWWWWWWWWWWWWTWWWWWWWWWWWW----------------------w----------w-www----w----------w--------w------w-----w-------s---w-----wws-----------------------------------------------------------------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW---------------------------WWWWWWWWWWWWWWW-------------------------------------------------WWWWWWWWWWWWW---------------WWWWWWWWW----------------WWWWWWWWWWWWWW------WWWWWWWWWW--------------------------------------------------------------------------------------------M------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------------------c-------c----------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW--------------------------------------------WWWWWWWWWWWWWWWWWW----WWWWWWWWWWWWWWW---m-------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------w----------w-------w-----------w--------www--w-------sw-wwwwww-w-----w-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW-----------------------------WWWWWWWWWWW----------------------------------------------------WWWWWWWWWWW-----------------WWWWWWW-----------------WWWWWWWWWWWWWW------WWWWWWWWWW--------------------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------------------------------------------c---------------c-------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWW----------------------------------------------WWWWWWWWWWWWWWWW------WWWWWWWWWWWWW-------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------w-------www-------w-------------w-------s--s--------w--w------w-----w------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWW-----------------------------------m----------------------------------------------------------------------------------------------------M---------WWWWWWWWWWWW--------WWWWWWWW---------------------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWW------------------------------------------------WWWWWWWWWWWWWW--------WWWWWWTWWWW-------------------------------------C-------------------------------------------------w----ww---wwwwwww---------------w-----s----w---wwww----w----s-----sw------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "--------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWW-----------------------------------m-------------------------WWWWWWWW-------------------------------------------------------------------------------WWWWWWWWWW---------WWWWWWWW---------------------------------------------------------------------------------------------m--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWW--------------------------------------------------WWWWWWWWWWWW----------WWWWWWWWW-----------------------------------------------------------------------------------------wwww------w-----w---------------w---w------s-w-------w----s-----w--------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "---------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWW-------------------------------------M-----------------------WWWWWWWWWW-------------------------------------------------------------------------------WWWWWWWW-----------WWWWWW----------------------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBB--------------WWWWWWWWWWW----------------------------------------------------WWWWWWWWWW------------WWWWWWW-----------------------------------------------------------------------------------------w-------w-------w-----------------s-w--------w-------s----w-----s---------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------WWWWWWWWWW-------------------------------------m-----------------------WWWWWWWWWWW---------------------------------------------------------------------------------------------------WWWW--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------n----------n----------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------WWWWWWWWWW-----------------------------------------------------WWWWWWWW--------------WWWWW-----------------------------------------------------------------------------------------w-------w---------w-----------------w--------s-s------wwww------s-w--------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------f-f-f-f-f-F---------------f-f-f-f-f-F-------------------f-f-f-f-f-F-----------------------WWWWWWWW---------------------------------------m---------------------WWWWWWWWWWWWWW--------------------------------------------------------------------------------------------------m--------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBB-------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------BBBBBBBBBBBBBBBBBBBB----------------------BBBBBBBBBBBBBBBBBBBBBBBBBBB--------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBB----------WWWWWWWW---------------------------------------------------------WWW-----------------WWW-------------------------------------------------------------------------------------------w-----w-----------w-----------------s------w-w--------s--------w--w-------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "---------------------------------------------------------------------------------------------------------------------------------------------------------------------------M---------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------------------------M-------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------------------------------------BB-------------BBBBBBBBB-------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW-----------------------------------------------------------------wwwww-----------w-----------------w-w----s---w--------sw-----w----w------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------------------m------------------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBB-----------------------BBBBBBBBBBBBBBBBBB-----------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB--------------------------------------------------------------m------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWW---------------------------------------------------------------w-----w---------w-----------------w---s--w-----s---------w---w------s-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------m---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------n-----------n----------------------------------------------------------------------M---------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------------w-------w-------w------------------w---w-w-----ww---------w--w--------w----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------f-f-f-f-f-F---------------f-f-f-f-f-F------f-f-f-f-f-F---------------------------------------WWWWWWWWW--------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------m-------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------WWWWWWWWWWWWWWWWWWWWWWWWTWWWWWWWW---------------------------------------------------------w---------wwwwwwww-----------------s-----w-----w--w---------sw--------s-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "--------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWW--------------------------------------------------------WWWWWWWWWWWWWWWWWW---------------------------------------------------------------------------------m--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------m------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------------------w---------w--------w----------------s------s----s---w---------w--------w-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWW------------------WWWWWW--------------------------------WWWWWWWWWWWWWWWW----------------------------------------------------------------------------------M-------------------------------------------------------------------------------------------------m------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------m-----------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------w-------ww---------w--------------w-------w---w-----wsw------w-------w------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWW----------------WWWWWWWW-------------------------------WWWWWWWWWWWWWWWW----------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------m-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------w-----w--w---------w------------w---------w-w-----w---w----s-w----ws-------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWW---------------WWWWWWWWWW-------------------------------WWWWWWWWWWWWWW-----------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------m----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------------------------wwwwww----w--------w------------w----------w------w----w--s---s--w---------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWW--------------WWWWWWWWWW--------------------------------WWWWWWWWWWWW-----------------------------------------------------------------------------------WWWWW----------------------------------------------------------------------------------------------m------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW---m-----------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------------------------------------------w---w--w--w--------w------------w-----------w-----w------ww-----s-s---------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWW------------WWWWWWWWWWWWWW----------------------------------------------------------------------------------------------------------------------------WWWWWWW-----------------m---------------------------------------------------------------------------M----------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------------c--------------c----------------------BBBBBBBBBBBBBBBBBBBBBB--------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----C--------------------------------------www-----ww-ww--------w-ww---------w-------------w---w---------w---s-w-w--------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWW-----------WWWWWWWWWWWWWW-----------------------------------------------------WWWWWWWW--------------------------------------------------------------WWWWWWWWW--------------------------------------------------------------------------------------------m-------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------c-------c-------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------w---w----w----w------w----w--------s--------------sww-----------sww-w---w----------------------------------------------------------------------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWW----------WWWWWWWWWWWWWWWW---------------------------------------------------WWWWWWWWWW------------------------------------------------------------WWWWWWWWWWW-----------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------m-----------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------C-------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWTWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWTWWWWWWWWWWWWW----------------w----w--w-w---------w------w------w---------------w---------------s--w---w-------------------------------------------m---------m---------------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWW---------WWWWWWWWWWWWWWWWWW-------------------------------------------------WWWWWWWWWWWW----------------------------------------------------------WWWWWWWWWWWWW---------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------m---------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------w-----www---ww------w--------w----w-----------------w--------------w---w---w-------------------------------------n---------n--------n-----------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-----------------------------------------------------------------------------------------------------------------------------------------------W",
	 "---------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"]);
	
	document.addEventListener("keydown", keyPress);
	document.addEventListener("keyup", keyRelease);

	level = 0;
	
	foes[0][0] = {rect: {x: 400, y: -500, width: 40, height: 20}, type: 'm', shooting: false, weapon: {}, has_powup: true, speed: 10, hp: 5, earned_points: 0}; //dummy foe to test with
	
	/*walls[0][0] = {rect: {x: 0, y: -500, width: 40, height: 40}, type: 'W', destroyable: false};
	walls[0][1] = {rect: {x: 200, y: -600, width: 40, height: 40}, type: 'W', destroyable: false};
	walls[0][2] = {rect: {x: 1540, y: 0, width: 40, height: 40}, type: 'w', destroyable: true};
	walls[0][3] = {rect: {x: 1580, y: 0, width: 40, height: 40}, type: 'W', destroyable: false};
	walls[0][4] = {rect: {x: 1540, y: 40, width: 40, height: 40}, type: 'W', destroyable: false};*/
	
	lvl_create();
	
	for (var i = 0; i <= 29; i++) {
		bullet = {rect: {x: 0, y: 0, width: 5, height: 5},dir: {x: -1, y: 0}, exists: false, power: 0, speed: 0, friend_bul: false};
		bullets[i] = bullet;
	}
	
	for (var i = 0; i <= 19; i++) {
		powup = {rect: {x: 0, y: 0, height: 10, width: 10}, exists: false};
		powups[i] = powup;
	}
	
	space_ship.rect = {x: (width / 2 - 20) * - unit_vector[1] + 20 * unit_vector[0], y: (height / 2 - 10) * unit_vector[0] + (height - 40) * - unit_vector[1] , width: 40, height: 20};
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
	delta_scrolling = dt * SCROLLING_SPEED;
	
	pos_on_map += delta_scrolling;
	
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
				}
				default: 
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
					ctx.fillStyle = "#FFFF00";
				}
			}
			rectFill(bullets[i]);
		}
	}

	for (var i = 0; i <= foes[0].length - 1; i++) {
		if (foes[level][i].hp > 0  && entity_on_screen(foes[level][i])) {
			switch (foes[level][i].type ) {
				case 'm': {
					ctx.fillStyle = "#0000FF";
					rectFill(foes[level][i]);
				}
				default: {
					ctx.fillStyle = "#FFFFFF";
				}
			}
		}
	}
	
	for (var i = 0; i <= powups.length - 1; i++) {
		ctx.fillStyle = "#f49e42";
		if (powups[i].exists) {
			rectFill(powups[i]);
		}
	}
	
	for (var i = 0; i <= walls[level].length - 1; i++) {
		for (var j = min_wall_on_screen_index[i]; j <= walls[level][i].length - 1; j++) {
			if (!entity_on_screen(walls[level][i][j])) { 
				break;
			}
			
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
		}	
	}
	
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
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, height, width, 100);
	
	powup_choice_render();
	ctx.strokeStyle = "#FFFFFF";
	for (i = 0; i <= POWUP_CHOICE - 1; i++) {
		ctx.strokeRect(i * 25, ctx.height - 75, 20, 5);
	}
	
	if (!in_play) {
		ctx.font = "30px Arial";
		ctx.fillText("Game Over, you lose !", width / 2 - 100, height / 2);
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
				walls[level][i].push(wall);
			}
		}
	}
}

collides = function(a, b) {
	return a.rect.x < b.rect.x + b.rect.width && a.rect.x + a.rect.width > b.rect.x && a.rect.y < b.rect.y + b.rect.height && a.rect.height + a.rect.y > b.rect.y;
}

collidesWall = function(entity, bullets, walls) {
	var has_collided = false;
	for (var i = 0; i <= walls[level].length - 1; i++) {
		while (pos_on_map > walls[level][i][min_wall_on_screen_index[i]].rect.x + walls[level][i][min_wall_on_screen_index[i]].rect.width) {
			min_wall_on_screen_index[i]++;
		}
		
		for (var j = min_wall_on_screen_index[i]; j <= walls[level][i].length - 1; j++) {
			if (!entity_on_screen(walls[level][i][j])) {
				break;
			}
			
			
			if (collides(entity, walls[level][i][j])) {
				has_collided = true;
			}

			
			for (k = 0; k <= bullets.length - 1; k++) {
				if (bullets[k].exists && collides(bullets[k], walls[level][i][j])) {
					reset_bullet(bullets[k]);
					if (walls[level][i][j].destroyable) {
						walls[level][i][j].rect.width = 0;
						walls[level][i][j].rect.height = 0;
					}
				}
			}
		}
	}
	return has_collided;
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
					for (var l = i; l <= bullets.length - 1; l++) {
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
							for (var m = l; m <= bullets.length - 1; m++) {
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