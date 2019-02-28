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

function printOldVariables(){
  console.log("Old registers: ")
  printAllRegistersV()
  console.log("\tI: " + chip.registerI)
  console.log("\tDelay: " + chip.registerDelay)
  console.log("\tSound Timer: " + chip.registerSoundTimer)
  console.log("Old programCounter: " + chip.programCounter)
  console.log("Old stackPointer: " + chip.stackPointer)
  console.log("Old VF: " + chip.VF)
}

function printNewVariables(){
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
}

function loadTestInstruction(instruction){
    console.log("\n\n\t---------------Instruction " + instruction + " START---------------")
    printOldVariables()

    console.log("******Executing instruction******");
    chip.loadProgram(instruction)
    chip.emulationLoop()

    printnewVariables()
    console.log("\t---------------Instruction " + instruction + " END---------------\n\n")
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
  loadTestInstruction("7419")
  loadTestInstruction("8400")
}
