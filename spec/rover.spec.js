const assert = require('assert');
const Command = require('../command.js');
const Message = require('../message.js');
const Rover = require('../rover.js')

describe("Rover class", function() {

  it("constructor sets position and default values for mode and generatorWatts", function() {

    let test = new Rover(100)
    // assert.strictEqual(test.position, 100);
    // assert.strictEqual(test.mode, "NORMAL");
    // assert.strictEqual(test.generatorWatts, 110)

    expect(test.position).toEqual(100);
    expect(test.mode).toEqual("NORMAL");
    expect(test.generatorWatts).toEqual(110);


  });

  it("response returned by receiveMessage contains name of message", function() {

    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let testMessage = new Message('Test message with two commands', testCommands);
    let test = new Rover(100)

    expect(test.receiveMessage(testMessage).message).toEqual('Test message with two commands');

  });


  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {

    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let testMessage = new Message('Test message with two commands', testCommands);
    let test = new Rover(100)

    expect(test.receiveMessage(testMessage).results.length).toEqual(2);


  })

  it("responds correctly to status check command", function() {
    let testRover = new Rover(100);
    let testMessage = new Message('Check Status', ['STATUS_CHECK'])
    
    testRover.receiveMessage(testMessage)

    expect(testRover.mode).toEqual("NORMAL");

    expect(testRover.generatorWatts).toEqual(110);

    expect(testRover.position).toEqual(100);

  })

  it("responds to command change corrently", function() {
    let testRover = new Rover(100);
    let testToLowPower = [new Command('MODE_CHANGE', 'LOW_POWER')]
    let testMessageLow = new Message('Changes to Low Power', testToLowPower);
    testRover.receiveMessage(testMessageLow)

    expect(testRover.mode).toEqual("LOW_POWER");
    expect(testRover.receiveMessage(testMessageLow).results[0].completed).toEqual(true);

    let testToNormalPower = [new Command('MODE_CHANGE', 'NORMAL')]
    let testMessageNormal = new Message('Changes to Normal Power', testToNormalPower);

    expect(testRover.receiveMessage(testMessageNormal).results[0].completed).toEqual(true);

    testRover.receiveMessage(testMessageNormal)

    expect(testRover.mode).toEqual("NORMAL");

  })

  //I suspect this might be where a problem lays in the autograder
  it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
    let testRover = new Rover(100);
    let testToLowPower = [new Command('MODE_CHANGE', 'LOW_POWER')]
    let testMessageLow = new Message('Changes to Low Power', testToLowPower);
    testRover.receiveMessage(testMessageLow)
    let lowMoveCommand = [new Command('MOVE', 5)]
    let lowMoveMessage = new Message('Move in Low Power Mode', lowMoveCommand);

    expect(testRover.receiveMessage(lowMoveMessage).results[0].completed).toEqual(false);    
    expect(testRover.position).toEqual(100);    

  })



  it("responds with position for move command", function() {
    let testRover = new Rover(100);
    let moveCommand = [new Command('MOVE', 5)]
    let moveMessage = new Message('Move to position 5', moveCommand);

    testRover.receiveMessage(moveMessage)    
  
    expect(testRover.position).toEqual(5)
  })


});