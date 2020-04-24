/**
 * shell program (does not exit)
 */

function Shell() {
  var _ = this;                // save current context
  _.NAME = 'shell';            // name of this program

  // --------------------------------------------------------------------------
  // global variables
  // --------------------------------------------------------------------------

  SHELL_HISTORY = 20;          // number of commands remembered for shell
  EXEC_DELAY = 100;            // delay between user enter and shell exec of command
  PROMPT_COLOR = 'color_lime'; // prompt color

  // --------------------------------------------------------------------------
  // internal functions
  // --------------------------------------------------------------------------

  // dynamically creates the user prompt for the shell:
  // <div class="prompt_wrapper hidden">
  //   <div class="prompt_user"></div>
  //   <input type="text" class="prompt">
  // </div>
  function init_prompt(username, ip) {
    // check if prompt already exists
    if (_.prompt_wrapper) {
      // delete old prompt
      _.prompt_wrapper.parentNode.removeChild(_.prompt_wrapper);
    } else {
      // if not already loaded, load keystroke thread and prompt thread
      _.kern.thread(_.NAME, window, 'resize', thread_prompt_size);
      _.kern.thread(_.NAME, document, 'keydown', thread_keyboard);
      _.kern.thread(_.NAME, document, 'keyup', thread_prompt_focus);
    }
    _.prompt_wrapper = document.createElement('div');
    _.prompt_user = document.createElement('div');
    _.prompt = document.createElement('input');
    _.prompt_wrapper.appendChild(_.prompt_user);
    _.prompt_wrapper.appendChild(_.prompt);
    _.prompt.classList.add('prompt');
    _.prompt_user.classList.add('prompt_user');
    _.prompt_user.classList.add(PROMPT_COLOR);
    _.prompt_wrapper.classList.add('prompt_wrapper');
    // set prompt user and ip
    _.prompt_user.innerHTML = username + '@' + ip + '$&nbsp;';
    // add to DOM
    document.body.appendChild(_.prompt_wrapper);
    // run thread once to set prompt size correctly before a resize
    _.kern.thread(_.NAME, null, EXEC_DELAY, thread_prompt_size);
    _.kern.thread(_.NAME, null, EXEC_DELAY, thread_prompt_focus);
  }

  // sets up shell data structures to remember shell history
  function init_history() {
    // command history state buffers
    _.shell_history_idx = 0;
    _.shell_buf_idx = _.shell_history_idx;
    _.shell_history = new Array(SHELL_HISTORY);
    for (var i = _.shell_history.length - 1; i >= 0; i--) {
      _.shell_history[i] = null;
    }
  }

  // --------------------------------------------------------------------------
  // threads
  // --------------------------------------------------------------------------

  // handles user keystrokes
  function thread_keyboard(e) {
    // only run thread if prompt visible
    if (_.prompt_wrapper && !_.prompt_wrapper.classList.contains('hidden')) {
      switch (e.keyCode) {
        case 38: // ~~~ up arrow ~~~
          // get prev value from history if valid (non-null)
          var temp = (_.shell_buf_idx + SHELL_HISTORY - 1) % SHELL_HISTORY;
          if (_.shell_history[temp]) {
            _.shell_buf_idx = temp;
          }
          _.prompt.value = _.shell_history[_.shell_buf_idx];
          break;
        case 40: // ~~~ down arrow ~~~
          // get next value from history if valid (non-null)
          var temp = (_.shell_buf_idx + 1) % SHELL_HISTORY;
          if (_.shell_history[temp]) {
            _.shell_buf_idx = temp;
          }
          _.prompt.value = _.shell_history[_.shell_buf_idx];
          break;
        case 13: // ~~~ enter ~~~
          var args = _.prompt.value.split(' ');
          // add value to history
          _.shell_history[_.shell_history_idx % SHELL_HISTORY] = _.prompt.value;
          _.shell_history_idx++;
          // log command to monitor history
          _.kern.write(_.username + '@' + _.ip + '$&nbsp;', [PROMPT_COLOR]);
          _.kern.write(_.kern.sanitize(_.prompt.value)).flush(); // sanitize user input ;)
          // reset prompt and history slot
          _.prompt.value = '';
          _.shell_buf_idx = _.shell_history_idx;
          _.shell_history[_.shell_history_idx % _.SHELL_HISTORY] = '';
          // "fork()" user command into a new thread
          _.kern.thread(_.NAME, null, EXEC_DELAY, function () {
            _.kern.exec(args[0], args.splice(1));
          });
          break;
      }
    }
  }

  // handles prompt resizing due to monitor size
  function thread_prompt_size() {
    if (_.prompt_wrapper && !_.prompt_wrapper.classList.contains('hidden')) {
      var width = _.kern.monitor_width() - _.prompt_user.clientWidth;
      _.prompt.style.width = width.toString() + 'px';
    }
  }

  // keeps prompt in focus when shell is active
  function thread_prompt_focus() {
    if (_.prompt_wrapper && !_.prompt_wrapper.classList.contains('hidden')) {
      _.prompt.focus();
    } else {
      _.prompt.blur();
    }
  }

  // --------------------------------------------------------------------------
  // main()
  // --------------------------------------------------------------------------

  _.main = function (kern, argv) {
    // check argv
    if (argv.length !== 2) {
      _.kern.log('ERROR').write('shell: invalid number of arguments').flush();
      _.kern.write(_.kern.sanitize('usage: shell <username> <ip>')).flush();
      return;
    }
    // save arguments
    _.kern = kern;
    _.username = _.kern.sanitize(argv[0]);
    _.ip = _.kern.sanitize(argv[1]);
    // init shell state
    init_history();
    init_prompt(_.username, _.ip);
  }
}