"use strict";
var chai = require("chai"),
  ErrorClass = require("./.."),
  sinonChai = require("sinon-chai");

var expect = chai.expect;

chai.use(sinonChai);

describe("#ErrorClass.create", function () {

  describe("validation", function () {

      it("should throw an error if the name is not defined", function () {
        expect(function () {
          ErrorClass.create();
        }).to.throw("First argument: class name must be a string.");
      });

      it("should throw an error if the name is not a string", function () {
        expect(function () {
          ErrorClass.create({});
        }).to.throw("First argument: class name must be a string.");
      });

      it("should not throw an error if defaults are undefined", function () {
        ErrorClass.create("TestError");
      });

      it("should throw an error if the type is not a valid class name", function () {
        expect(function () {
          ErrorClass.create("test-error");
        }).to.throw("First argument: test-error is not a valid javascript function name.");
      });

      it("should throw an error if the defaults are not an object", function () {
        expect(function () {
          ErrorClass.create("TestError", "thing");
        }).to.throw("Second argument: defaults must be an object.");
      });
  });

  describe("error class", function () {

    it("should be a function", function () {
      var TestError = ErrorClass.create("TestError");
      expect(TestError).to.be.a('function');
    });

    it("should have a `name` property matching the name argument", function () {
      var TestError = ErrorClass.create("TestError");
      expect(TestError.name).to.equal("TestError");
    });

  });

  describe("error instances", function () {
    var NotFoundError;

    beforeEach(function () {
      NotFoundError = ErrorClass.create("NotFoundError", {
        status : 404,
        message : "Resource not found",
        detail : "The requested resource could not be found."
      });
    });

    it("should have a name property that matches its class name, regardless of defaults", function () {
      var err = new NotFoundError();
      expect(err.name).to.equal('NotFoundError');
    });

    it("should be an instance of Error", function () {
      var err = new NotFoundError();
      expect(err).to.be.an.instanceof(Error);
    });

    it("should be an instance of its class", function () {
      var err = new NotFoundError();
      expect(err).to.be.an.instanceof(NotFoundError);
    });

    it("should have its default values", function () {
      var err = new NotFoundError();
      expect(err.status).to.equal(404);
      expect(err.message).to.equal("Resource not found");
      expect(err.detail).to.equal("The requested resource could not be found.");
    });

    it("should set its message to the provided message string", function () {
      var err = new NotFoundError("Could not find your homepage.");
      expect(err.message).to.equal("Could not find your homepage.");
    });

    it("should set properties from the props argument, overriding defaults where there is a conflict", function () {
      var err = new NotFoundError("Could not find your homepage.", {
        detail : "IM NOT JOKING",
        name : "FakeName",
        extra : "read all about it!"
      });

      expect(err.status).to.equal(404);
      expect(err.detail).to.equal("IM NOT JOKING");
      expect(err.extra).to.equal("read all about it!");
      expect(err.name).to.equal("NotFoundError");
      expect(err.message).to.equal("Could not find your homepage.");
    });

    it("should accept a props object without a message", function () {
      var err = new NotFoundError({
        detail : "IM NOT JOKING",
        name : "FakeName",
        extra : "read all about it!"
      });

      expect(err.status).to.equal(404);
      expect(err.detail).to.equal("IM NOT JOKING");
      expect(err.extra).to.equal("read all about it!");
      expect(err.name).to.equal("NotFoundError");
      expect(err.message).to.equal("Resource not found");
    });

    it("should create a stack trace", function () {
      var err = new NotFoundError();
      expect(err.stack).to.be.a('string');
    });

    it("should not include implementation contexts in the stack trace", function () {
      var err = new NotFoundError();
      expect(err.stack).to.not.have.string("CustomError");
      expect(err.stack).to.not.have.string("at new NotFoundError");
    });

    it("should include the error type and message in the stack trace", function () {
      var err = new NotFoundError();
      expect(err.stack).to.have.string("NotFoundError: Resource not found");
    });

    it("should not allow the name to be overwritten by props or defaults", function () {
      var TestError = ErrorClass.create("TestError", {
        name : 'asdf'
      });
      var err = new TestError("testing", {
        name : "1234"
      });
      expect(err.name).to.equal("TestError");
    });

    it("should not allow the stack to be overwritten by defaults or props", function () {
      var TestError = ErrorClass.create("TestError", {
        stack : 'asdf'
      });
      var err = new TestError("testing", {
        stack : "1234"
      });
      expect(err.stack).to.not.equal("asdf");
      expect(err.stack).to.not.equal("1234");
    });

    it("should throw an error if the resulting instance does not have a message", function () {
      var TestError = ErrorClass.create("TestError");
      expect(function () {
        new TestError();
      }).to.throw("A message string is required to construct an error.");
    });

    it("should .toString nicely", function () {
      var err = new NotFoundError();
      expect(err.toString()).to.equal("NotFoundError: Resource not found");
      expect("" + err).to.equal("NotFoundError: Resource not found");
    });
  });

});
