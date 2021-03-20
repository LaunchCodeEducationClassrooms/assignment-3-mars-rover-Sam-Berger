const assert = require('assert');
const Command = require('../command.js');
const Message = require('../message.js');

describe("Message class", function() {

  it("throws error if a name is NOT passed into the constructor as the first parameter", function() {
    assert.throws(
      function() {
        new Message();
      },
      {
        message: 'Message name required.'
      }
    );
  });

  it("constructor sets name", function() {

    let test = new Message("name")
    assert.strictEqual(test.name, "name");
  });

  it("contains a commands array passed into the constructor as 2nd argument", function() {
    let test = new Message("name", [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')])
    assert.deepStrictEqual(test.commands, [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')])
  })
});