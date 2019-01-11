class emulator{
  constructor(){
    this.pixels = this.separatePixels(title);
    this.vis = new visualizer();
    this.undoStack = []; //stack used for undoing instructions. each value is in the form [instruction, {data}]

    this.registersV = new Array(16); //16 1byte registers Vx, each is from 00-FF
    this.registerI; //16bit register that holds addresses (00-FF)
    this.registerDelay; //8bit register. Decrements at a rate of 60Hz if non-zero
    this.registerSoundTimer; //8bit register. Decrements at a rate of 60Hz if non-zero
    this.programCounter; //stores program currently executing 16 bit (0000-FFFF)
    this.stackPointer; //used to point to the uppermost area of the stack 8bit (00-FF)
    this.stack = new Array(16); //16 16bit values. each 16 bit value is from 0000-FFFF
    this.memory = new Array(4096); //array of 4096 bytes. Bytes are fom 00-FF
    this.VF; //1bit register not used by any program. (instruction flag)

  }

  start(){
    this.vis.init();
    this.updateScreen();
  }

  setRegistersV(index,data){
    this.registersV[index] = data;
    this.vis.updateRegistersV();
  }
  setRegisterI(data){
    this.registerI = data;
    this.vis.updateRegisterI();
  }
  setRegisterDelay(data){
    this.registerDelay = data;
    this.vis.updateRegisterDelay();
  }
  setRegisterSoundTimer(data){
    this.registerSoundTimer = data;
    this.vis.updateRegisterSoundTimer();
  }
  setProgramCounter(data){
    this.programCounter = data;
    this.vis.updateProgramCounter();
  }
  setStackPointer(data){
    this.stackPointer = data;
    this.vis.updateStackPointer();
  }
  setStack(index, data){
    this.stack[index] = data;
    this.vis.updateStack();
  }
  setMemory(index, data){
    this.memory[index] = data;
    this.vis.updateMemory();
  }
  setVF(data){
    this.VF = data;
    this.vis.updateVF();
  }

  undo(){// uses this.undoStack to undo the last instruction
    if(this.undoStack.length > 0){
      let popped = this.undoStack.pop();
      let ins = popped[0];
      let data = popped[1];

      switch(ins[0]){
        case "0":
          switch(ins.substring(1,4)){
            case "0E0":// 00E0 - CLS - Clear the display
            case "0e0":
              this.updateScreen(data.pixels, 0, {fill: true});
              break;
          }
          break;

        case "1":
          break;

        case "2":
          break;

        case "3":
          break;

        case "4":
          break;

        case "5":
          break;

        case "6":
          break;

        case "7":
          break;

        case "8":
          break;

        case "9":
          break;

        case "a":
        case "A":
          break;

        case "b":
        case "B":
          break;

        case "c":
        case "C":
          break;

        case "d":
        case "D": //Dxyn
          this.updateScreen(data.pixels,0,{fill:true});
          this.setVF(data.vf)
          break;

        case "e":
        case "E":
          break;

        case "f":
        case "F":
          break;
      }
    }
  }
  pushUndo(ins, data){
    this.undoStack.push([ins, data]);
  }
  clearUndo(){
    this.undoStack = [];
  }



  //Updates the screen given a binary array and a starting index
  updateScreen(pix, start = 0, options = {}){
    if(!pix){ //if no pixels are provided, refresh the entire screen
      pix = this.pixels;
      options = {fill:true};
    }
    if (options.fill == true) { //fill mode is the method that continues on the next row
      for(let i=0; (i<pix.length)&&(i+start < 64*32); i++){
        this.pixels[(i+start)] = pix[i]; //update pixel in internal screen state
        this.vis.setPixel((i+start), pix[i]); //update pixel in visualizer
      }
    }else{ //traditional Chip method
      let vfFlag = 0;
      let rowNum = Math.floor( (start)/64);;
      for(let i=0; (i<pix.length)&&(i+start < 64*32); i++){
        if(this.pixels[(i+start)%64 + rowNum*64] ^ !pix[i]){ // a ^ !b is the same as a == b but allows for undefined and zero to count as false
          if(pix[i]==1){
            vfFlag = 1;
          }
          this.pixels[this.mod((i+start),64) + rowNum*64] = 0;//update pixel in internal screen state
          this.vis.setPixel(this.mod((i+start),64) + rowNum*64, 0); //update pixel in visualizer
        }else{
          this.pixels[this.mod((i+start),64) + rowNum*64] = 1; //update pixel in internal screen state
          this.vis.setPixel(this.mod((i+start),64) + rowNum*64, 1); //update pixel in visualizer
        }
      }
      return vfFlag;
    }

  }


  executeInstruction(ins){ //ins is a 4-character string with each character beteen 0-1 or a-f/A-F
    console.log(ins)
    switch(ins[0]){
      case "0":
        switch(ins.substring(1,4)){
          case "0E0":// 00E0 - CLS - Clear the display
          case "0e0":
            this.pushUndo(ins, {pixels:this.pixels.slice(0)} );
            this.updateScreen(new Array(64*32), 0, {fill: true});
            break;
        }
        break;

      case "1":
        break;

      case "2":
        break;

      case "3":
        break;

      case "4":
        break;

      case "5":
        break;

      case "6":
        break;

      case "7":
        break;

      case "8":
        break;

      case "9":
        break;

      case "a":
      case "A":
        break;

      case "b":
      case "B":
        break;

      case "c":
      case "C":
        break;

      case "d":
      case "D": //Dxyn
        this.pushUndo(ins,{vf:this.VF, pixels:this.pixels.slice(0)});

        let x = parseInt(this.registersV[parseInt(ins[1], 16)],16);
        let y = parseInt(this.registersV[parseInt(ins[2], 16)],16);
        let size = parseInt(ins[3], 16);

        let pixelStart = parseInt(this.registerI,16);

        this.VF = 0;
        for(let i=0; i<size; i++){
          let pixelByte = this.hexToBin(this.memory[pixelStart+i]);
          if(this.updateScreen(pixelByte,64*(this.mod((y-i),32))+x)){
            this.VF = 1;
          }
        }

        break;

      case "e":
      case "E":
        break;

      case "f":
      case "F":
        break;

    }
  }

  byteFromMem(address){//returns a byte from memory ad a given address (int 0-255)
    return this.memory[address];
  }

  mod(x,n){ //modulus that works with negative numbers. found online, sourced in sources.txt
    return (x % n + n) % n;
  }

  hexToBin(hex){
    return this.separatePixels(parseInt(hex,16).toString(2));
  }

  separatePixels(pixString){ //converts binary string into an int array
    let result = [];
    for(let i=0;i<pixString.length;i++){
      result.push(parseInt(pixString[i],2));
    }
    return result;
  }

}
let chip = new emulator();
