/**
 * Hexdump of HTML/Server errors
 */

var x = [];
var msg = '{{ err }}';

// hex front padding
for (var i = 0; i < 200; i++) {
  x.push(Math.floor(Math.random() * 255));
}

// error message
for (var i = 0; i < msg.length; i++) {
  x.push(msg.charCodeAt(i));
}

// hex rear padding
for (var i = 0; i < 200; i++) {
  x.push(Math.floor(Math.random() * 255));
}

var lines = [];
// parse hex dump in groups of 16
for (var b = 0; b < x.length; b += 16) {
  var blk = x.slice(b, Math.min(b + 16, x.length));
  var hex = blk.map(function (c) {
    return '&nbsp;' + ((0xF0 & c) >> 4).toString(16).toUpperCase() + (0xF & c).toString(16).toUpperCase();
  }).join('');
  hex += '&nbsp;&nbsp;&nbsp;'.repeat(16 - blk.length);
  var chars = '';
  for (var i = 0; i < blk.length; i++) {
    chars += String.fromCharCode(blk[i]);
  }
  var chars = chars.replace(/[\x00-\x1F\x7F-\xFF\x20]/g, '.');
  // add color to all ASCII text
  var text = '';
  for (var i = 0; i < chars.length; i++) {
    if (0x2E != chars.charCodeAt(i)) {
      text += ('<span style="color:red;">' + chars[i] + '</span>');
    } else {
      text += chars[i];
    }
  }
  lines.push('<div class="line">' + ('00000000' + b.toString(16)).slice(-8) + '&nbsp;' + hex + '&nbsp;&nbsp;' + text + '</div>');
}
document.getElementById('terminal').innerHTML += lines.join('');