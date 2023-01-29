var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var WebSocket = require('ws');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { count } = require('console');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





var wss = new WebSocket.Server({ port: 7071});

var players = Array();
wss.on('connection', (ws) => {
  players.push(ws);
  
  console.log(players.length +" Players Connected");

  if(players.length === 1){
    let messageBody = { type: "player1" };
    ws.send(JSON.stringify(messageBody));
  }else if(players.length === 2){
    let messageBody = { type: "player2" };
    ws.send(JSON.stringify(messageBody));

    
    messageBody.type = "opponent";
    players[1].send(JSON.stringify(messageBody));
    players[0].send(JSON.stringify(messageBody));

    messageBody.type = "start";
    players[1].send(JSON.stringify(messageBody));
    players[0].send(JSON.stringify(messageBody));

    gameLoop();
  }
  
  //else{
    //ws.send("player "+ players.length);
  //}


  ws.on('message', (messageAsString) => {
    const message = JSON.parse(messageAsString);
    //console.log(message);

    let i = players.indexOf(ws);
    message.type = "movement";
    if(i == 0){
      player1.y = message.player1;
      players[1].send(JSON.stringify(message)); 
      //console.log(message.player2);
    }else if(i == 1){
      player2.y = message.player2;
      players[0].send(JSON.stringify(message)); 
    }
    
    message.type = "queuePlayers";
    players.forEach(player => {
      if(player == players[0] || player == players[1]){
        return;
      }

      player.send(JSON.stringify(message))
      //console.log(message);
    });
    

    //[...clients.keys()].forEach((client) => {
      //client.send(JSON.stringify(message));
    //});
  });

  ws.on("close", () => {
    let player = players.indexOf(ws);
    if(player !== -1) {
      players.splice(player, 1);
      console.log("player disconnected");
      console.log(players.length +" Players Connected");
    }
   
  });
});

console.log("wss up");

const maxY = 445;
const minY = 0;
const bottomBarrier = 525;
var ballInPlay = true;
var startSpeed = 10;

var player1Score = 0;
var player2Score = 0;

const ball = {
  x: 422,
  y: 254,
  vx: startSpeed,
  vy: 0
}

const player1 = {
  x: 10,
  y: 222,
  vy: 0
}

const player2 = {
  x: 833,
  y: 222,
  vy: 0
}


function gameLoop() {
  setInterval(function () {
    if (ballInPlay) {
      //ball position
      ball.x += ball.vx;
      ball.y += ball.vy;

      //collision on left side
      if (ball.x <= player1.x + 15) {
        ball.x = player1.x + 15;
        if (ball.y >= player1.y - 14 && ball.y <= player1.y + 94) {
          ball.vx = -ball.vx;// * 1.05;

          //curSpeed = ball.vx;

          if (ball.y < player1.y + 5) {
            ball.vy = -5;
          } else if (ball.y < player1.y + 15) {
            ball.vy = -4;
          } else if (ball.y < player1.y + 25) {
            ball.vy = -3;
          } else if (ball.y < player1.y + 35) {
            ball.vy = -2;
          } else if (ball.y >= player1.y + 35 && ball.y <= player1.y + 40) {
            ball.vy = -1;
          } else if (ball.y > player1.y + 40 && ball.y <= player1.y + 45) {
            ball.vy = 1;
          } else if (ball.y > player1.y + 45 && ball.y <= player1.y + 55) {
            ball.vy = 2;
          } else if (ball.y > player1.y + 55 && ball.y <= player1.y + 65) {
            ball.vy = 3;
          } else if (ball.y > player1.y + 65 && ball.y <= player1.y + 75) {
            ball.vy = 4;
          } else if (ball.y > player1.y + 75 && ball.y <= player1.y + 94) {
            ball.vy = 5;
          }
          
          let messageBody = { type: "ball", x: ball.x + ball.vx, y: ball.y + ball.vy, ballvx: ball.vx, ballvy: ball.vy};
          players[0].send(JSON.stringify(messageBody));
          players[1].send(JSON.stringify(messageBody));

          players.forEach(player => {
            if(player == players[0] || player == players[1]){
              return;
            }
      
            player.send(JSON.stringify(messageBody));
            //console.log(message);
          });


        } else {
          ballInPlay = false;
          player2Score += 1;
          if (player2Score == 5) {
            //return;
          }
          ball.vx = 0;
          ball.vy = 0;
          ballReset("player2");
        }
      }
    }

    if (ballInPlay) {
      //collision on right side
      if (ball.x + 15 >= player2.x) {
        ball.x = player2.x - 15;
        if (ball.y >= player2.y - 14 && ball.y <= player2.y + 94) {
          ball.vx = -ball.vx;// * 1.05;
          //curSpeed = ball.vx;

          if (ball.y < player2.y + 5) {
            ball.vy = -5;
          } else if (ball.y < player2.y + 15) {
            ball.vy = -4;
          } else if (ball.y < player2.y + 25) {
            ball.vy = -3;
          } else if (ball.y < player2.y + 35) {
            ball.vy = -2;
          } else if (ball.y >= player2.y + 35 && ball.y <= player2.y + 40) {
            ball.vy = -1;
          } else if (ball.y > player2.y + 40 && ball.y <= player2.y + 45) {
            ball.vy = 1;
          } else if (ball.y > player2.y + 45 && ball.y <= player2.y + 55) {
            ball.vy = 2;
          } else if (ball.y > player2.y + 55 && ball.y <= player2.y + 65) {
            ball.vy = 3;
          } else if (ball.y > player2.y + 65 && ball.y <= player2.y + 75) {
            ball.vy = 4;
          } else if (ball.y > player2.y + 75 && ball.y <= player2.y + 94) {
            ball.vy = 5;
          }

          let messageBody = { type: "ball", x: ball.x + ball.vx, y: ball.y + ball.vy, ballvx: ball.vx, ballvy: ball.vy};
          players[0].send(JSON.stringify(messageBody));
          players[1].send(JSON.stringify(messageBody));

          players.forEach(player => {
            if(player == players[0] || player == players[1]){
              return;
            }
      
            player.send(JSON.stringify(messageBody));
            //console.log(message);
          });

        } else {
          ballInPlay = false;
          player1Score += 1
          if (player1Score == 5) {
            //return;
          }
          ball.vx = 0;
          ball.vy = 0;
          ballReset("player1");
        }
      }
    }
    if (ballInPlay) {
      //collision on top or bottom
      if (ball.y >= bottomBarrier - 15) {
        ball.y = bottomBarrier - 15;
        ball.vy = -ball.vy;
      } else if (ball.y <= minY) {
        ball.y = minY;
        ball.vy = -ball.vy;
      }
    }


  }, 1000 / 60);
}

function ballReset(scorer) {

  startSpeed = -startSpeed;
  ball.x = 422;
  ball.y = 254;
  ball.vx = startSpeed;
  ball.vy = 0;

  let messageBody = { type: "score", scorer: scorer, player1: player1Score, player2: player2Score, ballSpeed: startSpeed};
  players[0].send(JSON.stringify(messageBody));
  players[1].send(JSON.stringify(messageBody));

  players.forEach(player => {
    if(player == players[0] || player == players[1]){
      return;
    }

    player.send(JSON.stringify(messageBody));
    console.log(messageBody);
  });


  setTimeout(() => {
    messageBody.type = "start2";
    players[1].send(JSON.stringify(messageBody));
    players[0].send(JSON.stringify(messageBody));

    players.forEach(player => {
      if(player == players[0] || player == players[1]){
        return;
      }

      player.send(JSON.stringify(messageBody));
      console.log(messageBody);
    });

    ballInPlay = true;

  }, 1000);

}





app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
