//const { json } = require("express");

function draw() {
  const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const maxY = 445;
    const minY = 0;
    const bottomBarrier = 525;
    var x;
    let keys = [];
    var ballInPlay = true;
    //var curSpeed = 10;
    var startSpeed = 10;
    var localPlayer;
    var opponent;
    var queueGameLoop = false;

    const score = {
      font: "48px sans-serif",
      player1Score: 0,
      player2Score: 0,
      draw() {
        ctx.fillStyle = "rgb(0, 0, 0)";
        //let scoreWidth1 = ctx.measureText(this.player1Score); // player 1 score width
        //let scoreWidth2 = ctx.measureText(this.player2Score); // player 2 score width
        ctx.font = this.font;
        ctx.fillText(this.player1Score, 429 - 20 * 1.5, 40);
        ctx.fillText(this.player2Score, 429 + 10 * 0.5, 40);
      },
    };

    const ball = {
      x: 422,
      y: 254,
      vx: startSpeed,
      vy: 0,
      draw() {
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(this.x, this.y, 15, 15);
      },
    };

    const player1 = {
      x: 10,
      y: 222,
      moveY: 0, //y axis is from top of canvas
      draw() {
        ctx.fillStyle = "rgb(200, 0, 0)";
        ctx.fillRect(this.x, this.y, 15, 80);
      },
    };

    const player2 = {
      x: 833,
      y: 222,
      moveY: -5, //y axis is from top of canvas
      draw() {
        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect(this.x, this.y, 15, 80);
      },
    };

    const queuePlayer = {
      x: 0,
      y: 0,
      moveY: 0, //y axis is from top of canvas
      draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(this.x, this.y, 0, 0);
      },
    };

    function drawMidLine() {
      let y = 0;
      ctx.beginPath();
      ctx.moveTo(429, y);

      while (y < 525) {
        y += 30;
        ctx.lineTo(429, y);
        y += 20;
        ctx.moveTo(429, y);
        ctx.stroke();
      }

      y = 0;
      ctx.beginPath();
      ctx.moveTo(25, y);
      ctx.lineTo(25, 525);
      ctx.stroke();

      y = 0;
      ctx.beginPath();
      ctx.moveTo(833, 0);
      ctx.lineTo(833, 525);
      ctx.stroke();

    }

    function ballReset() {
      ballInPlay = false;

      ball.vx = 0;
      ball.vy = 0;
      //startSpeed = -startSpeed;

      setTimeout(() => {
        ball.x = 422;
        ball.y = 254;
        ball.vx = startSpeed;
        ball.vy = 0;
        ball.draw;

      }, 500);
    }

    function whatKey() {
      /*
      if (keys["KeyW"] && keys["KeyS"]) {
        player1.moveY = 0;
      } else if (keys["KeyW"] && !keys["KeyS"]) {
        player1.moveY = -8;
      } else if (!keys["KeyW"] && keys["KeyS"]) {
        player1.moveY = 8;
      } else {
        player1.moveY = 0;
      }
      */

      if (keys["ArrowUp"] && keys["ArrowDown"]) {
        localPlayer.moveY = 0;
      } else if (keys["ArrowUp"] && !keys["ArrowDown"]) {
        localPlayer.moveY = -8;
      } else if (!keys["ArrowUp"] && keys["ArrowDown"]) {
        localPlayer.moveY = 8;
      } else {
        localPlayer.moveY = 0;
      }
    }

    function gameLoop() {
      whatKey();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //keep player1 in barrier
      localPlayer.y += localPlayer.moveY;
      if (localPlayer.y > maxY) {
        localPlayer.y = maxY;
      } else if (localPlayer.y < minY) {
        localPlayer.y = minY;
      }

      /*
      //keep player2 in barrier
      player2.y += player2.moveY;
      if (player2.y > maxY) {
        player2.y = maxY;
      } else if (player2.y < minY) {
        player2.y = minY;
      }
      */

      if(socket.readyState == socket.OPEN){
        let messageBody = { player1: player1.y, player2: player2.y };
        socket.send(JSON.stringify(messageBody));
      }

      if (ballInPlay) {
        //ball position
        ball.x += ball.vx;
        ball.y += ball.vy;

        //collision on left side
        if (ball.x <= player1.x + 15) {
          ball.x = player1.x + 15;
          //if (ball.y >= player1.y - 14 && ball.y <= player1.y + 94) {
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
          /*} else {
            ballInPlay = false;
            score.player2Score += 1;
            if (score.player2Score == 5) {
              //return;
            }
            ball.vx = 0;
            ball.vy = 0;
            ballReset();
          }*/
        }
      }

      if (ballInPlay) {
        //collision on right side
        if (ball.x + 15 >= player2.x) {
          ball.x = player2.x - 15;
          //if (ball.y >= player2.y - 14 && ball.y <= player2.y + 94) {
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
          /*} else {
            ballInPlay = false;
            score.player1Score += 1;
            if (score.player1Score == 5) {
              //return;
            }
            ball.vx = 0;
            ball.vy = 0;
            ballReset();
          }*/
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

      ball.draw();
      drawMidLine();
      player1.draw();
      player2.draw();
      score.draw();
      x = window.requestAnimationFrame(gameLoop);
    }

    drawMidLine();
    ball.draw();
    player1.draw();
    player2.draw();
    score.draw();
  

    const socket = new WebSocket("ws://192.168.1.143:7071/ws");

    socket.addEventListener('close', (event) => {
      console.log('The connection has been closed successfully.');
    });

    socket.addEventListener('open', (event) => {
      //alert("socket opened");
    });

    socket.addEventListener('message', (event) => {

      message = JSON.parse(event.data);
      //alert(event.data);

      if(message.type === "ball"){
        ball.x = parseInt(message.x);
        ball.y = parseInt(message.y);
        ball.vx = parseInt(message.ballvx);
        ball.vy = parseInt(message.ballvy);
        //alert(message.ballvx);
      }

      if (message.type === "movement") {
        if (localPlayer == player1) {
          if (!isNaN(parseInt(message.player2))) {
            opponent.y = parseInt(message.player2);
          }
        } else if(localPlayer == player2){
          if (!isNaN(parseInt(message.player1))) {
            opponent.y = parseInt(message.player1);
          }
        }
      }

      if(message.type === "queuePlayers"){
        //alert("queue");
        localPlayer = queuePlayer;
           //gameloop is changing localPlayer so this is not moving player1 or 2
        if (!isNaN(parseInt(message.player1)) && !isNaN(parseInt(message.player2))) {
          //alert(message.player1);
          player1.y = parseInt(message.player1);
          player2.y = parseInt(message.player2);

        }
      }

      if(message.type === "player1"){
        localPlayer = player1;
      }else if(message.type ==="player2"){
        localPlayer = player2;
      }

      if (message.type === "player1" || message.type === "player2") {
        canvas.addEventListener("keydown", (event) => {
          keys[event.code] = true;
        });

        canvas.addEventListener("keyup", (event) => {
          keys[event.code] = false;
        });
      }

      if(message.type === "opponent"){
        if(localPlayer == player1){
          opponent = player2;
          //alert("op is 2")
        }else{
          opponent = player1;
          //alert("op is 1")
        }
      }

      if(message.type === "start"){
        //alert("start");
        //setTimeout(() => {
          //socket.close();
        ballInPlay = true;
        gameLoop();
        //}, 1000);
      }

      if(message.type === "start2"){
        ballInPlay = true;
      
      }

      if (message.type == "score") {
        if (localPlayer == queuePlayer) {
          if (!queueGameLoop) {
            //alert("queue")
            queueGameLoop = true;
            ballInPlay = true;
            gameLoop();
          }
        }

        ballReset();
        startSpeed = parseInt(message.ballSpeed);
        score.player1Score = parseInt(message.player1);
        score.player2Score = parseInt(message.player2);
      }

    });


    /*
    (async function () {
      const ws = await connectToServer();

      ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        const cursor = getOrCreateCursorFor(messageBody);
        cursor.style.transform = `translate(${messageBody.x}px, ${messageBody.y}px)`;
      };

      canvas.addEventListener("keydown", (event) => {
        if(event.code == "ArrowUp" || event.code == "ArrowDown") {
          const messageBody = { x: player2.y };
          ws.send(JSON.stringify(messageBody));
        }
      });

      canvas.addEventListener("keyup", (event) => {
        if(event.code == "ArrowUp" || event.code == "ArrowDown") {
          const messageBody = { x: player2.y };
          ws.send(JSON.stringify(messageBody));
        }
      });
      

      function getOrCreateCursorFor(messageBody) {
        const sender = messageBody.sender;
        const existing = document.querySelector(`[data-sender='${sender}']`);
        if (existing) {
          return existing;
        }

        const template = document.getElementById("cursor");
        const cursor = template.content.firstElementChild.cloneNode(true);
        const svgPath = cursor.getElementsByTagName("path")[0];

        cursor.setAttribute("data-sender", sender);
        svgPath.setAttribute("fill", `hsl(${messageBody.color}, 50%, 50%)`);
        document.body.appendChild(cursor);

        return cursor;
      }
    })();
    */
  }
}
