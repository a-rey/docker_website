/**
 * kernel (handles generating HTML from user input and manipulating the DOM)
 */

function Kernel() {
  var _ = this;     // save current context
  _.q = [];         // queue holding current lines to display
  _.e = Date.now(); // loading time of the application
  _.l = new Line(); // the current line
  _.f = null;       // the user function to process command prompt entries
  _.k = null;       // keystroke triggers for prompt
  _.rows = 0;       // number of Line rows fit into current screen
  _.cols = 0;       // number of text characters fit into a Line

  // internal specification of what a line is
  function Line () {
    this.prompt = null;       // is this line a prompt?
    this.prompt_icon = null;  // {text, color} for prompt or null for a hidden prompt
    this.reset = false;       // is this line a reset?
    this.delay = 0;           // the delay of the line
    this.time = false;        // is this line timed?
    this.data = [];           // the text data of the line
  }

  // calculate the number of rows/columns for the current window size
  function _ktermsize() {
    // calculate number of rows
    var term = document.getElementById('terminal');
    var span = document.createElement('span');
    span.innerHTML = '&nbsp;';
    span.style.padding = '0';
    span.style.position = 'absolute';
    span.style.left = '-100px';
    term.appendChild(span);
    _.rows = Math.floor(window.innerHeight / span.clientHeight) - 3;
    // calculate number of columns
    var style = window.getComputedStyle(document.body);
    var padding = parseInt(style.paddingLeft) + parseInt(style.paddingRight);
    _.cols = Math.floor((window.innerWidth - padding) / span.clientWidth) - 5;
    term.removeChild(span);
  }

  // keep prompt at the right size
  function _kautosize() {
    var style = window.getComputedStyle(document.body);
    // error of 2px for float pixel values
    var padding = parseInt(style.paddingLeft) + parseInt(style.paddingRight) + 2;
    var width = document.body.clientWidth - document.getElementById('prompt-icon').clientWidth - padding;
    document.getElementById('prompt').style.width = width.toString() + 'px';
  }

  // format user input to allow HTML code but force browser to not remove spacing
  function _kfmt(s) {
    return s.replace(/  /g, '&nbsp;&nbsp;').replace(/^ /, '&nbsp;').replace(/ $/, '&nbsp;');
  }

  // --------------------------------------------------------------------------
  // kernel event listeners
  // --------------------------------------------------------------------------

  window.addEventListener('load', function (e) {
    _ktermsize();
  });

  window.addEventListener('click', function (e) {
    document.getElementById('prompt').focus();
  });

  window.addEventListener('resize', function (e) {
    _kautosize();
    _ktermsize();
  });

  // listen for enter keys to the prompt
  window.addEventListener('keyup', function (e) {
    if (_.f && _.k) {
      var p = document.getElementById('prompt');
      for (var i = _.k.length - 1; i >= 0; i--) {
        if (_.k[i] == e.keyCode) {
          p.value = _.f(p.value, e.keyCode);
        }
      }
    }
  });

  // --------------------------------------------------------------------------
  // kernel API
  // --------------------------------------------------------------------------

  // kernel data structure for user specified prompt
  _.Kprompt = function () {
    this.text = null;     // text for prompt
    this.color = null;    // color for text prompt (null is default)
    this.hidden = false;  // is this prompt hidden?
    this.callback = null; // callback function
    this.triggers = null; // list of keystroke triggers
  }

  // convert a Line into HTML/startup the kernel Line parsing
  _.run = function () {
    if (_.q.length) {
      var p = document.getElementById('prompt-wrapper');
      var p_icon = document.getElementById('prompt-icon');
      var ln = _.q.shift();
      // check for a reset
      if (ln.reset) {
        var lns = document.getElementsByClassName('line');
        while (lns.length > 0){
          lns[0].parentNode.removeChild(lns[0]);
        }
        // clear prompt next
        ln.prompt = true;
        ln.prompt_icon = null;
      }
      // check for a prompt request
      if (ln.prompt) {
        // check for a hidden prompt
        if (ln.prompt_icon) {
          var span = document.createElement('span');
          span.style.color = ln.prompt_icon.color;
          span.innerHTML = _kfmt(ln.prompt_icon.text);
          p_icon.appendChild(span);
          p.className = '';
          _kautosize();
        } else {
          p.className = 'hidden';
          if (p_icon.firstElementChild) {
            p_icon.removeChild(p_icon.firstElementChild);
          }
        }
        document.getElementById('prompt').focus();
      }
      if (ln.data.length > 0) {
        // create div for line
        var div = document.createElement('div');
        div.className = 'line';
        // process line info
        var html = '';
        if (ln.time) {
          var delta = Date.now() - _.e;
          var tag = '[ ' + delta.toString() + ' ] ';
          var span = document.createElement('span');
          span.style.color = 'cyan';
          span.innerHTML = _kfmt(tag);
          html += span.outerHTML;
        }
        for (var i = 0; i < ln.data.length; i++) {
          if (ln.data[i].color) {
            var span = document.createElement('span');
            span.style.color = ln.data[i].color;
            span.innerHTML = _kfmt(ln.data[i].text);
            html += span.outerHTML;
          } else {
            html += _kfmt(ln.data[i].text);
          }
        }
        // add div to the page
        div.innerHTML = html;
        var term = document.getElementById('terminal');
        term.insertBefore(div, term.children[term.children.length - 1]);
      }
      window.scrollTo(0, document.body.offsetHeight);
      setTimeout(_.run, ln.delay);
    } else {
      // if no line, check back later
      setTimeout(_.run, 100);
    }
  }

  // command to reset/clear the DOM
  // arg[0] = delay in milliseconds
  _.clear = function (d) {
    _.load_prompt(null); // clear prompt
    _.l.delay = d;
    _.l.reset = true;
    _.q.push(_.l);
    _.l = new Line();
    return _;
  }

  // tell kernel the next line printed will be timed
  _.time = function () {
    _.l.time = true;
    return _;
  }

  // tell kernel the delay of the current line being built
  // arg[0] = delay in milliseconds
  _.delay = function (d) {
    _.l.delay = d;
    return _;
  }

  // tell kernel the text for the current line
  // arg[0] = text
  // arg[1] = color (optional) (null means default color)
  _.kwrite = function () {
    switch (arguments.length) {
      case 1:
        _.l.data.push({text: arguments[0], color: null});
        break;
      case 2:
        _.l.data.push({text: arguments[0], color: arguments[1]});
        break;
    }
    return _;
  }

  // tell kernel to flush the current built line
  _.flush = function () {
    // check for an empty flush
    if (_.l.data.length == 0) {
      _.l.data.push({text: ' ', color: null});
    }
    _.q.push(_.l);
    _.l = new Line();
    return _;
  }

  // tell kernel to load/unload prompt
  // arg[0] = Kprompt object to load (null means unload prompt)
  _.load_prompt = function () {
    if (arguments[0]) {
      _.l.prompt = true;
      _.f = arguments[0].callback;
      if (arguments[0].hidden) {
        _.l.prompt_icon = null;
      } else {
        _.l.prompt_icon = {text: arguments[0].text, color: arguments[0].color};
      }
      _.k = arguments[0].triggers;
    } else {
      _.f = null;
      _.l.prompt = true;
      _.l.prompt_icon = null;
      _.k = null;
    }
    _.l.delay = 0;
    _.q.push(_.l);
    _.l = new Line();
    return _;
  }

  // ask kernel for number of columns
  _.get_cols = function () {
    return _.cols;
  }

  // ask kernel for number of rows
  _.get_rows = function () {
    return _.rows;
  }
}

