import h        from '../../spec-helper';
import System   from '../../../src/azk-parser/syntaxes/system';

import Generator from '../../../src/generator';
var generator = new Generator();

describe('System:', function() {
  var system001;
  beforeEach(function () {
    system001 = new System({ name: 'system001' });
  });

  it('should system have a syntax', function () {
    h.expect(system001)       .to.not.be.undefined;
    h.expect(system001.syntax).to.not.be.undefined;
  });

  it('should system add a depends', function () {
    system001.addDepends('system002');
    h.expect(system001._depends).to.not.be.undefined;
    h.expect(system001._depends.length).to.eql(1);
  });

  it('should system remove a depends', function () {
    system001.addDepends('system002');
    h.expect(system001._depends.length).to.eql(1);

    system001.rmDepends('system002');
    h.expect(system001._depends.length).to.eql(0);

  });

  it('should generate a system', function () {
    var code = generator.generate(system001.syntax).code;
    h.expect(code).to.eql(
      [
        "system001: {}",
      ].join('\n')
    );
  });

  it('should generate a system with dependencies', function () {
    system001.addDepends('system002');

    var code = generator.generate(system001.syntax).code;
    h.expect(code).to.eql(
      [
        "system001: {",
        "  depends: [\"system002\"]",
        "}",
      ].join('\n')
    );
  });

  it('should generate a system with a image', function () {
    system001 = new System({
      name: 'system001',
      image: {'docker': 'azukiapp/azktcl:0.0.1'}
    });
    var code = generator.generate(system001.syntax).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  image: { "docker": "azukiapp/azktcl:0.0.1" }',
        '}',
      ].join('\n')
    );
  });

  it('should export a JSON object from system', function () {
    // add two dependencies
    system001.addDepends('system002');
    system001.addDepends('system003');

    var json = system001.toJSON();
    h.expect(json).not.be.undefined;

    // depends
    h.expect(json.depends).to.have.length(2);
    h.expect(json.depends[0]).to.equal('system002');
    h.expect(json.depends[1]).to.equal('system003');
  });

  it('should import a JSON object to system', function () {
    // add two dependencies
    var system001_json = {
      depends: [
        'system002',
        'system003'
      ]
    };

    // create a system from JSON
    var system_from_json = new System({ json: system001_json });

    // get JSON from this new system
    var json = system_from_json.toJSON();
    h.expect(json).not.be.undefined;

    // depends
    h.expect(json.depends).to.have.length(2);
    h.expect(json.depends[0]).to.equal('system002');
    h.expect(json.depends[1]).to.equal('system003');
  });

});
