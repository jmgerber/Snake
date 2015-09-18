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
    var tab_score = [];

    $(".choix").click(function(){
        $("#canvas").css("display", "block");
        $("#choix-diff").css("display", "none");
        $("#btn-choix").css("display", "inline");
        difficulty = $(this).attr('id');
        init();
    });

    $("#btn-choix").click(function(){
        $(this).css("display", "none");
        $("#canvas").css("display", "none");
        $("#choix-diff").css("display", "block");
        score = 0;
        $("#score").text(score);
    });
    

    function init()
    {
        // Initialisation du jeu
        pause = false;
        direction = "right";
        create_snake();
        create_apple();
        score = 0;
        $("#score").text(score);
        if(typeof(game_loop) != "undefined"){
            clearInterval(game_loop);
        }
        // Boucle de jeu
        if(difficulty == "facile"){ 
            game_loop = setInterval(afficher, 150);
        }
        else if(difficulty == "moyen"){
            game_loop = setInterval(afficher, 100);
        }
        else if(difficulty == "difficile"){
            game_loop = setInterval(afficher, 50);
        }
    }

    function create_snake()
    {
        // Créer le serpent
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
            stage.strokeStyle = "red";
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
                if(score>0){
                    tab_score.unshift(score);
                    if(tab_score.length>5){
                        tab_score.pop();
                    }
                    for(var j=0; j<=5; j++){
                        $("#score"+j).text(tab_score[j]);
                        console.log("#score"+j);
                        console.log(tab_score[j]);
                    }
                }
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
                randColor = ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
                var cell = snake_array[i];
                display_cell(cell.x, cell.y);
            }

            // On affiche la pomme
            display_apple(apple.x, apple.y);
        }
    }

    function display_cell(x,y)
    {
        //Défini le style du corps
        stage.fillStyle = "#"+randColor;
        stage.fillRect(x*taille_case, y*taille_case, taille_case, taille_case);
        stage.strokeStyle = "black";
        stage.strokeRect(x*taille_case, y*taille_case, taille_case, taille_case);
    }

    function display_apple(x,y)
    {
        // Défini le style de la pomme
        stage.beginPath();
        stage.arc(x*taille_case+10, y*taille_case+10, 10, 0, 2 * Math.PI, false);
        stage.fillStyle = "red";
        stage.fill();
        stage.strokeStyle = "darkred";
        stage.stroke();
    }

    function check_collision(x, y, array)
    {
        // Vérification d'une collision avec le corps
        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == x && array[i].y == y)
             return true;
        }
        return false;
    }

    // Gestion des touches du clavier
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