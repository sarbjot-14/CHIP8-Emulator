let program = " ";
let instructionList;
let passed;
let x;
let y;
let regX;
let regY;
let regF;
let regIDec;
let oldRegX;
let oldRegY;
let kk;
let nnn;
let pc;
let oldPc;
//let oldVal = [];
/*
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
  testProgram += "00E0 00E0 ";
  testProgram += "1214 3401 3400 0000 4401 0000 4400 00EE 2206 ";
  testProgram += "62F0 63FF 5230 720F 5230 0000 ";
  testProgram += "8030 8121 8312 8342 8323 8343 8333 8324 8334 8434 8355 8345 8245 8245 8336 8446 8346 8447 8327 83E7 8237 844E 845E 6501 845E 843E ";
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
//////////

function initializeInstructionList(){
  instructionList = [];
  //instructionList.push(["0NNN", false]);
  instructionList.push(["00E0", false]);
  instructionList.push(["00EE", false]);
  instructionList.push(["1NNN", false]);
  instructionList.push(["2NNN", false]);
  instructionList.push(["3XKK", false]);
  instructionList.push(["4XKK", false]);
  instructionList.push(["5XY0", false]);
  instructionList.push(["6XKK", false]);
  instructionList.push(["7XKK", false]);
  instructionList.push(["8XY0", false]);
  instructionList.push(["8XY1", false]);
  instructionList.push(["8XY2", false]);
  instructionList.push(["8XY3", false]);
  instructionList.push(["8XY4", false]);
  instructionList.push(["8XY5", false]);
  instructionList.push(["8XY6", false]);
  instructionList.push(["8XY7", false]);
  instructionList.push(["8XYE", false]);
  instructionList.push(["9XY0", false]);
  instructionList.push(["ANNN", false]);
  instructionList.push(["BNNN", false]);
  instructionList.push(["CXKK", false]);
  instructionList.push(["DXYN", false]);
  instructionList.push(["EX9E", false]);
  instructionList.push(["EXA1", false]);
  instructionList.push(["FX07", false]);
  instructionList.push(["FX0A", false]);
  instructionList.push(["FX15", false]);
  instructionList.push(["FX18", false]);
  instructionList.push(["FX1E", false]);
  instructionList.push(["FX29", false]);
  instructionList.push(["FX33", false]);
  instructionList.push(["FX55", false]);
  instructionList.push(["FX65", false]);

}
function updateOldVal(){
  if(chip.undoStack.length > 0){
    oldVal = chip.undoStack[chip.undoStack.length - 1];
    //oldvalue == start of emulator
  }
}
function updateGenericLabels(){
  passed = false;
  x = parseInt(oldVal[0][1], 16);
  y = parseInt(oldVal[0][2], 16);
  regX = parseInt(chip.registersV[x], 16);
  regY = parseInt(chip.registersV[y], 16);
  regF = parseInt(chip.VF, 16);
  regIDec = parseInt(chip.registerI, 16);
  oldRegX = parseInt(oldVal[1].registersV[x], 16);
  oldRegY = parseInt(oldVal[1].registersV[y], 16);
  oldRegIDec = parseInt(oldVal[1].registerI, 16);
  kk = parseInt(oldVal[0].substring(2, 4), 16);
  nnn = parseInt(oldVal[0].substring(1, 4), 16);
  pc = parseInt(chip.programCounter, 16);
  oldPc = parseInt(oldVal[1].programCounter, 16);
}
function printInstruction(){////****
  console.log(instructionList);
}
function findInstructionIndex(name){
  for(let i = 0; i < instructionList.length; i++){
    if(instructionList[i][0] == name){
      return i;
    }
  }
  return -1;
}
function setInstructionPassed(name, passed){
  let index = findInstructionIndex(name);
  instructionList[index][1] = passed;
}
/*function ss(){
  chip.vis.init();
  console.log("\t\t" + program)///****
  chip.loadProgram(program);
  chip.paused = false;
  testEmulationLoop();
}
*/
function test00e0(){
  passed = true;
  for(let i = 0; i < chip.pixels.length; i++){
    if(chip.pixels[i] == 1){
      passed = false;
      break;
    }
  }
  setInstructionPassed("00E0", passed);
}
function test00ee(){
  let oldStackPointer = oldVal[1].stackPointer;
  let oldStack = oldVal[1].stack;
  if(oldStackPointer > 0 && oldStackPointer - chip.stackPointer == 1 && pc - parseInt(oldStack[oldStackPointer], 16) == 2){
    passed = true;
  }else if(oldStackPointer == 0 && chip.stackPointer == 0){
    passed = true;
  }
  setInstructionPassed("00EE", passed);
}
function test1nnn(){
  if(parseInt(chip.programCounter, 16) == parseInt("214", 16)){
    passed = true;
  }
  setInstructionPassed("1NNN", passed);
/*


  console.log(parseInt("214", 16))
  console.log(parseInt(chip.programCounter, 16))
  console.log(program)
  console.log(chip.programCounter)*/
}
function test2nnn(){
  if(chip.stackPointer == (oldVal[1].stackPointer + 1)
  && chip.stack[chip.stackPointer] == oldVal[1].programCounter
  && parseInt(chip.programCounter, 16) == parseInt(oldVal[0].substring(1, 4), 16)){
    passed = true;
  }
  setInstructionPassed("2NNN", passed);
}
function test3xkk(){
  if(regX == kk && pc - oldPc == 4){
    passed = true;
  }else if(pc - oldPc == 2){
    passed = true;
  }
  setInstructionPassed("3XKK", passed);
}
function test4xkk(){
  if(regX != kk && pc - oldPc == 4){
    passed = true;
  }else if(pc - oldPc == 2){
    passed = true;
  }
  setInstructionPassed("4XKK", passed);
}
function test5xy0(){
  if(regX == regY && pc - oldPc == 4){
    passed = true;
  }else if(pc - oldPc == 2){
    passed = true;
  }
  setInstructionPassed("5XY0", passed);
}
function test6xkk(){
  if(regX == kk){
    passed = true;
  }
  setInstructionPassed("6XKK", passed);
}
function test7xkk(){
  if(oldRegX + kk == regX){
    passed = true;
  }
  setInstructionPassed("7XKK", passed);
}
function test8xy0(){
  if(regX == regY){
    passed = true;
  }
  setInstructionPassed("8XY0", passed);
}
function test8xy1(){
  if(regX == (oldRegX | oldRegY)){
    passed = true;
  }
  setInstructionPassed("8XY1", passed);
}
function test8xy2(){
  if(regX == (oldRegX & oldRegY)){
    passed = true;
  }
  setInstructionPassed("8XY2", passed);
}
function test8xy3(){
  if(regX == (oldRegX ^ oldRegY)){
    passed = true;
  }
  setInstructionPassed("8XY3", passed);
}
function test8xy4(){
  let result = oldRegX + oldRegY;
  let realResult = result;
  if(result > 255){
    realResult = parseInt((result.toString(16)).substring(1, 3), 16)
  }
  /*console.log(oldVal[0])
  printAllVariables();
  console.log("oldRegX: " + oldRegX)
  console.log("oldRegY: " + oldRegY)
  console.log("result: " + result)
  console.log("result - 256: " + (result - 256))
  console.log("realResult: " + realResult)
  console.log("regX: " + regX)
  console.log("regF: " + regF)*/
  if(result > 255 && regX == realResult && regF == 1){
    passed = true;
  }else if(result <= 255 && regX == realResult && regF == 0){
    passed = true;
  }
  setInstructionPassed("8XY4", passed);
}
function test8xy5(){//////******
  let result = (oldRegX - regY) & 255;
  if(oldRegX < regY && regX == result && regF == 0){
    passed = true;
  }else if(oldRegX > regY && regX == result && regF == 1){
    passed = true;
  }
  setInstructionPassed("8XY5", passed);
}
function test8xy6(){
  if(chip.legacyMode && regX == regY >> 1){
    if((regY % 2 != 0 && regF == 1) || (regY % 2 == 0 && regF == 0)){
      passed = true;
    }
  }else if(!chip.legacyMode && regX == oldRegX >> 1){
    if((oldRegX % 2 != 0 && regF == 1) || (oldRegX % 2 == 0 && regF == 0)){
      passed = true;
    }
  }
  setInstructionPassed("8XY6", passed);
}
function test8xy7(){////*****
  let result = (regY - oldRegX) & 255;
  if(regY < oldRegX && regX == result && regF == 0){
    passed = true;
  }else if(regY > oldRegX && regX == result && regF == 1){
    passed = true;
  }
  setInstructionPassed("8XY5", passed);
}
function test8xye(){
  console.log(oldVal[0])
  if(chip.legacyMode && regX == regY << 1){
    console.log("\tlegacyMode on " + chip.legacyMode)
    console.log("\tregX: " + regX)
    console.log("\tregY: " + regY)
    if((regY >= 128  && regF == 1) || (regY < 128 && regF == 0)){
      console.log("\t\tregF: " + regF)
      passed = true;
    }
  }else if(!chip.legacyMode && regX == oldRegX <<  1){
    if((oldRegX >= 128 && regF == 1) || (oldRegX < 128 && regF == 0)){
      passed = true;
    }
  }
  setInstructionPassed("8XYE", passed);
}
function test9xy0(){
  if(regX != regY && pc - oldPc == 4){
    passed = true;
  }else if(pc - oldPc == 2){
    passed = true;
  }
  setInstructionPassed("9XY0", passed);
}
function testANNN(){
  if(regIDec == nnn){
    passed = true;
  }
  setInstructionPassed("ANNN", passed);
}
function testBNNN(){
  let reg0 = parseInt(oldVal[1].registersV[0], 16);
  if(pc == nnn + reg0){
    passed = true;
  }
  setInstructionPassed("BNNN", passed);
}
function testCXKK(){
  setInstructionPassed("CXKK", true);
}
function testDXYN(){
  setInstructionPassed("DXYN", passed);
}
function testEX9E(){
  setInstructionPassed("EX9E", passed);
}
function testEXA1(){
  setInstructionPassed("EXA1", passed);
}
function testFX07(){
  if(regX == chip.registerDelay){
    passed = true;
  }
  setInstructionPassed("FX07", passed);
}
function testFX0A(){

}
function testFX15(){
  if(chip.registerDelay == regX){
    passed = true;
  }
  setInstructionPassed("FX15", passed);
}
function testFX18(){
  if(chip.registerSoundtimer == regX){
    passed = true;
  }
  setInstructionPassed("FX15", passed);
}
function testFX1E(){
  if(regIDec == oldRegIDec + oldRegX){
    passed = true;
  }
  setInstructionPassed("FX1E", passed);
}
function testFX29(){
 if(regIDec == oldRegIDec * 5){
   passed = true;
 }
 setInstructionPassed("FX29", passed);
}
function testFX33(){

}
function testFX55(){
  passed = true;
  for(let i = 0; i < x; i++){
    if(chip.memory[regIDec] != chip.registersV[i]){
      passed = false;
      break;
    }
    regIDec++;
  }
  setInstructionPassed("FX55", passed);
}
function testFX65(){

}
function updatePassingInstruction(ins){
  switch(ins[0]){
    case "0":
    switch(ins.substring(1, 4)){
      case "0E0":// 00E0 - CLS - Clear the display
      case "0e0":
      test00e0();
      break;
      case "0EE"://00EE - RET
      case "0ee":
      case "0Ee":
      case "0eE":
      test00ee();
      break;
    }
    break;
    case "1":// 1NNN - JP addr - Jump to location NNN
    test1nnn();
    break;
    case "2":// 2NNN - CALL addr - Call subroutine at NNN
    test2nnn();
    break;
    case "3":// 3XKK - SE Vx, byte - Skip next instruction if VX = KK
    test3xkk();
    break;
    case "4":// 4XKK - Skip next instruction if VX != KK
    test4xkk();
    break;
    case "5":// 5XY0 - Skip next instruction if VX = VY
    test5xy0();
    break;
    case "6":// 6XKK - Set VX == KK
    test6xkk();
    break;
    case "7":// 7XKK - Set VX = VX + KK
    test7xkk();
    break;
    case "8":
    switch(ins[3]){
      case "0":// 8XY0 - Set VX = VY
      test8xy0();
      break;

      case "1":// 8XY1 - Set VX = VX OR VY
      test8xy1();
      break;

      case "2":// 8XY2 - Set VX = VX AND VY
      test8xy2();
      break;

      case "3":// 8XY3 - Set VX = VX XOR VY
      test8xy3();
      break;

      case "4":// 8XY4 - Set VX = VX + VY, VF = 1 =
      test8xy4();
      break;

      case "5":// 8XY5 - Set VX = VX - VY, VF = 1 = not borrow
      test8xy5();
      break;

      case "6":// 8XY6 - Set VX = shiftingValue >> 1 (shiftingValue = register VY if legacyMode is true, shiftingValue = register VX otherwise)
      test8xy6();
      break;

      case "7":// 8XY7 - Set VX = VY - VX, VF = 1 = not borrow
      test8xy7();
      break;

      case "E":// 8XYe - Set VX = shiftingValue << 1 (shiftingValue = register VY if legacyMode is true, shiftingValue = register VX otherwise)
      case "e":
      test8xye();
      break;
    }
    case "9":// 9XY0 - Skip next instruction if VX != VY
    test9xy0();
    break;
    case "a":
    case "A":// ANNN - Set I = nnn.
    testANNN();
    break;
    case "b":
    case "B":// BNNN - Jump to location nnn + V0.
    testBNNN();
    break;
    case "c":
    case "C":// CXKK - Set VX = random byte AND KK
    testCXKK();
    break;
    case "d":
    case "D": //DXYN - display n-byte sprite at memory location I at (VX, VY), set VF = collision
    testDXYN();
    break;
    case "e":
    case "E":
    switch(ins.substring(2, 4)){
      case "9E":
      case "9e":// EX9E - SKP VX - Skip next instruction if key with the value of VX is pressed
      testEX9E();
      break;

      case "A1":
      case "a1":// EXA1 - SKNP - Skip next instruction if key with the value VX is not pressed
      testEXA1();
      break;
    }
    break;
    case "f":
    case "F": ////**** missing pushUndo ****////
    switch(ins.substring(2,4)){
      case "07":// FX07 - LD VX, DT - Set VX = delay timer value
      testFX07();
      break;

      case "0A":
      case "0a":// FX0A - LD VX, K - Wait for a key to press, store value of key into VX
      testFX0A();
      break;

      case "15":// FX15 - LD DT, VX - Set delay timer = VX
      testFX15();
      break;

      case "18":// FX18 - LD ST, VX - Set sound timer = VX
      testFX18();
      break;

      case "1E":
      case "1e":// FX1E - ADD I, VX - Set I = I + VX
      testFX1E();
      break;

      case "29":// FX29 - LD F, VX - Set I = location of sprite for digit VX
      testFX29();
      break;

      case "33":// FX33 - Store Binary Coded Decimal VX in memory location I, I+1, I+2
      testFX33();
      break;

      case "55":// FX55 - LD [I], VX - Store registers V0 through VX in memory starting at location I
      testFX55();
      break;

      case "65":// FX65 - LD VX, [I] - Read registers V0 through VX from memory starting at location I
      testFX65();
      break;
    }
    break;
  }
}

function testEmulationLoop(){
  let ins = chip.memory[parseInt(chip.programCounter, 16)] + chip.memory[parseInt(chip.programCounter, 16) + 1];
  let insResult = chip.executeInstruction(ins);
  if(insResult == 1){
    chip.setProgramCounter( (parseInt(chip.programCounter, 16) + 2).toString(16) );
    //console.log("\t\tPC should inc")///****
  }else if(insResult == 2){
    console.log("\t\tdo nothing")
    //do nothing
  }else if(!parseInt(chip.registerSoundTimer, 16) && !parseInt(chip.registerDelay, 16)){
    console.log("TogglePause should happen")
    chip.togglePause();
    console.log("invalid")
  }

  if(parseInt(chip.registerDelay, 16)){
    chip.setRegisterDelay((parseInt(chip.registerDelay, 16) -1).toString(16));
  }
  if(parseInt(chip.registerSoundTimer, 16)){
    chip.setRegisterSoundTimer((parseInt(chip.registerSoundTimer, 16) -1).toString(16));
  }

  updateOldVal();
  updateGenericLabels();
  updatePassingInstruction(ins);
  let nextIns = chip.memory[parseInt(chip.programCounter, 16)] + chip.memory[parseInt(chip.programCounter, 16) + 1];

  if(nextIns != "0000")
  this.testEmulationLoop();//////****
  chip.vis.updateHistory();
}
function printTestResult(){
  for(let i = 0; i < instructionList.length; i++){
    let name = instructionList[i][0] + " ";
    let result;
    if(instructionList[i][1]){
      result = "PASSED";
    }else{
      result = "FAILED"
    }
    console.log(name + result)
  }
}
function testInstructions(){
  initializeInstructionList();
  test00e0();
  test1nnn();

  //test6xkk();
  printTestResult();

  /*testInstructionsOld();
  testInstructionsOld();*/

}
function testInstructionsOld(){
  initializeInstructionList();
  program = giveTestProgram();
  //program = "00e0 66FF 60ff 00e0"
  chip.vis.init();
  chip.loadProgram(program);
  chip.paused = false;
/*  console.log("Program:\n" + program);
  console.log("Starting data: ");
  printAllVariables();*/
  testEmulationLoop();
  /*console.log("End testing")
  printAllVariables();*/
  printTestResult();
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
