const assert = require('assert');
const Command = require('../command.js');
const Message = require('../message.js');
const Rover = require('../rover.js')

describe("Rover class", function() {

  it("constructor sets position and default values for mode and generatorWatts", function() {

    let test = new Rover(100)
    assert.strictEqual(test.position, 100);
    assert.strictEqual(test.mode, "NORMAL");
    assert.strictEqual(test.generatorWatts, 110)
  });

  it("response returned by receiveMessage contains name of message", function() {

    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let testMessage = new Message('Test message with two commands', testCommands);
    let test = new Rover(100)

    assert.strictEqual(test.receiveMessage(testMessage).name, 'Test message with two commands')
  });


  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    
    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let testMessage = new Message('Test message with two commands', testCommands);
    let test = new Rover(100)

    assert.strictEqual(test.receiveMessage(testMessage).results.length, 2)
  })

  it("responds correctly to status check command", function() {
    let testRover = new Rover(100);
    let testMessage = new Message('Check Status', ['STATUS_CHECK'])
    
    assert.strictEqual(testRover.receiveMessage(testMessage).results[0].roverStatus.mode, "NORMAL")
    assert.strictEqual(testRover.receiveMessage(testMessage).results[0].roverStatus.generatorWatts, 110)
    assert.strictEqual(testRover.receiveMessage(testMessage).results[0].roverStatus.position, 100)
  })

  it("responds to command change corrently", function() {
    let testRover = new Rover(100);
    let testToLowPower = [new Command('MODE_CHANGE', 'LOW_POWER')]
    let testMessageLow = new Message('Changes to Low Power', testToLowPower);
    testRover.receiveMessage(testMessageLow)

    assert.strictEqual(testRover.mode, "LOW_POWER")
    assert.strictEqual(testRover.receiveMessage(testMessageLow).results[0].completed, true)

    let testToNormalPower = [new Command('MODE_CHANGE', 'NORMAL')]
    let testMessageNormal = new Message('Changes to Normal Power', testToNormalPower);

    assert.strictEqual(testRover.receiveMessage(testMessageNormal).results[0].completed, true)

    testRover.receiveMessage(testMessageNormal)
    assert.strictEqual(testRover.mode, "NORMAL")
  })
  
  it("responds with false completed value when attempting to move in LOW_POWER mode", function () {
    let testRover = new Rover(100);
    let testToLowPower = [new Command('MODE_CHANGE', 'LOW_POWER')]
    let testMessageLow = new Message('Changes to Low Power', testToLowPower);
    testRover.receiveMessage(testMessageLow)
    let lowMoveCommand = [new Command('MOVE', 5)]
    let lowMoveMessage = new Message('Move in Low Power Mode', lowMoveCommand);

    assert.strictEqual(testRover.receiveMessage(lowMoveMessage).results[0].completed,false)

    assert.strictEqual(testRover.position, 100)
  })

  it("responds with position for move command", function () {
    let testRover = new Rover(100);
    let moveCommand = [new Command('MOVE', 5)]
    let moveMessage = new Message('Move 5 units in Normal Power Mode', moveCommand);

    testRover.receiveMessage(moveMessage)
    assert.strictEqual(testRover.position, 105)
  })


});