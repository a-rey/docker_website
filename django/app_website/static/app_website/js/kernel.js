/**
 * kernel
 */

function Kernel() {
  var _ = this;                   // save current JavaScript context

  // --------------------------------------------------------------------------
  // kernel global variables
  // --------------------------------------------------------------------------
  DEFAULT_MONITOR_DELAY = 10; // 10 ms delay to all flush() calls
  LOG_WARN = 'log_warn';      // kernel logging color for warnings
  LOG_ERR = 'log_err';        // kernel logging color for errors
  LOG_INFO = 'log_info';      // kernel logging color for info
  LOG_DONE = 'log_success';   // kernel logging color for success

  // --------------------------------------------------------------------------
  // kernel internal functions
  // --------------------------------------------------------------------------

  // return the current kernel timestamp
  function _ktime() {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    var d = new Date();
    timestamp = `[${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`;
    return timestamp;
  };

  // kernel logging routine to in memory kernel buffer
  function _klog(lvl, msg) {
    if (lvl) {
      var txt = '';
      switch (lvl) {
        case LOG_WARN:
          txt = '[WARN]';
          break;
        case LOG_ERR:
          txt = '[ERROR]';
          break;
        case LOG_INFO:
          txt = '[INFO]';
          break;
        case LOG_DONE:
          txt = '[SUCCESS]';
          break;
      }
      _.log_buf.push({
        text: msg,
        time: _ktime() + txt + ' ',
        style: lvl,
      });
    } else {
      _.log_buf.push({
        text: msg,
        time: '',
        style: null,
      });
    }
  };

  // flush the kernel log buffer
  function _kflush() {
    for (var i = _.log_buf.length - 1; i >= 0; i--) {
      var html = '';
      // create div for line
      var div = document.createElement('div');
      div.className = 'line';
      // create span for timestamp style
      var tspan = document.createElement('span');
      // add all style classes
      for (var j = _.log_buf[i].style.length - 1; j >= 0; j--) {
        tspan.classList.add(_.log_buf[i].style[j]);
      }
      tspan.innerHTML = _.log_buf[i].time;
      html += tspan.outerHTML;
      // process line text
      html += _.log_buf[i].text;
      // add div to the page
      div.innerHTML = html;
      var term = document.getElementById('monitor');
      term.insertBefore(div, term.children[term.children.length]);
      window.scrollTo(0, document.body.offsetHeight);
    }
    // clear buffer
    _.log_buf = [];
  };

  // --------------------------------------------------------------------------
  // kernel data structures
  // --------------------------------------------------------------------------

  // what a static user program is
  function Program() {
    this.cmd = null;
    this.code = null;
    this.threads = [];
  };

  // what the monitor state is to the kernel
  function Monitor() {
    this.hidden = false; // is the monitor hidden?
    this.width = 0;      // current monitor width
    this.height = 0;     // current monitor height
    this.buffer = [];    // buffer to be flushed
  };

  // --------------------------------------------------------------------------
  // kernel system call API
  // --------------------------------------------------------------------------

  // load a program
  // arg[0] = command name string
  // arg[1] = program code JavaScript object
  // returns kernel object
  _.load = function () {
    if (arguments.length === 2) {
      p = new Program();
      p.cmd = arguments[0];
      p.code = arguments[1];
      _.programs.push(p);
    } else {
      _klog([LOG_ERR], 'kernel: invalid load() systemcall');
      _kflush();
    }
    return _;
  };

  // exec a loaded program
  // arg[0] = the program to run
  // arg[1] = the array of command line arguments to the program
  // returns program's output or null
  _.exec = function () {
    if (arguments.length === 2) {
      // find requested program
      for (var i = _.programs.length - 1; i >= 0; i--) {
        if (_.programs[i].cmd === arguments[0]) {
          // spawn program: main(kernel object, argv)
          return _.programs[i].code.main(_, arguments[1]);
        }
      }
      _klog([LOG_ERR], 'kernel: exec() program not found "' + _.sanitize(arguments[0]) + '"');
      _kflush();
    } else {
      _klog([LOG_ERR], 'kernel: invalid exec() systemcall');
      _kflush();
    }
    return null;
  };

  // exit a user program (removes all program threads)
  // arg[0] = program name to exit
  // returns kernel object
  _.exit = function () {
    if (arguments.length === 1) {
      // find requested program
      for (var i = _.programs.length - 1; i >= 0; i--) {
        if (_.programs[i].cmd === arguments[0]) {
          // remove all threads
          for (var j = _.programs[i].threads.length - 1; j >= 0; j--) {
            _.programs[i].threads[j].target.removeEventListener(_.programs[i].threads[j].event, _.programs[i].threads[j].code);
          }
          _.programs[i].threads = [];
          return _;
        }
      }
      _klog([LOG_ERR], 'kernel: exit() program not found "' + _.sanitize(arguments[0]) + '"');
      _kflush();
    } else {
      _klog([LOG_ERR], 'kernel: invalid exit() systemcall');
      _kflush();
    }
    return _;
  }

  // write a line of text to the monitor buffer
  // arg[0] = the text to write
  // arg[1] = (optional) list of css classes for this output (or null)
  // returns kernel object
  _.write = function () {
    switch (arguments.length) {
      case 1:
        _.monitor_buf.push({
          text: arguments[0],
          style: null,
        });
        break;
      case 2:
        _.monitor_buf.push({
          text: arguments[0],
          style: arguments[1],
        });
        break;
      default:
        _klog([LOG_ERR], 'kernel: invalid write() systemcall');
        _kflush();
    }
    return _;
  };

  // add a timestamp to the monitor log buffer
  // arg[0] = the log level of the timestamp ('INFO'|'ERROR'|'WARN'|'SUCCESS')
  // returns kernel object
  _.log = function () {
    var tstyle = null;
    var timestamp = _ktime();
    if (arguments.length) {
      switch (arguments[0]) {
        case 'WARN':
          tstyle = [LOG_WARN];
          break;
        case 'ERROR':
          tstyle = [LOG_ERR];
          break;
        case 'INFO':
          tstyle = [LOG_INFO];
          break;
        case 'SUCCESS':
          tstyle = [LOG_DONE];
          break;
      }
    }
    _.monitor_buf.push({
      text: timestamp + ' ',
      style: tstyle,
    });
    return _;
  };

  // spawn a thread managed by the kernel
  // arg[0] = program name
  // arg[1] = object to add listener to (or null for one shot thread)
  // arg[2] = listener event name (or delay for one shot thread)
  // arg[3] = thread code
  // returns kernel object
  _.thread = function () {
    if (arguments.length === 4) {
      // find requested program
      for (var i = _.programs.length - 1; i >= 0; i--) {
        if (_.programs[i].cmd === arguments[0]) {
          // check if binding to an object or using setTimeout()
          if (!arguments[1]) {
            // spawn one shot thread
            setTimeout(arguments[3], arguments[2]);
          } else {
            // track recurring thread for cleanup later
            _.programs[i].threads.push({
              target: arguments[1],
              event: arguments[2],
              code: arguments[3],
            });
            // register handler
            arguments[1].addEventListener(arguments[2], arguments[3]);
          }
          return _;
        }
      }
      _klog([LOG_ERR], 'kernel: thread() program not found "' + _.sanitize(arguments[0]) + '"');
      _kflush();
    } else {
      _klog([LOG_ERR], 'kernel: invalid thread() systemcall');
      _kflush();
    }
    return _;
  }

  // flush the monitor buffer
  // returns kernel object
  _.flush = function () {
    // check for an empty flush
    if (!_.monitor_buf.length) {
      _.monitor_buf.push({
        text: '&nbsp;',
        style: null,
      });
    }
    // add current memory buffer to monitor buffer for flushing
    _.monitor.buffer.push(_.monitor_buf.slice());
    _.monitor_buf = [];
    return _;
  };

  // sanitzes user input before adding to the monitor to escape DOM characters & preserve whitespace
  // arg[0] = string to sanitize
  // returns new string or an empty string
  _.sanitize = function () {
    if (arguments.length) {
      return arguments[0]
             .replace(/&/g,  '&amp;')
             .replace(/</g,  '&lt;')
             .replace(/>/g,  '&gt;')
             .replace(/"/g,  '&quot;')
             .replace(/'/g,  '&#039;')
             .replace(/\//g, '&#x2F;')
             .replace(/ /g,  '&nbsp;');
    }
    return '';
  }

  // returns the current monitor width
  _.monitor_width = function () {
    return _.monitor.width;
  }

  // returns the current monitor height
  _.monitor_height = function () {
    return _.monitor.height;
  }

  // hides all DOM objects
  _.monitor_hide = function () {
    _.monitor.hidden = true;
    for (var i = document.body.children.length - 1; i >= 0; i--) {
      // dont add CSS to <script> elements
      if (document.body.children[i].nodeName.toLowerCase() !== 'script') {
        document.body.children[i].classList.add('hidden');
      }
    }
  }

  // makes sure all DOM objects are not hidden
  _.monitor_show = function () {
    _.monitor.hidden = false;
    for (var i = document.body.children.length - 1; i >= 0; i--) {
      document.body.children[i].classList.remove('hidden');
    }
  }

  // clear all text from monitor history
  _.monitor_reset = function () {
    // TODO:
  }

  // --------------------------------------------------------------------------
  // kernel event threads
  // --------------------------------------------------------------------------

  // watch the state of the monitor size for user applications
  function _kthread_monitor_size() {
    // create monitor object if needed
    if (!_.monitor) {
      _.monitor = new Monitor();
    }
    setTimeout(function _thread(e) {
      var style = window.getComputedStyle(document.body);
      // error of 2px for float pixel values
      var paddingWidth = parseInt(style.paddingLeft) + parseInt(style.paddingRight) + 2;
      var paddingHeight = parseInt(style.paddingTop) + parseInt(style.paddingBottom) + 2;
      _.monitor.width = document.body.clientWidth - paddingWidth;
      _.monitor.height = document.body.clientHeight - paddingHeight;
      setTimeout(_thread, DEFAULT_MONITOR_DELAY);
    }, DEFAULT_MONITOR_DELAY);
  }

  // watch the state of the monitor buffer to flush
  function _kthread_monitor_buffer() {
    // create monitor object if needed
    if (!_.monitor) {
      _.monitor = new Monitor();
    }
    _.monitor_buf = [];        // user monitor buffer
    _.log_buf = [];            // kernel log buffer
    (function _thread() {
      // display data if there is some and monitor is not hidden
      if (_.monitor.buffer.length && !_.monitor.hidden) {
        var data = _.monitor.buffer.shift();
        if (data.length > 0) {
          // create div for line
          var div = document.createElement('div');
          div.className = 'line';
          // process line info
          var html = '';
          for (var i = 0; i < data.length; i++) {
            if (data[i].style) {
              var span = document.createElement('span');
              // add all style classes
              for (var j = data[i].style.length - 1; j >= 0; j--) {
                span.classList.add(data[i].style[j]);
              }
              span.innerHTML = data[i].text;
              html += span.outerHTML;
            } else {
              html += data[i].text;
            }
          }
          // add div to the page
          div.innerHTML = html;
          var term = document.getElementById('monitor');
          term.insertBefore(div, term.children[term.children.length]);
        }
        window.scrollTo(0, document.body.offsetHeight);
      }
      // check back later
      setTimeout(_thread, DEFAULT_MONITOR_DELAY);
    })();
  };

  // --------------------------------------------------------------------------
  // kernel init routine
  // --------------------------------------------------------------------------

  (function () {
    _.programs = []; // list of loaded programs for the kernel
    _kthread_monitor_size();
    _kthread_monitor_buffer();
    _klog([LOG_INFO], 'kernel: init() complete');
    _kflush();
  })();
}
