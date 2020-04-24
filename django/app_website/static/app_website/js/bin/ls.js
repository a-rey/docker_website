/**
 * ls program (lists loaded kernel programs)
 */

function Ls() {
  var _ = this;
  _.NAME = 'ls';

  _.main = function (kern, argv) {
    for (var i = kern.programs.length - 1; i >= 0; i--) {
      kern.write(kern.programs[i].cmd).flush();
    }
    kern.exit(_.NAME);
  }
}