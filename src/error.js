"use strict";
var _ = require("lodash");

function nameFunction(name, fn) {
  var fnStr = "return function " + name + "(){return fn.apply(this, arguments)}",
    renamed;
  try {
    renamed = new Function('fn', fnStr)(fn);
  } catch(err) {
    throw err;
  }

  _.extend(renamed, fn);
  renamed.prototype = fn.prototype;

  return renamed;
}

function createErrorClass(name, defaults) {
  var errorClass;

  if(!_.isString(name)){
    throw new Error("First argument: class name must be a string.");
  }
  if(defaults && !_.isPlainObject(defaults)){
    throw new Error("Second argument: defaults must be an object.");
  }

  function CustomError(message, props){
    if(_.isPlainObject(message)) {
      props = message;
      message = undefined;
    }
    _.extend(this, defaults);
    _.extend(this, props);
    this.name = name;
    if(message) {
      this.message = message;
    }

    if(!_.isString(this.message) || this.message === '') {
      throw new Error("A message string is required to construct an error.");
    }

    Error.captureStackTrace(this, errorClass);
  }

  CustomError.prototype = Object.create(Error.prototype);

  try {
    errorClass = nameFunction(name, CustomError);
  } catch (err) {
    throw new Error("First argument: " + name + " is not a valid javascript function name.");
  }

  return errorClass;
}

module.exports = {
  create : createErrorClass
};
