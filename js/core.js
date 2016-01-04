var FPS = 20;
var PIPE_WIDTH = 40;
var PIPE_GAP = 100;
var PIPE_DISTANCE = 200;
var OBJ_RADIUS = 10;

var clock, canvas, context;
var pipes = [];
var cameraOffset = -1000;

var mousePos = {};

var obj_ypos = 0;
var obj_upwardForce = 0;
var obj_downwardForce = 2;


window.addEventListener("load", function() {
	clock = setInterval(renderFrame, FPS);
	canvas = document.getElementById("game");
	context = canvas.getContext("2d");
	
	canvas.addEventListener('mousemove', function(evt) {
		var rect = canvas.getBoundingClientRect();
        mousePos.x = evt.clientX - rect.left;
        mousePos.y = evt.clientY - rect.top;
		
		
		//mousePos.x = (evt.clientX-rect.l
		eft)/(rect.right-rect.left)*canvas.width;
		//mousePos.y = (evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height;

	}, false);
	
	canvas.addEventListener('click', function(evt) {
		obj_upwardForce = 12;
		obj_downwardForce = 0;
	},false);

	
	
	
	var lastPipeX = 0;
	for(var i = 0; i < 50; i++) {
		var currentYOffset = PIPE_GAP + Math.floor(Math.random() * PIPE_GAP);
		
		pipes.push({
			x1: lastPipeX, 
			y1: currentYOffset, 
			x2: lastPipeX, 
			y2: currentYOffset + PIPE_GAP 
		});
		lastPipeX += PIPE_DISTANCE;
	}

}, false);



	  
function renderFrame() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	cameraOffset++;
	if(obj_upwardForce > 0) obj_upwardForce -= 0.4;
	if(obj_downwardForce < 5) obj_downwardForce += 0.8;
	checkCollision();
	drawPipes();
	
	obj_ypos += obj_upwardForce > 0 ? -obj_upwardForce/2.5 : 0 + obj_downwardForce/2;
	drawMouse(obj_ypos);
}

function checkCollision() {
	
	//Get Objects in Range
	var collision, objectID = -1;
	
	//Declare monitoring region
	var range_x_start = canvas.width/2 - PIPE_WIDTH;
	var range_x_end = canvas.width/2 + PIPE_WIDTH;
		
	var obj_start;
	var obj_end;
	
	for(var i = 0; i < pipes.length; i++) {

		//Get object
		obj_start = pipes[i].x1 - cameraOffset;
		obj_end = (pipes[i].x1 - cameraOffset) + PIPE_WIDTH;

		//Get object in region	
		if((obj_start > range_x_start) && (obj_end < range_x_end)) {
			objectID = i;
			context.font = "30px Arial";
			context.fillText("Obj " + objectID, pipes[i].x1 - cameraOffset, canvas.height/2);
			break;
		}	
		
	}
	
	if(objectID != -1) {
		
		//Check for collision on all edge coordinates
		for(deg = 0; deg < 360; deg += 10) {
			
			x = canvas.width/2 + OBJ_RADIUS * Math.cos(deg * Math.PI / 180);
			y = obj_ypos + OBJ_RADIUS * Math.sin(deg * Math.PI / 180);
			
			collision = false;
			
			if(x >= obj_start && x <= obj_end) {
				if(y <= pipes[objectID].y1 || y >= pipes[objectID].y2) {
					collision = true;
					context.fillText("COLLISION", 20, 20);
					clearInterval(clock);
				}
			}
		}	
	}	
	
	
}

function drawPipes() {
	for(var i = 0; i < pipes.length; i++) {
		context.fillStyle = "#FF0000";
		context.fillRect(pipes[i].x1 - cameraOffset, 0, PIPE_WIDTH, pipes[i].y1);
		context.fillStyle = "#00FF00";
		context.fillRect(pipes[i].x2 - cameraOffset, pipes[i].y2, PIPE_WIDTH, canvas.height - pipes[i].y2);
	}
}



function drawMouse() {		
	context.beginPath();
	context.arc(canvas.width/2, obj_ypos, OBJ_RADIUS, 0, 2 * Math.PI);
	context.stroke();
	
}

