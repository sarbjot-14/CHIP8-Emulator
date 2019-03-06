//let topIndex = 0;
let program = "00E0 00E0 00EE 1216 3401 3400 0000 4401 0000 4400 00EE 2208 00E0 0000 5400 64FF 7419 8400";
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

/*
function testLoadProgram(program){
  chip.initializeData();
  program = program.replace(/\s+/g,"")
  chip.setMemory(512 , program.substring(0,2))
  chip.setMemory(513 , program.substring(2,4))
}
*/
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
/*
function printEndExecution(instruction){
  console.log("\t---------------Instruction " + instruction + " END---------------\n\n")
}*/

/*
function loadTestInstruction(instruction){
    console.log("\n\n\t---------------Instruction " + instruction + " START---------------")
    printOldVariables()

    console.log("******Executing instruction******");
    chip.loadProgram(instruction)
    chip.emulationLoop()

    printnewVariables()
    console.log("\t---------------Instruction " + instruction + " END---------------\n\n")
    chip.initializeData()
}*/

function testEmulationLoop(){
  //run code at program programCounter
  let ins = chip.memory[parseInt(chip.programCounter, 16)] + chip.memory[parseInt(chip.programCounter, 16) + 1];

  console.log("\n\n\n\t---------------Instruction " + ins + " START---------------");
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
  console.log("Current Data:"); ////****
  printAllVariables();////*****
  console.log("\t---------------Instruction " + ins + " END---------------\n\n\n");

  //delay (60Hz)
  //console.log("Recursion should happen")////****
  let nextIns = chip.memory[parseInt(chip.programCounter, 16)] + chip.memory[parseInt(chip.programCounter, 16) + 1]
  console.log(">nextIns " + nextIns)/////****
  if(nextIns != "0000")
    this.testEmulationLoop();//////****
  chip.vis.updateHistory();
}

function testInstructions(){
  chip.vis.init();
  chip.loadProgram(program);
  chip.togglePause();
  chip.setProgramCounter("0200");
  testEmulationLoop();
}
