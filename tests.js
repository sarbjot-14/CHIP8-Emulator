function drawTesting(){
  chip.setRegistersV(0,"03");
  chip.setRegistersV(1,"01");
  chip.setRegisterI("00");
  chip.setMemory(0,"93");
  chip.setMemory(1,"6D");
  chip.setMemory(2,"65");
}

function retTest(){
  chip.setStack(0,"0001");
  chip.setStack(1,"001F");
  chip.setStack(2,"01FE");
  chip.setStack(3,"1FED");
  chip.setStack(4,"FEDC");

  chip.setStackPointer(4);

  chip.setProgramCounter("EDCB");

}
