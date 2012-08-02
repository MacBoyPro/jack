var _ = require('underscore');

function Expectation(object, method) {
  this.stubs = [];
  this.object = object;
  this.method = method;
  this.build();
};

Expectation.prototype.returns = function(value) {
  var hash = this.stubs.pop() || { arguments: [] };
  hash.return = value;
  this.stubs.push(hash);

  return this;
};

Expectation.prototype.with = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  this.stubs.push({ arguments: args, return: null });
  return this;
};

Expectation.prototype.build = function() {
  this.object[this.method] = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var match = undefined;
    var defaults = null;

    this.stubs.forEach(function(stub) {
      if (!stub.arguments.length) {
        defaults = stub.return;
      }

      if (_.isEqual(stub.arguments, args)) {
        match = stub.return;
      }
    });

    if (match !== void 0) return match;
    return defaults;

  }.bind(this);
};

Object.prototype.stubs = function(name) {
  this.stubbed_ = this.stubbed_ || [];
  this.stubbed_.push({ name: name, method: this[name] });

  this.stub_ = this.stub_ || new Expectation(this, name);

  return this.stub_;
};

Object.prototype.resetAll = function() {
  this.stubbed_.forEach(function(stubbed) {
    this[stubbed.name] = stubbed.method;
  }.bind(this));

  delete this.stub_;
};

// TODO:
//
// * every stub call should create e separate object
// * the stub object should not rebuild the method
// * if no stub matches the args execute the original method
