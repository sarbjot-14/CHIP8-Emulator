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

function testInstructions(){// this function is for the purpose of automated testing NOT FINISHED
  //7xkk - Set VX = VX + KK
  chip.loadProgram("7014")
  if(chip.regitersV[0] == "14"){
    console.log("7014 - PASS")
  }else{
    console.log("7014 - FAIL")
  }
}
