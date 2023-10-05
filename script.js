window.addEventListener('load',function(){
    //canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 800;

    class InputHandler{
        constructor(game){
            this.game = game;
            window.addEventListener('keydown', e => {
                if((e.key === 'ArrowUp' || e.key === 'ArrowDown')
                    && this.game.keys.indexOf(e.key) === -1){
                        this.game.keys.push(e.key);
                    }else if(e.key === 'd'){
                        this.game.debug = !this.game.debug;
                    }
                if(e.key === ' ')
                    this.game.keys.push(e.key);
            });
            window.addEventListener('keyup', e => {
                if(this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                this.game.player.speedY=this.game.player.maxSpeed;}
            });
        }
    }

    class Player{
        constructor(game){
            this.game = game;
            this.width = 200;
            this.height = 125;
            this.x = 20;
            this.y = 300;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 1;
            this.speedY = 0;
            this.maxSpeed = 3;
            this.image = document.getElementById('player');
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpLimit = 10000;
        }

        update(deltaTime){
            //moving the player
            if(this.game.keys.includes(' ')){
                
                this.speedY = -this.maxSpeed * 5 ;
                this.y += this.speedY;
                }
            //else if(this.game.keys.includes('ArrowDown'))
              //  this.speedY = this.maxSpeed;
              else //if(this.game.keys.indexOf() > -1){
            {this.speedY = this.maxSpeed;
            this.y += this.speedY;}
            //this.game.keys.splice(this.game.keys); 
            //setting vertical boundaries
            if(this.y > this.game.height - this.height * 1){
                this.y = this.game.height - this.height * 1;this.game.gameOver = true;}
            else if(this.y < -this.height * 0){
                    this.y = -this.height * 0; this.game.gameOver = true;}
            //animation
            if(this.frameX < this.maxFrame)
                this.frameX++;
            else this.frameX = 0;
            //power up
            if(this.powerUp)
                if(this.powerUpTimer > this.powerUpLimit){
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.frameY = 0;
                }else{
                    this.powerUpTimer += deltaTime;
                    this.frameY = 1;
                    //power up condition
                }
        }

        draw(context){
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height,this.x, this.y, this.width, this.height);
        }

        enterPowerUp(){
            this.powerUpTimer = 0;
            this.powerUp = true;
            //condition
        }
    }

    class Enemy{
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 - 0.5;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 2;
        }

        update(){
            this.x += this.speedX - this.game.speed;
            if(this.x + this.width < 0){
                this.markedForDeletion = true;
            }
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }else this.frameX = 0;
        }

        draw(context){
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height,this.x, this.y, this.width, this.height);
             //context.strokeRect(this.x, this.y, this.width, this.height);
            //if(this.game.debug) context.fillText(this.lives, this.x, this.y);
        }
    }

    class Jellyfish extends Enemy{
        constructor(game){
            super(game);
            this.width = 120;
            this.height = 200;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('jellyfish');
            this.frameY = 0;
            this.lives = 2;
            this.score = this.lives;
        }
    }

    class Background{
        constructor(game){
            this.game = game;
            //get images by id;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            //create new layers
            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.8);
            this.layer3 = new Layer(this.game, this.image3, 1.5);
            this.layers = [this.layer1, this.layer2];
        }

        update(){
            this.layers.forEach(layer => layer.update());
        }

        draw(context){
            this.layers.forEach(layer => layer.draw(context));
        }
    }

    class Layer{
        constructor(game, image, speedModifier){
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 2000;
            this.height = 800;
            this.x = 0;
            this.y = 0;
        }

        update(){
            if(this.x <= -this.width) this.x = 0;
            else this.x -= this.game.speed * this.speedModifier;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }
    }

    class UI{
        constructor(game){
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Calibri';
            this.color = 'white';
        }

        draw(context){
            context.save();
            //display score
            context.fillStyle=this.color;
            context.font = this.fontSize + 'px ' + this.fontFamily;
            context.fillText('Score: ' + this.game.score, 20, 40);
            //game over message
            if(this.game.gameOver){
                context.textAlign = 'center';
                let message1 = 'You lost!', message2 = 'Try again!';
                context.font = '50px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 40);
                context.font = '25px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 40);
            }
            context.restore();
        }
    }

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 10000;
            this.gameOver = false;
            this.score = 0;
            this.speed = 1;
        }

        update(deltaTime){
            this.background.update();
            this.background.layer3.update();
            this.player.update(deltaTime);
            //enemies
            this.enemies.forEach(enemy => {
                enemy.update();
                if(this.checkCollisions(this.player, enemy))
                    if(enemy.type === 'shell') this.player.enterPowerUp();
                    else this.gameOver = true;
                else this.score += 1;
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
            if(this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            }else this.enemyTimer += deltaTime;
        }

        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.background.layer3.draw(context);
            this.enemies.forEach(enemy => {enemy.draw(context)});
        }

        addEnemy(){
            const randomize = Math.random();
            //if(randomize < 0.3)
                this.enemies.push(new Jellyfish(this));
            //else if(randomize < 0.6);
                    //this.enemies.push(new Enemy2(this));
                //else ;//this.enemies.push(new Enemy3(this));
        }

        checkCollisions(rect1, rect2){
            return( rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y)
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    //animation loop
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});
