/**
 * Assertions.
 */
var chai = require('chai');
var should = chai.should();

/**
 * Fixtures.
 */
var Project = require('./fixtures/project');


/**
 * Subject.
 *
 * @type {Object}
 */
var jack = require('../');

describe('jack', function() {
  it('can stub class methods', function() {
    Project.stubs('id').returns(2);
    Project.id().should.eql(2);
    Project.resetAll();
  });

  it('can stub class methods based on conditions', function() {
    Project.stubs('id').with(3).returns(3);
    Project.stubs('id').with(4).returns(4);

    Project.id(3).should.eql(3);
    Project.id(4).should.eql(4);
    should.not.exist(Project.id());


    Project.resetAll();
  });
});
