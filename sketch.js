//class 18 has the completed trex game for refrence
var gameState = "play"

var rapunzel, rapunzel_running, rapunzel_collided;
var invisible_ground, backgroundImg, obstaclesGroup, bush1, bush2, rock1, rock2;
var restartButton, gameOverImg, background1, restart;

var score = 0;

function preload(){
    //animations
    rapunzel_running = loadAnimation("images/Walk1Forward.png", "images/Walk2Forward.png");
    rapunzel_collided = loadAnimation("images/Stand-Forward.png");

    //images
    backgroundImg = loadImage("images/background.png");
    gameOverImg = loadImage("images/gameOver.png");
    bush1 = loadImage("images/bush1.png");
    bush2 = loadImage("images/bush2.png");
    rock1 = loadImage("images/rock1.png");
    rock2 = loadImage("images/rock2.png");
    restartButton = loadImage("images/restartButton.png");

}

function setup(){
    createCanvas(windowWidth, windowHeight);
    

    //background
    background1 = createSprite(windowWidth/2, windowHeight/2, windowWidth, windowHeight);
    background1.addImage("background1", backgroundImg);
    background1.scale = 7.9;

    //ground + obstacles
    invisible_ground = createSprite(200,windowHeight - 25,windowWidth,10);
    invisible_ground.visible = false;
  
    //rapunzel
    rapunzel = createSprite(75, 600, 50, 50);
    rapunzel.addAnimation("running", rapunzel_running);
    rapunzel.addAnimation("collided", rapunzel_collided);
    rapunzel.scale = 0.5;
    rapunzel.setCollider("circle", 30, 0, 80);
    //rapunzel.debug = true;

    //restart + gameover
    gameOver = createSprite(windowWidth/2,windowHeight/2);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 2;
    gameOver.visible = false;
    // gameOver.depth = rapunzel.depth;
    // rapunzel.depth+=1

    restart = createSprite(windowWidth/2+20, windowHeight/2 + 180);
    restart.addImage(restartButton);
    restart.scale = 2;
    restart.visible = false;
    // restart.depth = rapunzel.depth;
    // rapunzel.depth+=1;

    //ground + obstacles
    invisible_ground = createSprite(200,windowHeight - 25,windowWidth,10);
    invisible_ground.visible = false;

    //groups
    obstaclesGroup = new Group();

    

}

function draw(){
    background(0);
    drawSprites();

    //score display
    textSize(35);
    stroke("green");
    strokeWeight(3);
    text("Score " + score, windowWidth - (windowWidth - 200), 40);

    rapunzel.collide(invisible_ground);
    

    //score + play
    if(gameState === "play"){
        score = score + Math.round(getFrameRate()/60);

        spawnObstacles();

        if(keyDown("space") || touches.length> 0 && rapunzel.y >= windowHeight/2 + 300) {
            rapunzel.velocityY = -12;
        }

        rapunzel.velocityY = rapunzel.velocityY + 0.8
        
        background1.velocityX = -(5+2*score/100);

        //infinite background
        if(background1.x < windowWidth/2-450){
            background1.x = windowWidth/2 + 650
        }

        if(obstaclesGroup.isTouching(rapunzel)){
            gameState = "end"
        }
        
    }

 

    if (gameState === "end") {

        swal({
            title: "Better Luck Next Time!", 
            text: `Final Score: ${score}`,
            imageUrl : "https://images.pond5.com/game-over-text-reveal-arcade-footage-073935596_iconl.jpeg",
            imageSize: "300x300",
            confirmButtonText: "Play Again"
            },
            function(isConfirm){
                if(isConfirm){
                    window.location.reload()
                }
            }
        )
        
        //stopping things
        background1.velocityX = 0;
        rapunzel.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);

        //freezing
        rapunzel.changeAnimation("collided",trex_collided);
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
    }
}

function spawnObstacles(){
    if(frameCount % 90 === 0) {
        var obstacle = createSprite(windowWidth,windowHeight - 40,10,40);
        obstacle.setCollider("rectangle", 0, 0, 380, 100);
        //obstacle.debug = true;
        obstacle.velocityX = -(6 + 3*score/100);
        
        var rand = Math.round(random(1,4));
        switch(rand) {
          case 1: obstacle.addImage(bush1);
                  break;
          case 2: obstacle.addImage(bush2);
                  break;
          case 3: obstacle.addImage(rock1);
                  break;
          case 4: obstacle.addImage(rock2);
                  break;
          default: break;
        }
                
        obstacle.scale = 0.5;
        obstacle.lifetime = 300;

        obstaclesGroup.depth = rapunzel.depth;
        rapunzel.depth+=3

        obstaclesGroup.add(obstacle);


      }
}


function reset(){
    gameState = "play";
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    
    rapunzel.changeAnimation("running",rapunzel_running);

    score = 0;
}
