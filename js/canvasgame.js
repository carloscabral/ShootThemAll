$(function() {

	//get canvas and define drawing functions
	var canvas = document.getElementById("c"),
	context = canvas.getContext("2d"),
	motionInt = null,
	dirCounter = 0,
	enemySpeed = 1000,
	enemies = [],

	enemyMotion = function(dir) {

	var enemyLength = enemies.length;

	//move enemies
	if (dirCounter < 4) {

		//clear enemies
		for (var x = 0; x < enemyLength; x++) {
			context.clearRect(enemies[x].posX, enemies[x].posY, enemies[x].img.width, enemies[x].img.height);
		}

		//draw enemies in new position
		for (var y = 0; y < enemyLength; y++) {

			//update position
			enemies[y].posX = (dir === "right") ?  enemies[y].posX + 35 : enemies[y].posX - 35;

			context.drawImage(enemies[y].img, enemies[y].posX, enemies[y].posY);
		}

		dirCounter++;

	} else {

		clearInterval(motionInt);
		dirCounter = 0;

		//clear enemies
		for (var z = 0; z < enemyLength; z++) {
			context.clearRect(enemies[z].posX, enemies[z].posY, enemies[z].img.width, enemies[z].img.height);
		}

		if (enemies[enemies.length - 1].posY > 530) {

			//game over
			canvas.width = 900;
			context.fillStyle = "#fff";
			context.textAlign = "center";
			context.font = "bold 40px Tahoma";
			context.fillText("GAME OVER!!", 450, 350);
			$(canvas).blur().unbind("keydown");

		} else {

			//draw enemies in new position
			for (var a = 0; a < enemyLength; a++) {

				//move down one line
				enemies[a].posY = enemies[a].posY + 29;

				context.drawImage(enemies[a].img, enemies[a].posX, enemies[a].posY);
			}

			motionInt = (dir === "right") ? setInterval(function() { enemyMotion("left"); }, enemySpeed) : setInterval(function() { enemyMotion("right"); }, enemySpeed);
		}
	}

	},

	//add enemies
	addEnemies = function () {

		var enemyPos = [13, 0];

		//draw 15 columns and 3 rows of enemies
		for (var x = 0; x < 15; x++) {
			for (var y = 0; y < 3; y++) {

				//create a new enemy
				var enemy = new Image();
				enemy.src = "img/enemy.gif";
				enemy.onload = function() {

					//draw enemy
					context.drawImage(enemy, enemyPos[0], enemyPos[1]);

					//store position of enemy
					var data = {
						img: enemy, posX: enemyPos[0], posY: enemyPos[1]
					};
					enemies.push(data);

					//update vertical position
					if (enemyPos[1] < 100) {
						enemyPos[1] = enemyPos[1] + 50;
					} else {
						enemyPos[0] = enemyPos[0] + 50;
						enemyPos[1] = 0;
					}
				};
			}
		}

		//move enemies
		motionInt = setInterval(function () { enemyMotion("right"); }, enemySpeed);

		},

	spaceShip = new Image(),
	spaceShipPos = [430, 600];

	spaceShip.src = "img/spaceShip.png";

	spaceShip.onload = function() {

		//load spaceShip in center of canvas
		context.drawImage(spaceShip, spaceShipPos[0], spaceShipPos[1]);

		//add enemies
		addEnemies();

		//add event handlers for keyboard
		$(canvas).focus().bind("keydown", function(e) {

		//move spaceShip left or right
		if (e.which === 37 || e.which === 39) {

			//remove the spaceShip
			context.clearRect(spaceShipPos[0], spaceShipPos[1], spaceShip.width, spaceShip.height);

			//update spaceShip's position
			if (e.which === 37 && spaceShipPos[0] > 4) {
				spaceShipPos[0] = spaceShipPos[0] - 4;
			} else if (e.which === 39 && spaceShipPos[0] < 896 - spaceShip.width) {
				spaceShipPos[0] = spaceShipPos[0] + 4;
			}

			//draw spaceShip in new location
			context.drawImage(spaceShip, spaceShipPos[0], spaceShipPos[1]);

		} else if (e.which === 32) {
			//fire!
			context.fillStyle = "#fff";
			var bulletPos = spaceShipPos[0] + 20,
			newBulletPos = [bulletPos, 596],
			enemyLength = enemies.length,

			fire = function() {
				if (newBulletPos[1] > 0) {
					context.clearRect(newBulletPos[0], newBulletPos[1], 3, 6);
					newBulletPos[1] = newBulletPos[1] - 2;
					context.fillRect(newBulletPos[0], newBulletPos[1], 3, 6);

						//has the bullet hit an enemy?
						for (var x = 0; x < enemyLength; x++) {
							if (newBulletPos[1] === enemies[x].posY || newBulletPos[1] === enemies[x].posY + enemies[x].img.height) {
								if (newBulletPos[0] > enemies[x].posX && newBulletPos[0] - enemies[x].posX < enemies[x].img.width + 13) {

									//destroy enemy
									context.clearRect(enemies[x].posX, enemies[x].posY, enemies[x].img.width, enemies[x].img.height);
									enemies.splice(x, 1);

									//stop the bullet
									clearInterval(bulletInt);
									context.clearRect(newBulletPos[0], newBulletPos[1], 3, 6);

									if (!enemies.length) {
										clearInterval(motionInt);

										//reset direction
										dirCounter = 0;

										//speed up enemies
										enemySpeed = enemySpeed - 100;

										//redraw enemies
										addEnemies();
									}
								}
							}
						}
					} else {
						context.clearRect(newBulletPos[0], newBulletPos[1], 3, 6);
						clearInterval(bulletInt);
					}
				},
				bulletInt = setInterval(function() { fire(); }, 1);
			}
		});
	};
});