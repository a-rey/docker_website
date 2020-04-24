/**
 * help program (displays about/help info)
 */

function Help() {
  var _ = this;
  _.NAME = 'help';

  _.main = function (kern, argv) {
    kern.write(kern.sanitize('               ____ ____ ____ ____ _  _  ____ ____ _   _ ____ ____ '), ['color_lime']).flush();
    kern.write('Hi. My name is');
    kern.write(kern.sanitize(' |__| |__| |__/ |  | |\\ |  |__/ |___  \\_/  |___ [__  '), ['color_lime']).flush();
    kern.write(kern.sanitize('               |  | |  | |  \\ |__| | \\|  |  \\ |___   |   |___ ___] '), ['color_lime']).flush();
    kern.flush();
    kern.write('I am a ').write('computer engineer', ['color_orange']).write(' interested in:').flush();
    kern.write(' ~ ').write('Information Security', ['color_violet']).flush();
    kern.write(' ~ ').write('Reverse Engineering', ['color_violet']).flush();
    kern.write(' ~ ').write('Embedded Systems Development', ['color_violet']).flush();
    kern.flush();
    kern.write('See my public work on <a target="_blank" href="https://github.com/a-rey">');
    kern.write('Github', ['color_royalblue']);
    kern.write('</a> (https://github.com/a-rey)').flush();
    kern.flush();
    kern.write('>>> run "ls" to see a list of programs you can run from here ...').flush();
    kern.exit(_.NAME);
  }
}