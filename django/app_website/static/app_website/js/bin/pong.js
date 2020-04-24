/**
 * pong program
 */

function Pong() {
  var _ = this;
  _.NAME = 'pong';

  // --------------------------------------------------------------------------
  // global variables
  // --------------------------------------------------------------------------
  MAX_SCORE          = 10;
  BACKGROUND_COLOR   = '#000';
  FOREGROUND_COLOR   = '#ffffff';
  CANVAS_WIDTH       = 1400;
  CANVAS_HEIGHT      = 1000;
  BALL_SPEED         = 9;
  BALL_WIDTH         = 18;
  BALL_HEIGHT        = 18;
  PADDLE_WIDTH       = 18;
  PADDLE_HEIGHT      = 70;
  PADDLE_OFFSET_X    = 50;
  PLAYER1_SPEED      = 8;
  PLAYER2_SPEED      = 8;
  MENU_FONT          = '30px Courier New';
  MENU_WIDTH         = 1100;
  MENU_HEIGHT        = 40;
  MENU_OFFSET_Y      = 10;
  MENU_TEXT          = 'press any key to begin | w/s or up/down to move | q to quit';
  GAME_OVER_TEXT     = 'GAME OVER... ';
  GAME_OVER_FONT     = '50px Courier New';
  GAME_OVER_WIDTH    = 600;
  GAME_OVER_HEIGHT   = 100;
  GAME_OVER_OFFSET_Y = 15;
  GAME_OVER_DELAY    = 4000;
  SCORE_FONT         = '100px Courier New';
  SCORE_OFFSET_X     = 150;
  SCORE_OFFSET_Y     = 100;
  NET_WIDTH          = 5;
  NET_SPACE_LENGTH   = 10;
  NET_DASH_LENGTH    = 7;
  MOVE = {
    IDLE:  0,
    UP:    1,
    DOWN:  2,
    LEFT:  3,
    RIGHT: 4,
  };
  SIDE = {
    LEFT: 0,
    RIGHT: 1,
  };

  // --------------------------------------------------------------------------
  // game objects
  // --------------------------------------------------------------------------

  var Ball = function() {
    this.width = BALL_WIDTH;
    this.height = BALL_HEIGHT;
    this.x = (_.canvas.width / 2) - (BALL_WIDTH / 2);
    this.y = (_.canvas.height / 2) - (BALL_HEIGHT / 2);
    this.moveX = MOVE.IDLE;
    this.moveY = MOVE.IDLE;
    this.speed = BALL_SPEED;
  }

  var Player = function (side, speed) {
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.x = (side === SIDE.LEFT) ? PADDLE_OFFSET_X : _.canvas.width - PADDLE_OFFSET_X;
    this.y = (_.canvas.height / 2) - (PADDLE_HEIGHT / 2);
    this.score = 0;
    this.move = MOVE.IDLE;
    this.speed = speed ;
  }

  // --------------------------------------------------------------------------
  // game functions
  // --------------------------------------------------------------------------

  function is_collision(o1_x1, o1_x2, o1_y1, o1_y2, o2_x1, o2_x2, o2_y1, o2_y2) {
    // builds a hit box around 2 objects 1 & 2 with 2 (x,y) coordinates ands looks for collision
    if (((o1_x1 <= o2_x1) && (o2_x1 <= o1_x2)) || ((o1_x1 <= o2_x2) && (o2_x2 <= o1_x2))) {
      if (((o1_y1 <= o2_y1) && (o2_y1 <= o1_y2)) || ((o1_y1 <= o2_y2) && (o2_y2 <= o1_y2))) {
        return true;
      }
    }
    return false;
  }

  function init() {
    _.ctx = _.canvas.getContext('2d');
    _.canvas.width = CANVAS_WIDTH;
    _.canvas.height = CANVAS_HEIGHT;
    _.canvas.style.width = (_.canvas.width / 2) + 'px';
    _.canvas.style.height = (_.canvas.height / 2) + 'px';
    _.player1 = new Player(SIDE.LEFT, PLAYER1_SPEED);
    _.player2 = new Player(SIDE.RIGHT, PLAYER2_SPEED);
    _.ball = new Ball();
    _.running = false;
    _.game_over = false;
  }

  function draw() {
    // clear canvas
    _.ctx.clearRect(0, 0, _.canvas.width, _.canvas.height);
    // fill background
    _.ctx.fillStyle = BACKGROUND_COLOR;
    _.ctx.fillRect(0, 0, _.canvas.width, _.canvas.height);
    // fill game objects (paddles and ball):
    _.ctx.fillStyle = FOREGROUND_COLOR;
    _.ctx.fillRect(_.player1.x, _.player1.y, _.player1.width, _.player1.height);
    _.ctx.fillRect(_.player2.x, _.player2.y, _.player2.width, _.player2.height);
    _.ctx.fillRect(_.ball.x, _.ball.y, _.ball.width, _.ball.height);
    // fill net
    _.ctx.beginPath();
    _.ctx.setLineDash([NET_DASH_LENGTH, NET_SPACE_LENGTH]);
    _.ctx.moveTo((_.canvas.width / 2), 0);
    _.ctx.lineTo((_.canvas.width / 2), _.canvas.height);
    _.ctx.lineWidth = NET_WIDTH;
    _.ctx.strokeStyle = FOREGROUND_COLOR;
    _.ctx.stroke();
    // set canvas text
    _.ctx.font = SCORE_FONT;
    _.ctx.textAlign = 'center';
    // fill scores
    _.ctx.fillText(_.player1.score.toString(), (_.canvas.width / 2) - SCORE_OFFSET_X, SCORE_OFFSET_Y);
    _.ctx.fillText(_.player2.score.toString(), (_.canvas.width / 2) + SCORE_OFFSET_X, SCORE_OFFSET_Y);
    // if game has not started yet, draw the start menu
    if (!_.running) {
      _.ctx.font = MENU_FONT;
      _.ctx.fillStyle = BACKGROUND_COLOR;
      _.ctx.fillRect((_.canvas.width - MENU_WIDTH) / 2, (_.canvas.height - MENU_HEIGHT) / 2, MENU_WIDTH, MENU_HEIGHT);
      _.ctx.fillStyle = FOREGROUND_COLOR;
      _.ctx.textAlign = 'center';
      _.ctx.fillText(MENU_TEXT, (_.canvas.width / 2), (_.canvas.height / 2) + MENU_OFFSET_Y);
    }
    // check for a game over banner
    if (_.game_over) {
      _.ctx.font = GAME_OVER_FONT;
      _.ctx.fillStyle = BACKGROUND_COLOR;
      _.ctx.fillRect((_.canvas.width - GAME_OVER_WIDTH) / 2, (_.canvas.height - GAME_OVER_HEIGHT) / 2, GAME_OVER_WIDTH, GAME_OVER_HEIGHT);
      _.ctx.fillStyle = FOREGROUND_COLOR;
      _.ctx.textAlign = 'center';
      var winner = (_.player1.score === MAX_SCORE) ? 'You Win!' : 'You Lose!';
      _.ctx.fillText(GAME_OVER_TEXT + winner , (_.canvas.width / 2), (_.canvas.height / 2) + GAME_OVER_OFFSET_Y);
    }
  }

  function update() {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // update running game state
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (!_.game_over) {
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // check for a loss
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // player1 loss
      if (_.ball.x <= 0) {
        // update score and reset ball
        _.player2.score++;
        _.ball = new Ball();
      }
      // player2 loss
      if (_.ball.x >= (_.canvas.width - _.ball.width)) {
        // update score and reset ball
        _.player1.score++;
        _.ball = new Ball();
      }
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // update ball direction
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if ball is idle, then we are starting a new turn
      if ((_.ball.moveX == MOVE.IDLE) && (_.ball.moveY == MOVE.IDLE)) {
        // pick random direction
        _.ball.moveX = [MOVE.LEFT, MOVE.RIGHT][Math.round(Math.random())];
        _.ball.moveY = [MOVE.UP, MOVE.DOWN][Math.round(Math.random())];
      }
      // check for ball side collisions
      if (_.ball.y <= 0) {
        _.ball.moveY = MOVE.DOWN;
      }
      if (_.ball.y >= (_.canvas.height - _.ball.height)) {
        _.ball.moveY = MOVE.UP;
      }
      // player 1 collision with ball
      if (is_collision(_.player1.x, _.player1.x + _.player1.width, _.player1.y, _.player1.y + _.player1.height,
                       _.ball.x, _.ball.x + _.ball.width, _.ball.y, _.ball.y + _.ball.height)) {
        _.ball.moveX = MOVE.RIGHT;
      }
      // player 2 collision with ball
      if (is_collision(_.player2.x, _.player2.x + _.player2.width, _.player2.y, _.player2.y + _.player2.height,
                       _.ball.x, _.ball.x + _.ball.width, _.ball.y, _.ball.y + _.ball.height)) {
        _.ball.moveX = MOVE.LEFT;
      }
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // update player 1 location
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (_.player1.move === MOVE.UP) {
        _.player1.y -= _.player1.speed;
      }
      if (_.player1.move === MOVE.DOWN) {
        _.player1.y += _.player1.speed;
      }
      // prevent going out of bounds
      if (_.player1.y <= 0) {
        _.player1.y = 0;
      }
      if (_.player1.y >= (_.canvas.height - _.player1.height)) {
        _.player1.y = _.canvas.height - _.player1.height;
      }
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // update player 2 location (AI)
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (_.ball.moveX === MOVE.RIGHT) {
        // move towards the ball
        if ((_.player2.y + (_.player2.height / 2)) < (_.ball.y + (_.ball.height / 2))) {
          _.player2.y += _.player2.speed;
        } else if ((_.player2.y + (_.player2.height / 2)) > (_.ball.y + (_.ball.height / 2))) {
          _.player2.y -= _.player2.speed;
        }
      } else {
        // if the ball is not moving at the player, move back to center field
        if ((_.player2.y + (_.player2.height / 2)) < (_.canvas.height / 2)) {
          _.player2.y += _.player2.speed;
        } else if ((_.player2.y + (_.player2.height / 2)) > (_.canvas.height / 2)) {
          _.player2.y -= _.player2.speed;
        }
      }
      // prevent going out of bounds
      if (_.player2.y <= 0) {
        _.player2.y = 0;
      }
      if (_.player2.y >= (_.canvas.height - _.player2.height)) {
        _.player2.y = _.canvas.height - _.player2.height;
      }
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // update ball location
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (_.ball.moveY === MOVE.UP) {
        _.ball.y -= _.ball.speed;
      }
      if (_.ball.moveY === MOVE.DOWN) {
        _.ball.y += _.ball.speed;
      }
      if (_.ball.moveX === MOVE.LEFT) {
        _.ball.x -= _.ball.speed;
      }
      if (_.ball.moveX === MOVE.RIGHT) {
        _.ball.x += _.ball.speed;
      }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // check for a game over
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if ((_.player1.score === MAX_SCORE) || (_.player2.score === MAX_SCORE)) {
      _.game_over = true;
      // display the game over banner until the delay and restart the game
      _.kern.thread(_.NAME, null, GAME_OVER_DELAY, function () {
        init();
        draw();
      });
    }
  }

  function quit() {
    _.kern.log('INFO').write('pong: exiting ...').flush();
    // prevent more animation
    _.running = false;
    // remove current canvas
    _.canvas.parentNode.removeChild(_.canvas);
    // show monitor
    _.kern.monitor_show();
    // exit program
    _.kern.exit(_.NAME);
  }

  // --------------------------------------------------------------------------
  // game threads
  // --------------------------------------------------------------------------

  function thread_touchscreen() {
    // display error message and exit
    _.kern.log('ERROR').write('pong: touchscreen devices not supported.').flush();
    quit();
  }

  function thread_canvas() {
    // only animate if game has started
    if (_.running) {
      // update UI state
      update();
      // draw new UI state
      draw();
      // if not game over, load thread again
      if (!_.game_over) {
        requestAnimationFrame(thread_canvas);
      }
    }
  }

  function thread_keyboard_press(e) {
    // check if we have started
    if (!_.running) {
      _.running = true;
      // register GUI animation thread
      window.requestAnimationFrame(thread_canvas);
    }
    // check for up arrow or w
    if ((e.keyCode === 38) || (e.keyCode === 87)) {
      _.player1.move = MOVE.UP;
    }
    // check for down arrow or s
    if ((e.keyCode === 40) || (e.keyCode === 83)) {
      _.player1.move = MOVE.DOWN;
    }
    // check for q
    if (e.keyCode === 81) {
      // spawn immediate one shot thread to end game
      _.kern.thread(_.NAME, null, 0, quit);
    }
  }

  function thread_keyboard_idle(e) {
    // prevent player from moving when no keys are pressed
    _.player1.move = MOVE.IDLE;
  }

  // --------------------------------------------------------------------------
  // game main()
  // --------------------------------------------------------------------------

  _.main = function (kern, argv) {
    _.kern = kern;
    _.kern.log('INFO').write('pong: starting ...').flush();
    _.canvas = document.createElement('canvas');
    // hide monitor to display game canvas
    _.kern.monitor_hide();
    // init game
    init();
    draw();
    document.body.appendChild(_.canvas);
    // spawn game event threads
    _.kern.thread(_.NAME, window, 'touchstart', thread_touchscreen);
    _.kern.thread(_.NAME, document, 'keydown', thread_keyboard_press);
    _.kern.thread(_.NAME, document, 'keyup', thread_keyboard_idle);
  }
}