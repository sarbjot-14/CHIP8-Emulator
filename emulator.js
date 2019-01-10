class emulator{
  constructor(){
    this.pixels = this.separatePixels(title);
    this.vis = new visualizer();
    this.registersV = new Array(16); //16 1byte registers Vx, each is from 00-FF
    this.registerI; //16bit register that holds addresses (00-FF)
    this.registerDelay = []; //8bit register. Decrements at a rate of 60Hz if non-zero
    this.registerSoundTimer = []; //8bit register. Decrements at a rate of 60Hz if non-zero
    this.programCounter = []; //stores program currently executing
    this.stackPointer = []; //used to point to the uppermost area of the stack
    this.stack = new Array(16); //16 16bit values
    this.undoStack = []; //stack used for undoing instructions. each value is in the form [instruction, {data}]
    this.memory = new Array(4096); //array of 4096 bytes. Bytes are fom 00-FF
    this.VF; //binary register not used by any program. (instruction flag)
  }

  start(){
    this.vis.init();
    this.updateScreen();
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
        if(this.pixels[(i+start)%64 + rowNum*64] == pix[i]){
          if(pix[i]==1){
            vfFlag = 1;
          }
          this.pixels[(i+start)%64 + rowNum*64] = 0;//update pixel in internal screen state
          this.vis.setPixel((i+start)%64 + rowNum*64, 0); //update pixel in visualizer
        }else{
          this.pixels[(i+start)%64 + rowNum*64] = 1; //update pixel in internal screen state
          this.vis.setPixel((i+start)%64 + rowNum*64, 1); //update pixel in visualizer
        }
      }
      return vfFlag;
    }

  }

  executeInstruction(ins){ //ins is a 4-character string with each character beteen 0-1 or a-f/A-F
    switch(ins[0]){
      case "0":
        switch(ins.substring(1,4)){

          case "0E0":// 00E0 - CLS - Clear the display
          case "0e0":
          //when the undo stack is implemented. add to it here
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
        let x = parseInt(this.registersV[parseInt(ins[1], 16)],16);
        let y = parseInt(this.registersV[parseInt(ins[2], 16)],16);
        let size = parseInt(ins[3], 16);

        let pixelStart = parseInt(this.registerI,16);

        this.VF = 0;
        for(let i=0; i<size; i++){
          let pixelByte = this.hexToBin(this.memory[pixelStart+i]);
          if(this.updateScreen(pixelByte,64*(y+i)+x)){
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
