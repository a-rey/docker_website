/**
 * hexdump program (displays data in a hexdump/xxd-ish way)
 */

function Hexdump() {
  var _ = this;
  _.NAME = 'hexdump';

  // --------------------------------------------------------------------------
  // global variables
  // --------------------------------------------------------------------------
  WIDTH = 16;
  TEXT_COLOR = 'color_red';

  // --------------------------------------------------------------------------
  // internal functions
  // --------------------------------------------------------------------------

  // perform the hexdump to the monitor on an array of integers
  function dump(raw) {
    var lines = []; // list of lines to display to monitor
    // parse hex dump in groups of WIDTH
    for (var blk_idx = 0; blk_idx < raw.length; blk_idx += WIDTH) {
      // get block from raw data
      var blk = raw.slice(blk_idx, Math.min(blk_idx + WIDTH, raw.length));
      // write line offset to monitor buffer
      _.kern.write(('00000000' + blk_idx.toString(16)).slice(-8) + '&nbsp;');
      // create hex display
      var hex = blk.map(function (x) {
        return '&nbsp;' + ((0xF0 & x) >> 4).toString(16).toUpperCase() + (0x0F & x).toString(16).toUpperCase();
      }).join('');
      hex += '&nbsp;&nbsp;&nbsp;'.repeat(WIDTH - blk.length);
      // write hex display to monitor buffer
      _.kern.write(hex + '&nbsp;&nbsp;');
      // create ASCII text display
      var chars = '';
      for (var i = 0; i < blk.length; i++) {
        chars += String.fromCharCode(blk[i]);
      }
      // replace non-ASCII with a '.'
      var chars = chars.replace(/[\x00-\x1F\x7F-\xFF\x20]/g, '.');
      // add color to all ASCII text
      for (var i = 0; i < chars.length; i++) {
        // ignore all '.'
        if (0x2E != chars.charCodeAt(i)) {
          _.kern.write(chars[i], [TEXT_COLOR]);
        } else {
          _.kern.write(chars[i]);
        }
      }
      // flush monitor line buffer
      _.kern.flush();
    }
  }

  // --------------------------------------------------------------------------
  // main()
  // --------------------------------------------------------------------------

  _.main = function (kern, argv) {
    _.kern = kern;
    // check argv
    if (!argv.length) {
      _.kern.log('ERROR').write('hexdump: invalid number of arguments').flush();
      _.kern.write(_.kern.sanitize('usage: hexdump <msg>')).flush();
      return;
    }
    // add user arguments to dump buffer
    msg = [];
    for (var i = 0; i < argv.length; i++) {
      msg.push(argv[i]);
    }
    // convert data to array of integers
    var raw = msg.join(' ').split('').map(function (c) {
      return c.charCodeAt();
    });
    // dump result
    dump(raw);
    // exit
    _.kern.exit(_.NAME);
  }
}