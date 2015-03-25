import { _ } from 'azk-core';
import Generator from '../generator';
import fileUtils from '../file-utils';

var generator = new Generator();
var bb = require('bluebird');
var spawn = bb.coroutine;

import Systems from './syntaxes/systems';
// import System  from './syntaxes/system';

/**
 * AzkParser
 * parse, create and modify Azkfile.js
 */
class AzkParser {
  constructor(options) {
    var default_options = {
    };

    this._options = {};
    _.assign(this._options, default_options);
    _.assign(this._options, options);

    this._generator = new Generator();
  }

  getSystemsFromAzkfile(azkfile_path) {
    return spawn(function* (azkfile_path) {
      var file_content = yield fileUtils.read(azkfile_path);
      var systems = new Systems({ azkfile_content: file_content });
      return systems;
    })(azkfile_path);
  }

  getCodeFromSystems(systems) {
    var ast = systems.convert_to_ast;
    return generator.generate(ast).code;
  }

  saveSystemsToAzkfile(systems, save_path) {
    var self = this;
    return spawn(function* (systems, save_path) {
        // generate code from ast
        var azkfile_systems_content = self.getCodeFromSystems(systems);

        // save file
        var file_content = yield fileUtils.write(save_path, azkfile_systems_content);
        return file_content;
      }
    )(systems, save_path);
  }

}

module.exports = AzkParser;
