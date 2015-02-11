/*===========Constants==========*/
var SCREEN_WIDTH = document.all?document.body.clientWidth:window.innerWidth;
var SCREEN_HEIGHT = document.all?document.body.clientHeight:window.innerHeight;
var GRAVITY = 3;
var ACCELERATION = .5;
var FLOOR_HEIGHT = SCREEN_HEIGHT  /1.18;//600;//478
var MOVE_SPEED = 5;
var PLAYER_HEIGHT = 64
var JUMP_HEIGHT = FLOOR_HEIGHT - ((PLAYER_HEIGHT * 3) + 2); //+2 gives ability to jump 3 blocks high
var JUMP_SPEED = 8;
/*==============End==============*/

var playerTag;

/*===========Load Tiles==========*/
var tiles = ["http://www.slothpie.co.nf/images/backgrounds/background_grass.png"];
var tileRaster = [];
        tileRaster[0] = new Raster(tiles[0]);
        tileRaster[0].position = new Point(500, FLOOR_HEIGHT / 0.91);
/*==============End==============*/

/*===========Load Clouds==========*/
var cloudSource = "http://www.slothpie.co.nf/images/clouds/";
var clouds = [cloudSource + "cloud_0.png",
            cloudSource + "cloud_1.png",
            cloudSource + "cloud_2.png",
            cloudSource + "cloud_3.png",
            cloudSource + "cloud_4.png",
            cloudSource + "cloud_5.png",
            cloudSource + "cloud_6.png",
            cloudSource + "cloud_7.png",
            cloudSource + "cloud_8.png",
            cloudSource + "cloud_9.png"];
var cloudRaster = [];
var cloudSpeed = [];
var cloudPosition = 0;
for(var i=0; i<clouds.length;i++)
{
    cloudPosition = Math.floor((Math.random() * 300) + 1);
    cloudSpeed[i] = Math.floor((Math.random() * 3) + 1);
    cloudRaster[i] = new Raster(clouds[i]);
    cloudRaster[i].position = new Point(-100 + -Math.floor((Math.random() * 50) + 1), 50 + cloudPosition);
}
/*==============End==============*/

/*===========Load Player==========*/
var playerSource = "http://www.slothpie.co.nf/images/characters/player/";
var player = [playerSource + "player_000.png",
            playerSource + "player_001.png",
            playerSource + "player_002.png",
            playerSource + "player_003.png",
            playerSource + "player_004.png",
            playerSource + "player_005.png",
            playerSource + "player_006.png",
            playerSource + "player_007.png",
            playerSource + "daughter_000.png",
            playerSource + "daughter_001.png",
            playerSource + "daughter_002.png",
            playerSource + "daughter_003.png",
            playerSource + "daughter_004.png",
            playerSource + "daughter_005.png",
            playerSource + "daughter_006.png",
            playerSource + "daughter_007.png"];
var playerRaster = [];
for (var i = 0; i < player.length;i++ )
{
    playerRaster[i] = new Raster(player[i]);
    playerRaster[i].position = new Point(PLAYER_HEIGHT/2, PLAYER_HEIGHT/2);
    playerRaster[i].position = new Point(-100, -100);
}
var _gender = "male";
// 0-7 Male, 8-15 Female
var _currPlayerRaster = 0;
var _oldPlayerRaster = 0;
playerRaster[_currPlayerRaster].position = new Point(SCREEN_WIDTH / 2, PLAYER_HEIGHT/2);

/*==============End==============*/

/*===========Tick Var==========*/
var tick = 0;
var updateTick = 0;
var fps = {
	startTime : 0,
	frameNumber : 0,
	getFPS : function(){
		this.frameNumber++;
		var d = new Date().getTime(),
			currentTime = ( d - this.startTime ) / 1000,
			result = Math.floor( ( this.frameNumber / currentTime ) );
		if( currentTime > 1 ){
			this.startTime = new Date().getTime();
			this.frameNumber = 0;
		}
		return result;
	}	
};
/*==============End==============*/

/*===========Movement==========*/
var _isFalling = false;
var _isFalling_Count = 0;

var _isJumping = false;

var _isFacingRight = true;

var _isMovingRight = false;
var _isRight_Count = 0;
var _isMovingLeft = false;
var _isLeft_Count = 0;
/*==============End==============*/

/*===========Socks==========*/
    //to be added
/*==============End==============*/


function init()
{
    createDiv();
}
init();

//Frame Event
function onFrame(event)
{
    UpdateGame();
    
    document.getElementById("fps").innerHTML = "FPS: " + fps.getFPS();
    updateTick++;
    tick++;
    _isRight_Count++;
    _isLeft_Count++;
}

function UpdateGame()
{
    checkPlayer();
    movePlayer();
    movePlayerTag();
    animateClouds();
}

function onMouseDrag(e) 
{
    
}

function onMouseMove(e) 
{

}

function onMouseDown(e) 
{

}

function createDiv() 
{
    var divTag = document.createElement("div");
    divTag.id = "divDyn";
    divTag.className = "nameHeader";
    divTag.innerHTML = _username;
    document.body.appendChild(divTag);
    playerTag = document.getElementById("divDyn");
}

function movePlayerTag()
{
    var x = playerRaster[_currPlayerRaster].position.x;
    var y = playerRaster[_currPlayerRaster].position.y;
    var width = playerTag.clientWidth;
    
    playerTag.style.top = (y - 35) + 'px';
    playerTag.style.left = (x - (width / 2) - 14) + 'px';
}


function onKeyDown(e) {

    if(e.key === 'space' && !_isFalling){
        _isJumping = true;
    }

    if(e.key === 'up' && !_isFalling){
        _isJumping = true;
    }
    
    if(e.key === 'left'){
        _isMovingLeft = true;
    }
    if(e.key === 'right'){
        _isMovingRight = true;
    }
}

function onKeyUp(e) {
    if(e.key === 'space'){
        _isJumping = false;
    }
    if(e.key === 'up'){
        _isJumping = false;
    }
    if(e.key === 'left'){
        _isMovingLeft = false;
    }
    if(e.key === 'right'){
        _isMovingRight = false;
    }
}

//Animate Clouds
function animateClouds()
{
    for(var i=0; i< cloudRaster.length; i++)
    {
        if(cloudRaster[i].position.x + cloudSpeed[i] >= SCREEN_WIDTH + 100)
        {
            cloudPosition = Math.floor((Math.random() * 300) + 1);
            cloudRaster[i].position = new Point(-100 + -Math.floor((Math.random() * 50) + 1), 50 + cloudPosition);
            cloudSpeed[i] = Math.floor((Math.random() * 3) + 1);
        }
        cloudRaster[i].position.x += cloudSpeed[i];
    }
}

//Check player
function checkPlayer()
{
    if (_isRight_Count === 20)
        _isRight_Count = 0;

    if (_isLeft_Count === 20)
        _isLeft_Count = 0;

    //Falling Animation
    if (playerRaster[_currPlayerRaster].position.y === FLOOR_HEIGHT || _isJumping) {
        _isFalling = false;
        _isFalling_Count = 0;
    }
    else {
        _isFalling = true;
    }
    //Idle Animation
    if (_isFacingRight && _currPlayerRaster !== 0 && !_isFalling && !_isMovingRight && !_isMovingLeft) {
        switchRaster(0);
    }
    else if (!_isFacingRight && _currPlayerRaster !== 1 && !_isFalling && !_isMovingRight && !_isMovingLeft) {
        switchRaster(1);
    }
    //Falling Animation
    if (_isFalling && _isFacingRight && _currPlayerRaster !== 6) {
        switchRaster(6);
    }
    else if (_isFalling && !_isFacingRight && _currPlayerRaster !== 7) {
        switchRaster(7);
    }
    //Moving Left Animation
    if (_isMovingLeft && _currPlayerRaster !== 4 && _isLeft_Count <= 10) {
        switchRaster(4);
    }
    else if (_isMovingLeft && _currPlayerRaster !== 5 && _isLeft_Count > 10) {
        switchRaster(5);
    }
    //Moving Right Animation
    if (_isMovingRight && _currPlayerRaster !== 2 && _isRight_Count <= 10) {
        switchRaster(2);
    }
    else if (_isMovingRight && _currPlayerRaster !== 3 && _isRight_Count > 10) {
        switchRaster(3); 
    }
}   

//Raster Switcher
function switchRaster(switchTo)
{
    var _temp = 0;
    if(_gender === "female")
        _temp = 8;
    
    var _tempPoint = playerRaster[(_currPlayerRaster)].position;

    playerRaster[(_currPlayerRaster)].position = new Point(-100, -100);
    _oldPlayerRaster = (_currPlayerRaster);
    playerRaster[switchTo + _temp].position = _tempPoint;
    _currPlayerRaster = switchTo + _temp;

    console.log("Successfully Switched to Number: " + switchTo);
}

//Moving Player
function movePlayer()
{
    var _temp = 0;
    
    //Ground Code
    if(playerRaster[_currPlayerRaster].position.y >= FLOOR_HEIGHT){
        _isFalling = false
    }

    //Jumping Code
    if(_isJumping)
    {
        _temp = JUMP_SPEED;

        if (playerRaster[_currPlayerRaster].position.y - _temp <= JUMP_HEIGHT) {
            _temp = JUMP_HEIGHT - playerRaster[_currPlayerRaster].position.y;
            _isJumping = false;
        }
        else if(playerRaster[_currPlayerRaster].position.y - _temp <= JUMP_HEIGHT - 16)
        {
            _temp -= JUMP_SPEED / 8;
        }

        playerRaster[_currPlayerRaster].position.y -= _temp;
    }
    
    //Falling Code
    if(_isFalling)
    {
        _temp = GRAVITY + ACCELERATION * _isFalling_Count;

        if (_temp + playerRaster[_currPlayerRaster].position.y >= FLOOR_HEIGHT) 
        {
            _temp = FLOOR_HEIGHT - playerRaster[_currPlayerRaster].position.y;
        }

        if (_isFalling) {
            playerRaster[_currPlayerRaster].position.y += _temp; 
            _isFalling_Count++;
        }
    }

    //Moving Right Code
    if(_isMovingRight)
    {
        if(playerRaster[_currPlayerRaster].position.x + MOVE_SPEED > SCREEN_WIDTH - 23)
            playerRaster[_currPlayerRaster].position.x = SCREEN_WIDTH - 23;
        else
            playerRaster[_currPlayerRaster].position.x += MOVE_SPEED;
        
        _isFacingRight = true;
    }

    //Moving Left Code
    if(_isMovingLeft)
    {
        if(playerRaster[_currPlayerRaster].position.x - MOVE_SPEED < 0 + 28)
            playerRaster[_currPlayerRaster].position.x = 0 + 28;
        else
            playerRaster[_currPlayerRaster].position.x -= MOVE_SPEED;
    
        _isFacingRight = false;
    }
    
}
