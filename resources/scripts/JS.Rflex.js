var isPaused = true;
var counter = 0;
var jumpButtonVisible = true;
var bestCounter = 0;

function jump() {
  if (!jumpButtonVisible || isPaused) {
    return;
  }

  var player = document.getElementById("player");
  var jumpButton = document.getElementById("jump-button");
  var randomNum = Math.random();
  var jumpSound = randomNum < 0.5 ? document.getElementById("jumpSound1") : document.getElementById("jumpSound2");

  jumpSound.volume = 0.2;
  jumpSound.play();

  jumpButton.disabled = true;
  player.style.transform = "translateY(-50px) rotate(360deg)";

  setTimeout(function () {
    player.style.transform = "translateY(0) rotate(0)";
  }, 400);

  setTimeout(function () {
    jumpButton.disabled = false;
  }, 650);
}

function displayCounterAtCenter() {
  var gameContainer = document.getElementById("game-container");

  var counterDisplay = document.createElement("div");
  counterDisplay.className = "counter-display";
  counterDisplay.innerText = counter;
  gameContainer.appendChild(counterDisplay);

  setTimeout(function () {
    counterDisplay.style.fontSize = "20px";
    counterDisplay.style.opacity = 1;
  }, 0);

  setTimeout(function () {
    gameContainer.removeChild(counterDisplay);
  }, 3000);

  if (counter % 1000 === 0) {
    playLevelUpSound();
  }
}

function playLevelUpSound() {
  var levelUpSound = document.getElementById("levelUpSound");
  levelUpSound.volume = 0.5;
  levelUpSound.play();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkCollision(player, obstacle) {
  var playerRect = player.getBoundingClientRect();
  var obstacleRect = obstacle.getBoundingClientRect();

  return !(
    playerRect.right < obstacleRect.left ||
    playerRect.left > obstacleRect.right ||
    playerRect.bottom < obstacleRect.top ||
    playerRect.top > obstacleRect.bottom
  );
}

function updateJumpButtonVisibility() {
  var jumpButton = document.getElementById("jump-button");
  jumpButton.style.visibility = jumpButtonVisible ? "visible" : "hidden";
}

function handleCollision() {
  isPaused = true;
  document.querySelector(".pause-text").style.display = "block";
  jumpButtonVisible = false;
  updateJumpButtonVisibility();

  if (counter > bestCounter) {
    bestCounter = counter;
    document.getElementById("pbCounter").innerText = "PB: " + bestCounter;
  }

  var collisionSound = document.getElementById("collisionSound");
  collisionSound.play();

  setTimeout(function () {
    jumpButtonVisible = true;
    updateJumpButtonVisibility();
  }, 3000);
}

function spawnObstacle() {
  if (!isPaused) {
    var obstacle = document.createElement("div");
    obstacle.className = "obstacle";
    obstacle.style.left = "300px";

    var gameContainer = document.getElementById("game-container");
    gameContainer.appendChild(obstacle);

    var moveInterval = setInterval(function () {
      var currentLeft = parseFloat(obstacle.style.left);
      var obstacleWidth = obstacle.clientWidth;

      if (checkCollision(player, obstacle)) {
        handleCollision();
        gameContainer.removeChild(obstacle);
        clearInterval(moveInterval);
      } else if (currentLeft + obstacleWidth <= 0) {
        gameContainer.removeChild(obstacle);
        clearInterval(moveInterval);
      } else {
        var palier = 200;
        var increment = 2 + (counter / (palier * 10));
        obstacle.style.left = currentLeft - increment + "px";
      }
    }, 10);
  }
}

function spawnHole() {
  if (!isPaused) {
    var hole = document.createElement("div");
    hole.className = "hole";
    hole.style.left = "300px";

    var gameContainer = document.getElementById("game-container");
    gameContainer.appendChild(hole);

    var moveInterval = setInterval(function () {
      var currentLeft = parseFloat(hole.style.left);
      var holeWidth = hole.clientWidth;

      if (checkCollision(player, hole)) {
        handleCollision();
        gameContainer.removeChild(hole);
        clearInterval(moveInterval);
      } else if (currentLeft + holeWidth <= 0) {
        gameContainer.removeChild(hole);
        clearInterval(moveInterval);
      } else {
        var palier = 200;
        var increment = 2 + (counter / (palier * 10));
        hole.style.left = currentLeft - increment + "px";
      }
    }, 10);
  }
}

function spawnRandomElement() {
  if (!isPaused) {
    var randomDelay = getRandomInt(700, 2000);
    setTimeout(function () {
      if (Math.random() < 0.5) {
        spawnObstacle();
      } else {
        spawnHole();
      }
      spawnRandomElement();
    }, randomDelay);
  }
}

function resetCounter() {
  counter = 0;
  document.getElementById("counter").innerText = counter;
}

var jumpButton = document.getElementById("jump-button");
jumpButton.addEventListener("click", function () {
  if (isPaused) {
    isPaused = false;
    resetCounter();
    spawnRandomElement();
  }
});

setInterval(function () {
  if (!isPaused) {
    document.querySelector(".pause-text").style.display = "none";
    updateJumpButtonVisibility();
  } else {
    document.querySelector(".pause-text").style.display = "block";
    updateJumpButtonVisibility();
  } 
});

setInterval(function () {
  if (!isPaused) {
    counter += 10;
    if (counter % 1000 === 0) {
      displayCounterAtCenter();
    }

    document.getElementById("counter").innerText = counter;
  }
}, 1000);

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden" && !isPaused) {
    isPaused = true;
    document.querySelector(".pause-text").style.display = "block";
  }
});

window.addEventListener("scroll", function () {
  var gameContainer = document.getElementById("game-container");
  var containerRect = gameContainer.getBoundingClientRect();

  if ((containerRect.bottom < 0 || containerRect.top > window.innerHeight) && !isPaused) {
    isPaused = true;
    document.querySelector(".pause-text").style.display = "block";
  }
});

spawnRandomElement();
