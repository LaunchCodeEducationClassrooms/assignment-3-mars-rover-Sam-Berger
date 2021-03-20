class Rover {
   constructor(position) {
     this.position = position;
     this.mode = "NORMAL";
     this.generatorWatts = 110;
   }
 
  receiveMessage(message) {
    let resultsArr = [];
      
 
     for (let i = 0; i < message.commands.length; i++) {
       if (message.commands[i] === "STATUS_CHECK") {
         resultsArr.push(
          {
           completed: true,
           "roverStatus": 
             {
             mode: this.mode,
             generatorWatts: this.generatorWatts,
             position: this.position
             }
          })
      }
      else if (message.commands[i].commandType === "MODE_CHANGE"){
        if (message.commands[i].value === "LOW_POWER") {
           this.mode = "LOW_POWER"
        }  
         if (message.commands[i].value === "NORMAL") {
           this.mode = "NORMAL"
         }
       resultsArr.push({completed: true}) 
      }
      else if (message.commands[i].commandType === "MOVE") {
        if (this.mode === "LOW_POWER") {
          resultsArr.push({completed: false})
        }
        if (this.mode === "NORMAL") {
          this.position += message.commands[i].value
        }
      }
      
      //this else should probably not exist and its function should be elsewhere. What happens when removed?
      else {
        resultsArr.push({completed: true})
      }
     }
   return {
     name: message.name,
     results: resultsArr
   }
  }
 }
 
 /*
 receiveMessage(message) {
   let resultsArr = message;
   //is message passing an array? message sends object, but the commands key has an array as value.
 //how do I iterate through the length of of array for multiple commands?
 
 //message.commands.value and message.commands/commandType are what I need to solve test 11
   return resultsArr
 }
 */
 
 
 module.exports = Rover;