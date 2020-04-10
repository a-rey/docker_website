/**
 * whois program
 */

function Whois() {
  var _ = this;  // save current context

  _.main = function (kernel, prompt, cmd) {
    _.k = kernel; // keep kernel reference
    _.p = prompt; // keep user prompt reference
    // check for valid arguments
    if (cmd.length != 2) {
      _.k.kwrite('Usage: whois ip').flush();
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/whois/?q=' + cmd[1]);
    xhr.send(null);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var req = JSON.parse(xhr.responseText);
          if (req.hasOwnProperty('LATITUDE')) {
            _.k.kwrite('LATITUDE=' + req['LATITUDE']).flush();
          }
          if (req.hasOwnProperty('LONGITUDE')) {
            _.k.kwrite('LONGITUDE=' + req['LONGITUDE']).flush();
          }
          if (req.hasOwnProperty('CONTINENT_NAME')) {
            _.k.kwrite('CONTINENT_NAME=' + req['CONTINENT_NAME']).flush();
          }
          if (req.hasOwnProperty('COUNTRY_NAME')) {
            _.k.kwrite('COUNTRY_NAME=' + req['COUNTRY_NAME']).flush();
          }
          if (req.hasOwnProperty('CITY_NAME')) {
            _.k.kwrite('CITY_NAME=' + req['CITY_NAME']).flush();
          }
          if (req.hasOwnProperty('AUTONOMOUS_SYSTEM_ORGANIZATION')) {
            _.k.kwrite('AUTONOMOUS_SYSTEM_ORGANIZATION=' + req['AUTONOMOUS_SYSTEM_ORGANIZATION']).flush();
          }
        } else {
          _.k.kwrite('Error: ' + xhr.status, 'red');
        }
      }
    };
  }
}