'use strict'
const canvas = document.querySelector('.snakeCanvas');
const size = 20;
const width = canvas.width = calculateWidth();
const height = canvas.height = calculateHeight();
const backgroundColor = 'rgb(45, 30, 47)';
const foodColor = 'rgb(247, 179, 43)';
const boundaryColor = 'rgb(206, 194, 136)';
const snakeColor = 'rgb(239, 99, 81)';
const headColor = 'rgb(227, 23, 10)';
const poisonColor = 'rgb(250, 201, 184)';
const context = canvas.getContext('2d');
var snake;
var currentFood;
var score = 0;
var highscore = 0;
var poison;

function calculateHeight() {
    if(window.innerHeight%size===0) {
        return window.innerHeight;
    } else {
        return window.innerHeight += (size-(window.innerHeight%size));
    }
}
function calculateWidth() {
    if(window.innerWidth%size===0) {
        return window.innerWidth;
    } else {
        return window.innerWidth -= (window.innerWidth%size);
    }
}

class food {
    xPosition = 0;
    yPosition = 0; 
    hasPoison = false;
    constructor(hasPoison) {
        if(hasPoison) {
            this.hasPoison = hasPoison;
        }
        this.xPosition = 20 + Math.floor(Math.random() * (width-40));
        this.yPosition = 20 + Math.floor(Math.random() * (height-40));
        this.xPosition -= (this.xPosition % size);
        this.yPosition -= (this.yPosition % size);
    }
    draw() {
        this.hasPoison ? context.fillStyle = poisonColor : context.fillStyle = foodColor;
        context.fillRect(this.xPosition, this.yPosition, size, size);
    }
}

class Snake {
    snakebody = [];
    constructor() {
        this.snakebody = [{xPosition:100,yPosition:60}, {xPosition:80,yPosition:60}, {xPosition:60,yPosition:60}, {xPosition:40,yPosition:60}];
    }

    eatFood() {
        let tail = Object.assign({}, this.snakebody[this.snakebody.length-1]);
        this.snakebody.push(tail);
        currentFood = new food();
        score++;
        while(checkInBody(food, snake.snakebody)) {
            currentFood = new food();
        }
        rollPoison();
        drawCanvas();
    }

    move(key) {
        let head = Object.assign({}, this.snakebody[0]);
        switch(key.keyCode) {
            case 39: // Right
                if(this.snakebody[1].xPosition != this.snakebody[0].xPosition+size) {
                    this.snakebody.unshift(head);
                    this.snakebody.pop();
                    this.snakebody[0].xPosition+=size;
                }
                break;
            case 40: // Down
                if(this.snakebody[1].yPosition != this.snakebody[0].yPosition+size) {
                    this.snakebody.unshift(head);
                    this.snakebody.pop();
                    this.snakebody[0].yPosition+=size;
                }
                break;
            case 37: // Left
                if(this.snakebody[1].xPosition != this.snakebody[0].xPosition-size) {
                    this.snakebody.unshift(head);
                    this.snakebody.pop();
                    this.snakebody[0].xPosition-=size;
                }
                break;
            case 38: // Up
                if(this.snakebody[1].yPosition != this.snakebody[0].yPosition-size) { 
                    this.snakebody.unshift(head);
                    this.snakebody.pop();
                    this.snakebody[0].yPosition-=size;
                }
                break;
        }
        drawCanvas();
        if(checkInBody(this.snakebody[0],this.snakebody) || checkBoundary(this.snakebody[0]) || isEatingPoison(this.snakebody[0])) {
            gameOver();
        } else if(this.snakebody[0].xPosition == currentFood.xPosition && this.snakebody[0].yPosition == currentFood.yPosition) {
            snake.eatFood();
        }
    }
}
function isEatingPoison(currentPositon) {
    if(poison && currentPositon.xPosition === poison.xPosition && currentPositon.yPosition === poison.yPosition) {
        return true;
    }
}
function rollPoison() {
    let roll = Math.floor(Math.random()*3);
    if(1 === roll) {
        poison = new food(true);
        poison.draw();
    } else {
        poison = undefined;
    }
}
function checkBoundary(currentPositon) {
    if(currentPositon.xPosition > width-40 || currentPositon.yPosition > height-40 || currentPositon.xPosition < 20 || currentPositon.yPosition < 20) {
        return true;
    }
}

function checkInBody(currentPositon, snake) {
    for(let i=1; i<snake.length; i++) {
        if(currentPositon.xPosition == snake[i].xPosition && currentPositon.yPosition == snake[i].yPosition) {
            return true;
        }
    }
    return false;
}

function drawCanvas() {
    context.clearRect(0,0,width,height);
    context.fillStyle = boundaryColor;
    context.fillRect(0, 0, width, height+20);
    context.fillStyle = backgroundColor;
    context.fillRect(size, size, width-(size*2), (height-(size*2)));
    for(let i=0;i<snake.snakebody.length;i++) {
        if(i==0) {
            context.fillStyle = headColor;
        }
        context.fillRect(snake.snakebody[i].xPosition, snake.snakebody[i].yPosition, size, size);
        context.fillStyle = snakeColor;
    }
    currentFood.draw();
    if(poison) {
        poison.draw();
    }
    context.fillStyle = 'black';
    context.lineWidth = 1;
    context.font = '18px arial';
    context.fillText(`Score : ${score}`, width-100, 17);
}

function startGame() {
    score = 0;
    currentFood = new food();
    snake = new Snake();
    document.onkeydown = snake.move.bind(snake);
    drawCanvas();
    currentFood.draw();
}

function gameOver() {
    if(score >= highscore) {
        highscore = score;
    }
    context.fillStyle = 'red';
    context.lineWidth = 1;
    context.font = '72px arial';
    context.fillText('GAME OVER!', 50, 100);
    context.fillStyle = 'white';
    context.lineWidth = 1;
    context.font = '32px arial';
    context.fillText(`Score : ${score} | Highscore : ${highscore}`, 50, 150);
    context.font = '18px arial';
    context.fillText('Press Spacebar to restart.', 50, 200);
    document.onkeydown = restartGame;
}
function restartGame(key) {
    if(key.keyCode === 32) {
        startGame();
    }
}

startGame();
