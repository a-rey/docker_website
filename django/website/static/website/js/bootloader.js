/**
 * main routine
 */

// load CPU
var kern = new Kernel();
kern.run();

// process user request
kern.time().delay(1000).kwrite('booting ...').flush();
kern.time().delay(1000).kwrite('loading user session ...').flush();
var xhr = new XMLHttpRequest();
xhr.open('GET', '/whois/');
xhr.send(null);
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      var req = JSON.parse(xhr.responseText);
      for (var h in req) {
        if (req.hasOwnProperty(h)) {
          if (h != 'HOST') {
            kern.time().kwrite('  ' + h + ': ' + req[h]).flush();
          }
        }
      }
      // load the shell
      kern.time().delay(2000).kwrite('starting shell ...').flush();
      var sh = new Shell(kern, req);
      sh.main();
    } else {
      kern.time().kwrite('Error: ' + xhr.status, 'red');
    }
  }
};
