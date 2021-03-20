const assert = require('assert');
const Command = require('../command.js');

describe("Command class", function() {

  it("throws error if command type is NOT passed into constructor as the first parameter", function() {
    assert.throws(
      function() {
        new Command();
      },
      {
        message: 'Command type required.'
      }
    );
  });

  it("constructor sets command type", function() {

    let test = new Command("commandType")
    assert.strictEqual(test.commandType, "commandType");
  });

  it("constructor sets a value passed in as the 2nd argument", function() {
    let test = new Command("commandType", 5)
    assert.strictEqual(test.value, 5)
  })

});