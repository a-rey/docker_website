/**
 * server error handler
 */

// generates a random 200 length string
function get_rand_padding() {
  var buf = new Array(200);
  for (var i = 0; i < buf.length; i++) {
    buf[i] = String.fromCharCode(Math.floor(Math.random() * 255));
  }
  return buf.join('');
}

// generates a random 5 character integer pid
function get_rand_pid() {
  var pid = new Array(5);
  for (var i = 0; i < pid.length; i++) {
    pid[i] = Math.floor((Math.random() * 8) + 1).toString();
  }
  return pid.join('');
}

// boot kernel
var kern = new Kernel();
// load hexdump program into kernel
kern.load('hexdump', new Hexdump());
// generate random core dump filename with a random PID
var coredump = 'core.' + get_rand_pid();
// generate random core dump data
data = '';
data += get_rand_padding();
data += document.getElementById('err').value;
data += get_rand_padding();
// write hexdump command history to monitor
kern.log('ERROR').write('kernel panic: fatal exception. dumping core ...').flush();
kern.write('root@server#&nbsp;', ['color_lime']).write('hexdump&nbsp;' + coredump).flush();
// display actual hex dump
kern.exec('hexdump', [data]);
