'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var rimraf = require('rimraf');
var yeoman = require('yeoman-generator');
var git = require('../util/git');
var spawn = require('../util/spawn');


var DroughtGenerator = module.exports = function DroughtGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DroughtGenerator, yeoman.generators.Base);

DroughtGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'projectName',
    message: 'What would you like to call this project?',
    default: 'myDroughtProject'
  }, {
    type: 'confirm',
    name: 'confirmSASS',
    message: 'Would you like to use SASS?',
    default: true
  }, {
    type: 'confirm',
    name: 'confirmGrunt',
    message: 'Would you like to use Grunt?',
    default: true
  }, {
    type: 'confirm',
    name: 'confirmBower',
    message: 'Would you like to use Bower?',
    default: true
  }, {
    type: 'confirm',
    name: 'confirmjQuery',
    message: 'Would you like to use jQuery?',
    default: true
  }, {
    type: 'confirm',
    name: 'confirmFoundation',
    message: 'Would you like to use Foundation?',
    default: true
  }, {
    type: 'confirm',
    name: 'confirmIE8',
    message: 'Do you need to support IE8? *sigh*',
    default: false
  }];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName;
    this.confirmSASS = props.confirmSASS;
    this.confirmGrunt = props.confirmGrunt;
    this.confirmBower = props.confirmBower;
    this.confirmjQuery = props.confirmjQuery;
    this.confirmFoundation = props.confirmFoundation;
    this.confirmIE8 = props.confirmIE8;

    cb();
  }.bind(this));
};

DroughtGenerator.prototype.usegit = function usegit() {
  var done = this.async();

  console.log(chalk.red('\n----------------------------\n'));
  console.log([
chalk.cyan(',------.                               ,--.       ,--.'),
chalk.cyan('|  .-.  \\ ,--.--. ,---. ,--.,--. ,---. |  ,---. ,-\'  \'-.'),
chalk.cyan('|  |  \\  :|  .--\'| .-. ||  ||  || .-. ||  .-.  |\'-.  .-\''),
chalk.cyan('|  \'--\'  /|  |   \' \'-\' \'\'  \'\'  \'\' \'-\' \'|  | |  |  |  |'),
chalk.cyan('`-------\' `--\'    `---\'  `----\' .`-  / `--\' `--\'  `--\''),
chalk.cyan('                                `---\'                    ')].join('\n'));

  console.log('Now I\'m going to do a quick clone of the latest Drought files...');

  git.clone('git://github.com/fleeting/Drought.git', '.', function() {
    console.log(chalk.green('Drought successfully cloned.'));
    done();
  });
};

DroughtGenerator.prototype.app = function app() {
  console.log(chalk.red('\n----------------------------\n'));

  var done = this.async();
  console.log('I\'ve got Drought so lets customize this build based on your earlier needs.');

  //this.copy('humans.txt', 'humans.txt');
  this.template('_package.json', 'package.json');

  if(!this.confirmSASS) {
    rimraf('css/mixins.scss', function () { });
    rimraf('css/normalize.scss', function () { });
    rimraf('css/style.scss', function () { });

    console.log(chalk.green('You aren\'t using SASS for this project so I\'ve removed those files.'));
  }

  if(this.confirmBower) {
    this.template('_bower.json', 'bower.json');
  }

  if(this.confirmGrunt) {
    this.copy('gruntfile.js', 'gruntfile.js');
  }

  done();
};
