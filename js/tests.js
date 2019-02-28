let topIndex = 0;
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

function testLoadProgram(program){
  chip.initializeData();
  program = program.replace(/\s+/g,"")
  chip.setMemory(512 , program.substring(0,2))
  chip.setMemory(513 , program.substring(2,4))
}

function printAllRegistersV(){
  for(let i = 0; i < chip.registersV.length; i++){
    console.log("\tV" + i.toString(16) + ": " + chip.registersV[i])
  }
}

function loadTestInstruction(instruction){
    console.log("\n\n\t-----Instruction " + instruction + " START-----")
    console.log("Old registers: ")
    printAllRegistersV()
    console.log("\tI: " + chip.registerI)
    console.log("\tDelay: " + chip.registerDelay)
    console.log("\tSound Timer: " + chip.registerSoundTimer)
    console.log("Old programCounter: " + chip.programCounter)
    console.log("Old stackPointer: " + chip.stackPointer)
    console.log("Old VF: " + chip.VF)

    console.log("******Executing instruction******");
    chip.loadProgram(instruction)
    chip.emulationLoop();

    console.log("New registers: ")
    printAllRegistersV()
    console.log("\tI: " + chip.registerI)
    console.log("\tDelay: " + chip.registerDelay)
    console.log("\tSound Timer: " + chip.registerSoundTimer)
    console.log("New programCounter: " + chip.programCounter)
    console.log("New stackPointer: " + chip.stackPointer)
    console.log("New programCounter: " + chip.programCounter)
    console.log("New stackPointer: " + chip.stackPointer)
    console.log("New VF: " + chip.VF)
    console.log("\t-----Instruction " + instruction + " END-----\n\n")
    chip.initializeData()
}

function testInstructions(){// this function is for the purpose of automated testing
  chip.initializeData()

  loadTestInstruction("00E0")
  loadTestInstruction("00EE")
  loadTestInstruction("1CA1")
  loadTestInstruction("23BC")
  loadTestInstruction("3401")
  loadTestInstruction("3400")
  loadTestInstruction("4401")
  loadTestInstruction("4400")
  loadTestInstruction("5400")
  loadTestInstruction("64FF")
  loadTestInstruction("64FF54FF")
}



  ///0NNN
  // console.log("\n>Instruction 00E0 START")
  // loadTestInstruction("00E0")
  // console.log("Cleared display")
  // console.log(">Instruction 00E0 END\n")
  // //00EE
  // console.log("\n>Instruction 00EE START")
  // console.log("Old programCounter: " + chip.programCounter)
  // loadTestInstruction("00EE")
  // console.log("Current programCounter: " + chip.programCounter)
  // console.log(">Instruction 00EE END\n")
  //
  // //1NNN
  // console.log("\n>Instruction 1NNN START")
  // console.log("Old programCounter: " + chip.programCounter)
  // loadTestInstruction("1CA1")
  // console.log("Current programCounter: " + chip.programCounter)
  // console.log(">Instruction 1NNN END\n")
  // //2NNN
  // console.log("\n>Instruction 2NNN START")
  // console.log("Old programCounter: " + chip.programCounter)
  // console.log("Old stackPointer: " + chip.stackPointer)
  // loadTestInstruction("13BC")
  // console.log("Current programCounter: " + chip.programCounter)
  // console.log("Current stackPointer: " + chip.stackPointer)
  // console.log(">Instruction 2NNN END\n")
  // //3XKK
  // console.log("\n>Instruction 3XKK START")
  // console.log("Old programCounter: " + chip.programCounter)
  // loadTestInstruction("3401")
  // console.log("Current programCounter: " + chip.programCounter)
  // console.log("Register V4: " + chip.registersV[4])
  // console.log(">Instruction 3XKK END\n")
  // //3XKK
  // console.log("\n>Instruction 3XKK START")
  // console.log("Old programCounter: " + chip.programCounter)
  // loadTestInstruction("3400")
  // console.log("Current programCounter: " + chip.programCounter)
  // console.log("Register V4: " + chip.registersV[4])
  // console.log(">Instruction 3XKK END\n")
  //
  //
  //
  //
  //
  // //7xkk - Set VX = VX + KK
  // chip.loadProgram("7014")
  // if(chip.registersV[0] == "14"){
  //   console.log("7014 - PASS")
  // }else{
  //   console.log("7014 - FAIL")
  // }
