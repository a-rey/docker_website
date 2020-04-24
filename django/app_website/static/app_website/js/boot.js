/**
 * bootloader
 */

// boot kernel
var kern = new Kernel();
// load all programs from /bin/ into kernel
kern.load('hexdump', new Hexdump());
kern.load('whoami',  new Whoami());
kern.load('shell',   new Shell());
kern.load('help',    new Help());
kern.load('pong',    new Pong());
kern.load('ls',      new Ls());
// process user request
kern.log('INFO').write('boot: loading user session ...').flush();
kern.exec('whoami', [function (data) {
  // display user session information
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === 'error') {
        kern.log('ERROR').write('ERROR: ' + data[key]).flush();
      } else {
        kern.write(key + ': ' + data[key]).flush();
      }
    }
  }
  // display banner
  kern.write(kern.sanitize("                                                   ________  ")).flush();
  kern.write(kern.sanitize("                                                  | ______o| ")).flush();
  kern.write(kern.sanitize("                           _____________________  ||__---_|| ")).flush();
  kern.write(kern.sanitize("A Computer's Prayer:      |  _________________  | | ______ | ")).flush();
  kern.write(kern.sanitize("                          | | "));
  kern.write(kern.sanitize("#"), ["color_lime"]).write(kern.sanitize(" :(){ :|: ;};:"), ["color_red"]);
                                               kern.write(kern.sanitize(" | | ||______|| ")).flush();
  kern.write(kern.sanitize("Guide my keystrokes,      | |                 | | |--------| ")).flush();
  kern.write(kern.sanitize("Keep my programs alive,   | |                 | | |        | ")).flush();
  kern.write(kern.sanitize("Protect me from viruses,  | |                 | | |      O | ")).flush();
  kern.write(kern.sanitize("Back up my drive.         | |                 | | |      | | ")).flush();
  kern.write(kern.sanitize("                          | '-----------------' | |      | | ")).flush();
  kern.write(kern.sanitize("              Amen.       |_____________________| |      | | ")).flush();
  kern.write(kern.sanitize("                               __|_______|__      |::::::::| ")).flush();
  kern.write(kern.sanitize("                              _______________                ")).flush();
  kern.write(kern.sanitize("                             |::::::::':::'::|               ")).flush();
  kern.write(kern.sanitize("                             |:=====::: .:.::|               ")).flush();
  kern.write(kern.sanitize("                              '''''''''''''''                ")).flush();
  kern.flush();
  kern.write("Enter 'help' for more info. &copy; 2017 Aaron Reyes | All rights reserved").flush();
  kern.flush();
  // start kernel shell
  kern.exec('shell', ['user', (data.hasOwnProperty('IP') ? data['IP'] : 'localhost')]);
}]);
