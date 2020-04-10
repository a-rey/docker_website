/**
 * manages the shell and commands
 */

function Shell(kernel, user) {
  var _ = this;       // save current context
  _.k = kernel;       // stores reference to kernel API
  _.u = user;         // stores reference to user info
  _.h = [];           // cmd history
  _.t = [38, 40, 13]; // shell keystroke triggers
  _.h_idx = -1;       // current index into cmd history
  _.prompt = null;    // kernel prompt object
  _.p = [];           // list of user programs

  // program object to represent user loaded programs
  var Program = function (cmd, code) {
    this.cmd = cmd;
    this.code = code;
  }

  // wrapper to print the shell prompt
  _.print_prompt = function () {
    _.k.kwrite(_.prompt.text, 'lime');
    return _.k;
  }

  // init the prompt and display the banner
  _.main = function () {
    // load user programs
    _.k.time().kwrite('loading user programs ...').flush();
    _.p.push(new Program('whois', new Whois()));
    _.k.time().kwrite('  whois').flush();
    _.k.time().kwrite('DONE').flush();
    // init prompt
    _.prompt = new _.k.Kprompt();
    _.prompt.text = 'user@' + _.u.IP + ' $ ';
    _.prompt.color = 'lime';
    _.prompt.triggers = _.t; // up/down arrow and enter triggers
    _.prompt.callback = _.run;
    // display banner
    _.k.kwrite("                                                   ________  ").flush();
    _.k.kwrite("                                                  | ______o| ").flush();
    _.k.kwrite("                           _____________________  ||__---_|| ").flush();
    _.k.kwrite("A Computer's Prayer:      |  _________________  | | ______ | ").flush();
    _.k.kwrite("                          | | ")
       .kwrite("#", "lime")
       .kwrite(" :(){ :|: ;};:", "red")
       .kwrite(" | | ||______|| ").flush();
    _.k.kwrite("Guide my keystrokes,      | |                 | | |--------| ").flush();
    _.k.kwrite("Keep my programs alive,   | |                 | | |        | ").flush();
    _.k.kwrite("Protect me from viruses,  | |                 | | |      O | ").flush();
    _.k.kwrite("Back up my drive.         | |                 | | |      | | ").flush();
    _.k.kwrite("                          | '-----------------' | |      | | ").flush();
    _.k.kwrite("              Amen.       |_____________________| |      | | ").flush();
    _.k.kwrite("                               __|_______|__      |::::::::| ").flush();
    _.k.kwrite("                              _______________                ").flush();
    _.k.kwrite("                             |::::::::':::'::|               ").flush();
    _.k.kwrite("                             |:=====::: .:.::|               ").flush();
    _.k.kwrite("                              '''''''''''''''                ").flush();
    _.k.flush();
    _.k.kwrite("Enter 'help' for more info. &copy; 2017 Aaron Reyes | All rights reserved").flush();
    _.k.flush();
    // load prompt
    _.k.load_prompt(_.prompt);
  }

  // process user commands
  _.run = function (cmd, keycode) {
    switch (keycode) {
      case 38: // up arrow
        if (!_.h.length) {
          return '';
        }
        if (_.h_idx != (_.h.length - 1)) {
          _.h_idx += 1;
        }
        return _.h[_.h_idx];
      case 40: // down arrow
        if ((!_.h.length) || (_.h_idx < 0)) {
          return '';
        }
        _.h_idx -= 1;
        if (_.h_idx < 0) {
          return '';
        }
        return _.h[_.h_idx];
      case 13: // enter
        // remember command if unique/not empty/first command
        if ((cmd != '') && ((_.h.length == 0) || (_.h[0] != cmd))) {
          _.h.unshift(cmd);
        }
        _.h_idx = -1; // reset history index
        switch(cmd) {
          case '':
            _.print_prompt().flush();
            break;
          case 'help':
            _.print_prompt().kwrite(cmd).flush();
            _.k.flush();
            _.k.kwrite('help      : display this help text').flush();
            _.k.kwrite('about     : info about myself').flush();
            _.k.kwrite('edu       : education and certifications').flush();
            _.k.kwrite('projects  : my current projects').flush();
            _.k.kwrite('contact   : some ways to get a hold of me').flush();
            _.k.flush();
            break;
          case 'about':
            _.print_prompt().kwrite(cmd).flush();
            _.k.kwrite('               ____ ____ ____ ____ _  _  ____ ____ _   _ ____ ____ ', 'lime').flush();
            _.k.kwrite('Hi. My name is').kwrite(' |__| |__| |__/ |  | |\\ |  |__/ |___  \\_/  |___ [__  ', 'lime').flush();
            _.k.kwrite('               |  | |  | |  \\ |__| | \\|  |  \\ |___   |   |___ ___] ', 'lime').flush();
            _.k.flush();
            _.k.kwrite('I am a ').kwrite('computer engineer', 'orange').kwrite(' interested in:').flush();
            _.k.kwrite(' ~ ').kwrite('Information Security', 'violet').flush();
            _.k.kwrite(' ~ ').kwrite('Malware Development/Reverse Engineering', 'violet').flush();
            _.k.kwrite(' ~ ').kwrite('Embedded Systems Development', 'violet').flush();
            _.k.flush();
            break;
          case 'edu':
            _.print_prompt().kwrite(cmd).flush();
            _.k.flush();
            _.k.kwrite('Education:').flush();
            _.k.flush();
            _.k.kwrite('  <a target="_blank" href="https://www.cmu.edu/">').kwrite('Carnegie Mellon University', 'RoyalBlue').kwrite('</a> (https://www.cmu.edu/) M.S. Electrical and Computer Engineering [2015 - 2016]').flush();
            _.k.kwrite('  <a target="_blank" href="https://www.cmu.edu/">').kwrite('Carnegie Mellon University', 'RoyalBlue').kwrite('</a> (https://www.cmu.edu/) B.S. Electrical and Computer Engineering [2011 - 2015]').flush();
            _.k.flush();
            _.k.kwrite('Certifications:').flush();
            _.k.flush();
            _.k.kwrite('  <a target="_blank" href="https://certification.comptia.org/">').kwrite('CompTIA Security+ ce', 'RoyalBlue').kwrite('</a> (https://certification.comptia.org/)').flush();
            _.k.kwrite('  <a target="_blank" href="https://www.giac.org/certification/certified-forensic-analyst-gcfa">').kwrite('GIAC Certified Forensic Analyst (GCFA)', 'RoyalBlue').kwrite('</a> (https://www.giac.org/certification/certified-forensic-analyst-gcfa)').flush();
            _.k.flush();
            break;
          case 'projects':
            _.print_prompt().kwrite(cmd).flush();
            _.k.kwrite('  SalSA                       ', 'orange').kwrite('Automating Static Malware Analysis with custom rules.').flush();
            _.k.kwrite('                              <a target="_blank" href="https://github.com/deptofdefense/SalSA">').kwrite('GITHUB', 'RoyalBlue').kwrite('</a> (https://github.com/deptofdefense/SalSA)').flush();
            _.k.flush();
            _.k.kwrite('  Google RAT                  ', 'orange').kwrite('Powershell RAT using Google Apps Script as the').flush();
            _.k.kwrite('                              middleman to exfiltrate data.').flush();
            _.k.kwrite('                              <a target="_blank" href="https://github.com/a-rey/google_RAT">').kwrite('GITHUB', 'RoyalBlue').kwrite('</a> (https://github.com/a-rey/google_RAT)').flush();
            _.k.flush();
            _.k.kwrite('  Batteries Not Included      ', 'orange').kwrite('Kinetic energy harvesting RF transmission over').flush();
            _.k.kwrite('                              IEEE 802.15.4 using AES 128 bit encryption.').flush();
            _.k.kwrite('                              <a target="_blank" href="">').kwrite('GITHUB', 'RoyalBlue').kwrite('</a> (TBD)').flush();
            _.k.flush();
            _.k.kwrite('  Build18 Garage              ', 'orange').kwrite('WebApp for the Build18 organization (https://www.build18.org)').flush();
            _.k.kwrite('                              A website to manage teams, parts, and media for').flush();
            _.k.kwrite('                              projects during the annual hackathon.').flush();
            _.k.kwrite('                              <a target="_blank" href="https://www.build18.org/garage">').kwrite('WEBSITE', 'RoyalBlue').kwrite('</a> (https://www.build18.org/garage)').flush();
            _.k.flush();
            _.k.kwrite('  Embedded Structures         ', 'orange').kwrite('Using C preprocessor macros so data structures can be').flush();
            _.k.kwrite('                              used in embedded systems code without using large libraries.').flush();
            _.k.kwrite('                              <a target="_blank" href="https://github.com/a-rey/embedded_data_structures">').kwrite('GITHUB', 'RoyalBlue').kwrite('</a> (https://github.com/a-rey/embedded_data_structures)').flush();
            _.k.flush();
            _.k.kwrite('  WS281x linux driver         ', 'orange').kwrite('Linux kernel module to control WS281x LEDs.').flush();
            _.k.kwrite('                              <a target="_blank" href="https://github.com/a-rey/WS281x_linux_driver">').kwrite('GITHUB', 'RoyalBlue').kwrite('</a> (https://github.com/a-rey/WS281x_linux_driver)').flush();
            _.k.flush();
            _.k.kwrite('  aaronmreyes.herokuapp.com   ', 'orange').kwrite('Heroku Django web application backend for various').flush();
            _.k.kwrite('                              projects I work on.').flush();
            _.k.kwrite('                              <a target="_blank" href="https://github.com/a-rey/aaronmreyes_heroku">').kwrite('GITHUB', 'RoyalBlue').kwrite('</a> (https://github.com/a-rey/aaronmreyes_heroku)').flush();
            _.k.flush();
            break;
          case 'contact':
            _.print_prompt().kwrite(cmd).flush();
            _.k.flush();
            _.k.kwrite('  <a target="_blank" href="https://www.linkedin.com/in/aaronmreyes/">').kwrite('Linkedin', 'RoyalBlue').kwrite('</a> (https://www.linkedin.com/in/aaronmreyes/)').flush();
            _.k.kwrite('  <a target="_blank" href="https://github.com/a-rey">').kwrite('Github', 'RoyalBlue').kwrite('</a> (https://github.com/a-rey)').flush();
            _.k.flush();
            break;
          // undocumented commands
          case 'clear':
            _.k.clear(0);
            _.k.load_prompt(_.prompt);
            _.h_idx = -1;
            _.h = [];
            break;
          default:
            _.print_prompt().kwrite(cmd).flush();
            // check for loaded programs
            var args = cmd.split(' ');
            for (var i = _.p.length - 1; i >= 0; i--) {
              if (_.p[i].cmd == args[0]) {
                // spawn program
                _.p[i].code.main(_.k, _.prompt, args);
                break;
              }
            }
            // unknown command
            if (i < 0) {
              _.k.kwrite(cmd + ': ').kwrite('command not found', 'red').flush();
            }
        }
        return ''; // clear prompt for next command
    }
  }
}