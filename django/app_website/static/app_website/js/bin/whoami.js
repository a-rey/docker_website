/**
 * whoami program
 */

function Whoami() {
  var _ = this;
  _.NAME = 'whoami';

  // --------------------------------------------------------------------------
  // internal functions
  // --------------------------------------------------------------------------

  // display maxmind license statement
  function print_license() {
    _.kern.log('INFO').write('whoami: using GeoLite2 data created by MaxMind, available at <a target="_blank" href="https://www.maxmind.com">');
    _.kern.write('https://www.maxmind.com', ['color_royalblue']);
    _.kern.write('</a>');
    _.kern.flush();
  }

  // --------------------------------------------------------------------------
  // game main()
  // --------------------------------------------------------------------------

  _.main = function (kern, argv) {
    _.callback = null;
    _.kern = kern; // keep kernel reference
    // check for valid arguments
    if (argv.length === 1) {
      if (argv[0] instanceof Function) {
        _.callback = argv[0];
      } else {
        _.kern.log('ERROR').write('whoami: invalid arguments').flush();
        _.kern.write(_.kern.sanitize('usage: whoami [javascript-callback]')).flush();
        return;
      }
    }
    print_license();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/whoami/');
    xhr.send(null);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          // pass result to callback if there is one
          if (_.callback) {
            _.callback(data);
          } else {
            // if no callback, print results
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                if (key === 'error') {
                  _.kern.log('ERROR').write('ERROR: ' + data[key]).flush();
                } else {
                  _.kern.write(key + ': ' + data[key]).flush();
                }
              }
            }
          }
        } else {
          _.kern.log('ERROR').write('whoami: ' + xhr.status);
        }
      }
    };
  }
}