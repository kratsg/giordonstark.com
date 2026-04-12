// a 32x24 block map
var map = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,3,0,3,0,0,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,0,0,0,0,0,0,0,0,1],
	[1,0,0,3,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,1,1,1],
	[1,0,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,3,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[1,0,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,1,1,1,0,0,0,0,0,3,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,4,0,0,4,2,0,2,2,2,2,2,2,2,2,0,2,4,4,0,0,4,0,0,0,0,0,0,0,1],
	[1,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,1],
	[1,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,1],
	[1,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,1],
	[1,0,0,4,3,3,4,2,2,2,2,2,2,2,2,2,2,2,2,2,4,3,3,4,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];


var player = {
	x: 15.5,//map unit
	y: 9.5,//map unit
	color: 'black',
	coinsFound: 0,
	dotWidth: 1,//map unit
	dotHeight: 1,//map unit
	dir: 0,//-1 for left, 1 for right
	rot: 0,//angle of rotation
	speed: 0, //moving forwards or backwards
	moveSpeed: 0.2,//how fast player moves per step (map units)
	rotSpeed: Math.PI / 30, //how fast player rotates per step (map units//radians)
};

var mapDetails = {
	width: 0,//number of map blocks in x-direction
	height: 0,//number of map blocks in y-direction
	XScale: 20,//how many pixels to draw per map block in x
	YScale: 20,//how many pixels to draw per map block in y
	mWidth: 0,//total width in pixels
	mHeight: 0,//total height in pixels
	gameOn: 1,//1 = gameOn, 0 = gameOver
	coins: 0,
	map: '',//actual map
	objects: ''//players, other objects
}

$.each(map, function(rowIndex, rowItem){
	row = rowIndex;
	$.each(rowItem,function(cellIndex, cellItem){
		if(cellItem == 0){
			mapDetails.coins++;
		}
	});
});

function init(){
	mapDetails.width = map[0].length;
	mapDetails.height = map.length;

	mapDetails.mWidth = mapDetails.width*mapDetails.XScale;
	mapDetails.mHeight = mapDetails.height*mapDetails.YScale;
	
	mapDetails.map = $("#minimap");
	mapDetails.objects = $("#minimapobjects");

	drawMiniMap();
	bindKeys();
	gameCycle();
}

function drawMiniMap() {
	
	miniMap = mapDetails.map;
	miniMapObjects = mapDetails.objects;
		
	//resize the internal canvas, use first index
	miniMap[0].width = miniMapObjects[0].width = mapDetails.mWidth;
	miniMap[0].height = miniMapObjects[0].height = mapDetails.mHeight;
	
	//resize the actual CSS
	miniMap.add(miniMapObjects).css({'width': mapDetails.mWidth, 'height': mapDetails.mHeight});
	
	var row = 0;//so we can pass the rowIndex to the nested $.each
	
	//loop through blocks now
	var ctx = miniMap[0].getContext("2d");
	$.each(map, function(rowIndex, rowItem){
		row = rowIndex;
		$.each(rowItem,function(cellIndex, cellItem){
			if(cellItem > 0){
				ctx.fillStyle = "rgb(200,200,200)";
				ctx.fillRect(
					cellIndex*mapDetails.XScale,
					row*mapDetails.YScale,
					mapDetails.XScale,
					mapDetails.YScale
				);
			} else if(cellItem == 0){
				ctx.strokeStyle = "black";
				ctx.fillStyle = "gold";
				ctx.beginPath();
				ctx.arc(
					(cellIndex+0.5)*mapDetails.XScale,
					(row+0.5)*mapDetails.YScale,
					0.25*mapDetails.XScale,
					0,
					2*Math.PI,
					true
				);
				ctx.closePath();
				ctx.stroke();
				ctx.fill();
			}
		});
	});
}

function remCoin(x,y){

	miniMap = mapDetails.map;
	miniMapObjects = mapDetails.objects;
	xmap = x*mapDetails.XScale;
	ymap = y*mapDetails.YScale;
	
	var ctx = miniMap[0].getContext("2d");
	ctx.clearRect(xmap,ymap,mapDetails.XScale,mapDetails.YScale);
	if(player.coinsFound == mapDetails.coins){mapDetails.gameOn = 0;alert('Game over! All coins found!');}
	if(map[y][x]==0){map[y][x] = -1;player.coinsFound++;}
}

function bindKeys() {

	$(document).keydown(function(event){
		switch(event.keyCode){
			case 38: //up
				player.speed = 1;
				break;
			case 40: //down
				player.speed = -1;
				break;
			case 37: //left
				player.dir = -1;
				break;
			case 39: //right
				player.dir = 1;
				break;
		}
	}).keyup(function(event){
		switch(event.keyCode){
			case 38: //up
			case 40: //down
				player.speed = 0;
				player.color = 'black';
				break;
			case 37: //left
			case 39: //right
				player.dir = 0;
				player.color = 'black';
				break;
		}	
	});

}

function gameCycle() {
	if(mapDetails.gameOn == 1){
		move();
		updateMiniMap();
		setTimeout(gameCycle,1000/30); //30 FPS
	}
}

//everything is in map units for this function
function move() {
	var moveStep = player.speed*player.moveSpeed;//player moves this far along direction vector
	player.rot += player.dir*player.rotSpeed;//add rotation if player is rotating (player.dir !=0)
	
	var newX = player.x+Math.cos(player.rot)*moveStep;
	var newY = player.y+Math.sin(player.rot)*moveStep;
	
	var pos = checkCollision(player.x, player.y, newX, newY, 0.5);
	
	if(pos.x != newX || pos.y != newY){
		player.color = 'red';
	} else {
		player.color = 'black';
	}
	
	player.x = pos.x;
	player.y = pos.y;
	remCoin(Math.floor(pos.x),Math.floor(pos.y));
}

function updateMiniMap(){

	miniMap = mapDetails.map;
	miniMapObjects = mapDetails.objects;

	var objectCtx = miniMapObjects[0].getContext("2d");
	objectCtx.clearRect(0,0,mapDetails.XScale*mapDetails.width,mapDetails.YScale*mapDetails.height);
	
	//draw a dot at player location
	objectCtx.fillStyle = player.color;
/*	objectCtx.fillRect(
		(player.x - player.dotWidth/2)*mapDetails.XScale,
		(player.y - player.dotHeight/2)*mapDetails.YScale,
		player.dotWidth*mapDetails.XScale,
		player.dotHeight*mapDetails.XScale
	);*/
	objectCtx.arc(
		player.x*mapDetails.XScale,
		player.y*mapDetails.YScale,
		player.dotWidth/2*mapDetails.XScale,
		0,
		2*Math.PI,
		true
	);
	objectCtx.closePath();
	objectCtx.stroke();
	objectCtx.fill();

	
	//draw direction player facing using thin line
	objectCtx.beginPath();
	objectCtx.moveTo(player.x*mapDetails.XScale,player.y*mapDetails.YScale);//move to player location
	objectCtx.lineTo(
		(player.x+Math.cos(player.rot)*2)*mapDetails.XScale,
		(player.y+Math.sin(player.rot)*2)*mapDetails.YScale
	);
	objectCtx.closePath();
	objectCtx.stroke();
}

//everything is in map units for this function
function checkCollision(fromX, fromY, toX, toY, radius){
	var pos = {
		x: fromX,
		y: fromY
	};
	
	if(toY < 0 || toY >= mapDetails.height || toX < 0 || toX >= mapDetails.width){
		return pos;
	}
	
	var blockX = Math.floor(toX);
	var blockY = Math.floor(toY);
	
	if (isBlocking(blockX,blockY)) {
		return pos;
	}

	pos.x = toX;
	pos.y = toY;

	var blockTop = isBlocking(blockX,blockY-1);
	var blockBottom = isBlocking(blockX,blockY+1);
	var blockLeft = isBlocking(blockX-1,blockY);
	var blockRight = isBlocking(blockX+1,blockY);

	if (blockTop != 0 && toY - blockY < radius) {
		toY = pos.y = blockY + radius;
	}
	if (blockBottom != 0 && blockY+1 - toY < radius) {
		toY = pos.y = blockY + 1 - radius;
	}
	if (blockLeft != 0 && toX - blockX < radius) {
		toX = pos.x = blockX + radius;
	}
	if (blockRight != 0 && blockX+1 - toX < radius) {
		toX = pos.x = blockX + 1 - radius;
	}

	// is tile to the top-left a wall
	if (isBlocking(blockX-1,blockY-1) != 0 && !(blockTop != 0 && blockLeft != 0)) {
		var dx = toX - blockX;
		var dy = toY - blockY;
		if (dx*dx+dy*dy < radius*radius) {
			if (dx*dx > dy*dy){
				toX = pos.x = blockX + radius;
			} else {
				toY = pos.y = blockY + radius;
			}
		}
	}
	// is tile to the top-right a wall
	if (isBlocking(blockX+1,blockY-1) != 0 && !(blockTop != 0 && blockRight != 0)) {
		var dx = toX - (blockX+1);
		var dy = toY - blockY;
		if (dx*dx+dy*dy < radius*radius) {
			if (dx*dx > dy*dy){
				toX = pos.x = blockX + 1 - radius;
			} else {
				toY = pos.y = blockY + radius;
			}
		}
	}
	// is tile to the bottom-left a wall
	if (isBlocking(blockX-1,blockY+1) != 0 && !(blockBottom != 0 && blockBottom != 0)) {
		var dx = toX - blockX;
		var dy = toY - (blockY+1);
		if (dx*dx+dy*dy < radius*radius) {
			if (dx*dx > dy*dy){
				toX = pos.x = blockX + radius;
			} else {
				toY = pos.y = blockY + 1 - radius;
			}
		}
	}
	// is tile to the bottom-right a wall
	if (isBlocking(blockX+1,blockY+1) != 0 && !(blockBottom != 0 && blockRight != 0)) {
		var dx = toX - (blockX+1);
		var dy = toY - (blockY+1);
		if (dx*dx+dy*dy < radius*radius) {
			if (dx*dx > dy*dy){
				toX = pos.x = blockX + 1 - radius;
			} else {
				toY = pos.y = blockY + 1 - radius;
			}
		}
	}
	return pos;
}


function isBlocking(x,y){
	
	if(
		y < 0 ||
		y > mapDetails.height ||
		x < 0 ||
		x > mapDetails.width 
	){
		return true;
	}
	return (map[Math.floor(y)][Math.floor(x)] > 0);
}