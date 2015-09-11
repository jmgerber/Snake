var pause;
$(document).ready(function(){
    var canvas = $("#canvas")[0];
    var stage = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    var taille_case = 20;
    var direction;
    var apple;
    var score;
    var snake_array;
    

    function init()
    {
        pause = false;
        direction = "right";
        create_snake();
        create_apple();
        score = 0;
        if(typeof(game_loop) != "undefined"){
            clearInterval(game_loop);
        }
        game_loop = setInterval(afficher, 100);
    }
    init();

    function create_snake()
    {
        var length = 5;
        snake_array = [];
        for(var i=length-1; i>=0; i--)
        {
            snake_array.push({x: i,y: 0});
        }
    }

    function create_apple()
    {
        // Place aléatoirement une pomme dans le canvas
        apple = {
            x: Math.round(Math.random()*(w-taille_case)/taille_case),
            y: Math.round(Math.random()*(h-taille_case)/taille_case),
        };
    }

    function afficher()
    {
        if(pause == false){
            //Style du canvas
            stage.fillStyle = "white";
            stage.fillRect(0, 0, w, h);
            stage.strokeStyle = "black";
            stage.strokeRect(0, 0, w, h);

            //Position de la tête
            var teteX = snake_array[0].x;
            var teteY = snake_array[0].y;

            //Gestion des directions
            if(direction == "right"){
                teteX++;
            }
            else if(direction == "left"){
                teteX--;
            }
            else if(direction == "down"){
                teteY++;
            }
            else if(direction == "up"){
                teteY--;
            }

            // En cas de collision
            if(teteX == -1 || teteX == w/taille_case || teteY == -1 || teteY == h/taille_case || check_collision(teteX, teteY, snake_array))
            {
                init();
                return;
            }

            //Si le serpent touche la pomme
            if(teteX == apple.x && teteY == apple.y)
            {
                var queue = {x: teteX, y: teteY};
                score += 10;
                $("#score").text(score);
                create_apple();
            }
            else
            {
                var queue = snake_array.pop();
                queue.x = teteX;
                queue.y = teteY;
            }

            snake_array.unshift(queue);

            // On affiche le serpent
            for(var i=0; i < snake_array.length; i++)
            {
                var cell = snake_array[i];
                display_cell(cell.x, cell.y);
            }

            // On affiche la pomme
            display_apple(apple.x, apple.y);
        }
    }

    function display_cell(x,y)
    {
        stage.fillStyle = "green";
        stage.fillRect(x*taille_case, y*taille_case, taille_case, taille_case);
        stage.strokeStyle = "black";
        stage.strokeRect(x*taille_case, y*taille_case, taille_case, taille_case);
    }

    function display_apple(x,y)
    {
        stage.fillStyle = "red";
        stage.fillRect(x*taille_case, y*taille_case, taille_case, taille_case);
        stage.strokeStyle = "darkred";
        stage.strokeRect(x*taille_case, y*taille_case, taille_case, taille_case);
    }

    function check_collision(x, y, array)
    {
        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == x && array[i].y == y)
             return true;
        }
        return false;
    }

    $(document).keydown(function(e){
        var key = e.which;
        if(key == "39" && direction != "left"){
            direction = "right";
        }
        else if(key == "37" && direction != "right"){
            direction = "left";
        }
        else if(key == "38" && direction != "down"){
            direction = "up";
        }
        else if(key == "40" && direction != "up"){
            direction = "down";
        }
        else if(key == "80" && pause == false){  
            pause = true;
        }
        else if(key == "80" && pause == true){
            pause = false;
        }
        else if(key == "32"){
            init();
            return;
        }
    });
});



// function moveRight(){
// //snakeHead will move 20 units to the right.
//     snakeHead.x += 20;
//     //Will cause the circle to wrap back
//     if(snakeHead.x > stage.canvas.width){
//         snakeHead.x = 0;
//     }
//     stage.update();
// }

// function moveLeft(){
// //snakeHead will move 20 units to the left.
//     snakeHead.x -= 20;
//     if(snakeHead.x < 0){
//         snakeHead.x = stage.canvas.width; 
//     }
//     stage.update();
// }

// function moveDown(){
// //snakeHead will move 20 units to the bottom.
//     snakeHead.y += 20;
//     if(snakeHead.y > stage.canvas.height){
//         snakeHead.y = 0; 
//     }
//     stage.update();
// }

// function moveUp(){
// //snakeHead will move 20 units to the top.
//     snakeHead.y -= 20;
//     if(snakeHead.y < 0){
//         snakeHead.y = stage.canvas.height; 
//     }
//     stage.update();
// }

// function handleKeyDown(e){
//     //cross browser issues exist
//     if (!e) {
//         var e = window.event;
//     }
//     var keycode = 
//     switch (e.keyCode) {
//         case KEYCODE_LEFT:
//             if(moveQueue[0] !== 1 || snakeLength === 1){
//                 moveQueue.unshift(3); // Direction : Gauche
//             }
//             break;
//         case KEYCODE_RIGHT:
//             if(moveQueue[0] !== 3 || snakeLength === 1){
//                 moveQueue.unshift(1); // Direction : Droite
//             }
//             break;
//         case KEYCODE_UP:
//             if(moveQueue[0] !== 2 || snakeLength === 1){
//                 moveQueue.unshift(0); // Direction : Haut
//             }
//             break;
//         case KEYCODE_DOWN:
//             if(moveQueue[0] !== 0 || snakeLength === 1){
//                 moveQueue.unshift(2); // Direction : Bas
//             }
//             break;
//     }
// }

// function autoMove()
// {
//     var move = [moveUp,moveRight,moveDown,moveLeft];
//     if(moveQueue.length > 0){
//         var autoDirection = moveQueue[0];
//         move[autoDirection]();
//     }
//     snakePosition = [snakeHead.x, snakeHead.y];
//     if(snakePosition[0] == applePosition[0] && snakePosition[1] == applePosition[1])
//     {
//         stage.removeChild(apple);
//         score += 10;
//         $("#score").text(score);
//         placePomme();
//         plusGrandSnake();
//     }   
// }
// setInterval(autoMove, 150);

// function plusGrandSnake()
// {
//     snake = new createjs.Shape();
//     snake.graphics.beginFill("green").drawRect(0, 0, 20, 20);
//     snake.x = snakePosition[0];
//     snake.y = snakePosition[1];
//     stage.addChild(snake);
//     stage.update();
//     snakeLength++;
// }

// function placePomme()
// {
//     var abs = Math.floor(Math.random()*(stage.canvas.width/20))*20;
//     var ord = Math.floor(Math.random()*(stage.canvas.height/20))*20;
//     apple = new createjs.Shape();
//     apple.graphics.beginFill("red").drawRect(0, 0, 20, 20);
//     apple.x = abs;
//     apple.y = ord;
//     applePosition = [apple.x, apple.y];
//     stage.addChild(apple);
//     stage.update();
//     console.log(applePosition);
// }

// document.onload = placePomme();
