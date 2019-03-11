let program = "";
function drawTesting(){
  chip.setRegistersV(0,"03");
  chip.setRegistersV(1,"01");
  chip.setRegisterI("00");
  chip.setMemory(0,"93");
  chip.setMemory(1,"6D");
  chip.setMemory(2,"65");
}
function retTest(){
  chip.setStack(0,"001");
  chip.setStack(1,"01F");
  chip.setStack(2,"1FE");
  chip.setStack(3,"FED");
  chip.setStack(4,"EDC");

  chip.setStackPointer(4);

  chip.setProgramCounter("DCB");

}

function printAllRegistersV(){
  let regList = "\t"
  let space = "  ";
  for(let i = 0; i < chip.registersV.length; i++){
    regList += ("V" + i.toString(16) + ": " + chip.registersV[i] + space)
  }
  regList += "\n\tI: " + chip.registerI
  regList += space + "Delay: " + chip.registerDelay
  regList += space + "Sound Timer: " + chip.registerSoundTimer
  console.log(regList)
}
function printAllVariables(){
  printAllRegistersV()
  console.log("\tProgramCounter: " + chip.programCounter)
  console.log("\tStackPointer: " + chip.stackPointer)
  console.log("\tVF: " + chip.VF)
}
function printOldVariables(){
  console.log("Old data: ")
  printAllVariables()
}
function printNewVariables(){
  console.log("New data: ")
  printAllVariables();
}
function testEmulationLoop(){
  //run code at program programCounter
  let ins = chip.memory[parseInt(chip.programCounter, 16)] + chip.memory[parseInt(chip.programCounter, 16) + 1];
  let separator = "-------------------"
  console.log("\n\n\t" + separator + "Executing " + ins + separator);
  /*printOldVariables();
  console.log("******Executing instruction******");*/

  let insResult = chip.executeInstruction(ins);
  if(insResult == 1){
    //increment programCounter by 2
    chip.setProgramCounter( (parseInt(chip.programCounter, 16) + 2).toString(16) );
  }else if(insResult == 2){
    //do nothing
  }else if(!parseInt(chip.registerSoundTimer, 16) && !parseInt(chip.registerDelay, 16)){
    console.log("TogglePause should happen")
    chip.togglePause();
    console.log("invalid")
  }

  //decrement timers
  if(parseInt(chip.registerDelay, 16)){
    chip.setRegisterDelay((parseInt(chip.registerDelay, 16) -1).toString(16));
  }
  if(parseInt(chip.registerSoundTimer, 16)){
    chip.setRegisterSoundTimer((parseInt(chip.registerSoundTimer, 16) -1).toString(16));
  }

  //printNewVariables();
//  console.log("Current Data:"); ////****
  printAllVariables();////*****
  //console.log("\t" + separator + "Instruction " + ins + " END" + separator + "\n\n\n");

  //delay (60Hz)
  //console.log("Recursion should happen")////****
  let nextIns = chip.memory[parseInt(chip.programCounter, 16)] + chip.memory[parseInt(chip.programCounter, 16) + 1]
  //console.log(">nextIns " + nextIns)/////****
  if(nextIns != "0000")
    this.testEmulationLoop();//////****
  chip.vis.updateHistory();
}

function giveTestProgram(){
  let testProgram = "";
  testProgram += "00E0 00EE "
  testProgram += "1214 3401 3400 0000 4401 0000 4400 00EE 2206 "
  testProgram += "62F0 63FF 5230 720F 5230 0000 "
  testProgram += "8030 8121 8312 8342 8323 8343 8333 8324 8334 8434 8355 8345 8245 8245 8336 8446 8346 8447 8327 83E7 8237 844E 845E 6501 845E 843E ";
  //VF doesn't update itself after modifying, since ins 8
  testProgram += "A000 AAAA "
  testProgram += "6002 B25C 6000 B262 "
  testProgram += "CAAC "
  return testProgram;
}

function testInstructions(){
  program = giveTestProgram();
  chip.vis.init();
  chip.loadProgram(program);
  chip.paused = false;
  console.log("Program:\n" + program);
  console.log("Starting data: ");
  printAllVariables();
  testEmulationLoop();
  console.log("End testing")
}
