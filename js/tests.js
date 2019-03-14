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

function testEmulationLoop(){
  //run code at program programCounter
  let ins = chip.memory[parseInt(chip.programCounter, 16)] + chip.memory[parseInt(chip.programCounter, 16) + 1];
  let separator = "-------------------"
  console.log("\n\n\n" + separator + "Executing " + ins + separator);

  let insResult = chip.executeInstruction(ins);
  if(insResult == 1){
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

  printAllVariables();////*****

  //delay (60Hz)
  //console.log("Recursion should happen")////****
  let nextIns = chip.memory[parseInt(chip.programCounter, 16)] + chip.memory[parseInt(chip.programCounter, 16) + 1]
  //console.log(">nextIns " + nextIns)/////****
  // console.log("I: " + chip.memory[1280])
  // console.log("I + 1: " + chip.memory[1281])
  // console.log("I + 2: " + chip.memory[1282])
  /*for(let i = parseInt("B00", 16); i <= parseInt("B0F", 16); i++)
  {
    console.log(i + ". " + chip.memory[i]);
  }*/
  if(nextIns != "0000")
    this.testEmulationLoop();//////****
  chip.vis.updateHistory();
}

function giveTestFonts(){
  let testProgram = "";
  testProgram += "00E0";
  //reset VC VD
  testProgram += "6000 6100 ";
  //increase X = 7005
  //increase Y = 7105
  //from 0-4
  testProgram += "F029 D015 F129 7005 D015 F229 7005 D015 F329 7005 D015 F429 7005 D015 ";
  //from 5-9
  testProgram += "F529 7005 D015 F629 7005 D015 F729 7005 D015 F829 7005 D015 F929 7005 D015 ";
  //from A-C
  testProgram += "FA29 7005 D015 FB29 7005 D015 FC29 7005 D015 ";
  //increase Y, reset X
  testProgram += "7004 7105";
  //from D-F
  testProgram += "FD29 D015 FE29 7005 D015 FF29 7005 D015 ";
  return testProgram;
}
function giveResetRegistersV(){
  let testProgram = "";
  let code = "8";
  for(let i = 0; i < 15; i++){
    testProgram += code + i.toString(16) + i.toString(16) + "3 ";
  }
  return testProgram;
}
function giveTestProgram(){
  let testProgram = "";
  testProgram += "00E0 00EE ";
  testProgram += "1214 3401 3400 0000 4401 0000 4400 00EE 2206 ";
  testProgram += "62F0 63FF 5230 720F 5230 0000 ";
  testProgram += "8030 8121 8312 8342 8323 8343 8333 8324 8334 8434 8355 8345 8245 8245 8336 8446 8346 8447 8327 83E7 8237 844E 845E 6501 845E 843E ";;
  //VF doesn't update itself after modifying, since ins 8
  testProgram += "A000 A000 ";
  testProgram += "6002 B25C 6000 B262 ";
  testProgram += "CAAC ";
  //testProgram += giveTestFonts();
  testProgram += "FA07 ";
  testProgram += "F015 F215 ";
  testProgram += "F018 F218 ";
  testProgram += "F01E F21E ";
  testProgram += "AA00 F033 F133 ";
  testProgram += "AB00 F055 FE55 ";
  //reset registers 0-E
  //testProgram += giveResetRegistersV();
  testProgram += "AC00 FE65 AB00 FE65 ";
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
function testFonts(){
  program = giveTestFonts();
  chip.vis.init();
  chip.loadProgram(program);
  chip.paused = false;
  console.log("Program:\n" + program);
  console.log("Starting data: ");
  printAllVariables();
  testEmulationLoop();
  console.log("End testing")
}
