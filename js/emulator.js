class emulator{
  constructor(){
    this.pixels = this.separatePixels(title);
    this.vis = new visualizer(this);
    this.undoStack = []; //stack used for undoing instructions. each value is in the form [instruction, {data}]

    this.registersV = new Array(16); //16 1byte registers Vx, each is from 00-FF
    this.registerI; //16bit register that holds addresses (0000-FFFF)
    this.registerDelay; //8bit register. Decrements at a rate of 60Hz if non-zero
    this.registerSoundTimer; //8bit register. Decrements at a rate of 60Hz if non-zero
    this.programCounter; //stores program currently executing. 16 bit (0000-FFFF)
    this.stackPointer; //used to point to the uppermost area of the stack 8bit (0-255 instead of hex)
    this.stack = new Array(16); //Stack contains program return order. 16 16bit values (0000-FFFF).
    this.memory = new Array(4096); //array of 4096 bytes. Bytes are fom 00-FF
    this.VF; //1bit register not used by any program. (instruction flag)

    this.paused; //true if paused (step forward still avsilable)
    this.speed = 1; //speed multiplier

    this.keyInput = {
      "0": false,
      "1": false,
      "2": false,
      "3": false,
      "4": false,
      "5": false,
      "6": false,
      "7": false,
      "8": false,
      "9": false,
      "a": false,
      "b": false,
      "c": false,
      "d": false,
      "e": false,
      "f": false
    }
  }

  start(){
    this.vis.init();
    this.initializeData();
    this.updateScreen();
  }
  initializeData(){
    this.paused = true;
    this.pixels = this.separatePixels(title);
    this.updateScreen();
    this.undoStack = [];
    this.setRegisterI("0000");
    this.setVF(0)
    for(let i=0; i< 16; i++){
      this.setRegistersV(i,"00");
      this.setStack(i, "0000");
    }
    this.setRegisterDelay("00");
    this.setRegisterSoundTimer("00");
    this.setProgramCounter("0200");
    this.setStackPointer(0);
    for(let i=0; i<4096;i++){
      this,this.setMemory(i, "00");
    }
    this.setupFont();
  }

  emulationLoop(){
    //run code at program programCounter
    let ins = this.memory[parseInt(this.programCounter, 16)] + this.memory[parseInt(this.programCounter, 16) + 1];

    let insResult = this.executeInstruction(ins);
    if(insResult == 1){
      //increment programCounter by 2
      this.setProgramCounter( (parseInt(this.programCounter, 16) + 2).toString(16) );
    }else if(insResult == 2){
      //do nothing
    }else if(!parseInt(this.registerSoundTimer, 16) && !parseInt(this.registerDelay, 16)){
      this.togglePause();
    }

    //decrement timers
    if(parseInt(this.registerDelay, 16)){
      this.setRegisterDelay((parseInt(this.registerDelay) -1).toString(16));
    }
    if(parseInt(this.registerSoundTimer, 16)){
      this.setRegisterSoundTimer((parseInt(this.registerSoundTimer) -1).toString(16));
    }



    //delay (60Hz)
    if(!this.paused){
      setTimeout(function(){chip.emulationLoop()},(50/3)*this.speed); //I'm not sure if theres a way to do it without using chip object by name
    }
  }

  loadProgram(program){ //program must be a hex string
    program = program.replace(/\s+/g,"")
    this.initializeData()
    for(let i=0; i < program.length; i += 2){
      if(program[i+1]){
        this.setMemory(512+(i/2), program.substring(i,i+2)); //memory starts at "0200" hex which is 512
      }else{ //last character is missing.
        this.setMemory(512+(i/2), (program[i]+"0") );
      }
    }
  }

  setRegistersV(index,data){
    this.registersV[index] = this.fixHexLength(data, 2);
    this.vis.updateRegistersV();
  }
  setRegisterI(data){
    this.registerI = this.fixHexLength(data, 4);
    this.vis.updateRegisterI();
  }
  setRegisterDelay(data){
    this.registerDelay = this.fixHexLength(data, 2);
    this.vis.updateRegisterDelay();
  }
  setRegisterSoundTimer(data){
    this.registerSoundTimer = this.fixHexLength(data, 2);
    this.vis.updateRegisterSoundTimer();
  }
  setProgramCounter(data){
    this.programCounter = this.fixHexLength(data, 4);
    this.vis.updateProgramCounter();
  }
  setStackPointer(data){
    this.stackPointer = data;
    this.vis.updateStackPointer();
  }
  setStack(index, data){
    this.stack[index] = this.fixHexLength(data, 4);
    this.vis.updateStack();
  }
  setMemory(index, data){
    this.memory[index] = this.fixHexLength(data, 2);
    this.vis.updateMemory();
  }
  setVF(data){
    this.VF = data;
    this.vis.updateVF();
  }

  fixHexLength(val, len){
    if(val.length > len){
      console.log("Error in fixHexLength()")
    }
    while(val.length < len){
      val = "0"+val;
    }
    return val.toLowerCase();
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

  popStack(){
    if(this.stackPointer > 0){
      let result = this.stack[this.stackPointer];
      this.setStackPointer(this.stackPointer-1);
      this.vis.updateStack();
      return result;
    }
  }
  pushStack(val){
    if(this.stackPointer > 15){
      console.log("Chip-8 ERROR: cant add to a full stack");
    }else{
      this.setStackPointer(this.stackPointer+1);
      this.setStack(this.stackPointer, val);
    }

  }
  pushUndo(ins, data){
    this.undoStack.push([ins, data]);
  }
  clearUndo(){
    this.undoStack = [];
  }

  undo(){// uses this.undoStack to undo the last instruction
    if(this.undoStack.length > 0){
      let popped = this.undoStack.pop();
      let ins = popped[0];
      let data = popped[1];

      this.setProgramCounter((parseInt(this.programCounter,16)-2).toString(16) );

      switch(ins[0]){
        case "0":
          switch(ins.substring(1,4)){
            case "0E0":// 00E0 - CLS - Clear the display
            case "0e0":
              this.updateScreen(data.pixels, 0, {fill: true});
              break;

            case "0EE"://00EE - RET
            case "0ee":
            case "0Ee":
            case "0eE":
              this.setProgramCounter(data.programCounter);
              this.pushStack(data.stackData);
              break;
          }
          break;

        case "1":
          this.setProgramCounter(data.programCounter);
          break;

        case "2":
          this.popStack();
          this.setProgramCounter(data.programCounter);
          break;

        case "3":// 3XKK - SE Vx, byte - Skip next instruction if VX = KK
          this.setProgramCounter(data.programCounter);
          break;

        case "4":// 4XKK - Skip next instruction if VX != KK
          this.setProgramCounter(data.programCounter);
          break;

        case "5":// 5XY0 - Skip next instruction if VX = VY
          this.setProgramCounter(data.programCounter);
          break;

        case "6":  // 6XKK - Set VX == KK
          this.setRegistersV(parseInt(ins[1],16), data.registersV);
          break;

        case "7": // 7XKK - Set VX = VX + KK
          this.setRegistersV(parseInt(ins[1],16), data.registersV);
          break;

        case "8":
          this.setRegistersV(parseInt(ins[1],16), data.registersVX);
          this.setRegistersV(parseInt(ins[2],16), data.registersVY);
          this.setVF(data.flagV);
          break;

        case "9": // 9XY0 - Skip next instruction if VX != VY
          this.setProgramCounter(data.programCounter);
          break;

        case "a":
        case "A"://Set I = nnn.
          this.setRegisterI(data.registerI);
          break;

        case "b":
        case "B": //Jump to location nnn + V0.
          this.setProgramCounter(data.programCounter);
          break;

        case "c":
        case "C":
          this.setRegistersV(parseInt(ins[1],16), data.registersV);
          break;

        case "d":
        case "D": //DXYN
          this.updateScreen(data.pixels,0,{fill:true});
          this.setVF(data.vf)
          break;

        case "e":
        case "E":
          break;

        case "f":
        case "F":
          switch(ins.substring(2,4)){
            case "0A":
              this.setRegistersV(parseInt(ins[1],16), data.registersV);
              break;
          }
          break;
      }

    }
  }

  //returns 0 on invalid instruction, 1 on executed instructions with undo stack push, and 2 if program counter shouldn't increment (for instructions that wait)
  //returns 1 if instruction was valid (ie pushUndo() was called) and 0 otherwise
  executeInstruction(ins){ //ins is a 4-character string with each character beteen 0-1 or a-f/A-F
    ins = ins.toLowerCase();
    let x = parseInt(ins[1],16);
    let y = parseInt(ins[2],16);
    let kk = ins.substring(2,4);
    let nnn = ins.substring(1,4);
    //console.log(ins) //enable this line to get opcode readouts
    switch(ins[0]){
      case "0":
        switch(ins.substring(1,4)){
          case "0E0":// 00E0 - CLS - Clear the display
          case "0e0":
            this.pushUndo(ins, {pixels:this.pixels.slice(0)} );
            this.updateScreen(new Array(64*32), 0, {fill: true});
            return 1;

          case "0EE"://00EE - RET
          case "0ee":
          case "0Ee":
          case "0eE":
            if(this.stackPointer > 0){
              this.pushUndo(ins,{programCounter:this.programCounter.slice(0), stackData:this.stack[this.stackPointer].slice(0)});
              this.setProgramCounter(this.popStack());
            }
            return 1;

          default:
            console.log("Error: Unknown opcode 0");
            break;
        }
        break;

      case "1":// 1NNN - JP addr - Jump to location NNN
        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});
        this.setProgramCounter((parseInt(nnn,16)-2).toString(16)); //minus two so it doesnt skip first instruction
        return 1;

      case "2":// 2NNN - CALL addr - Call subroutine at NNN
        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)}); ////****not sure if this is correct ****////
        this.pushStack(this.programCounter.slice(0));
        this.setProgramCounter(nnn);
        return 1;

      case "3":// 3XKK - SE Vx, byte - Skip next instruction if VX = KK
        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});
        if(this.registersV[x] == kk){
          this.setProgramCounter((parseInt(this.programCounter, 16) + 2).toString(16));
        }
        return 1;

      case "4":// 4XKK - Skip next instruction if VX != KK
        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});
        if(this.registersV[x] != kk){
          this.setProgramCounter( (parseInt(this.programCounter, 16) + 2).toString(16) );
        }
        return 1;

      case "5":// 5XY0 - Skip next instruction if VX = VY
        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});
        if(this.registersV[x] == this.registersV[y]){
          this.setProgramCounter( (parseInt(this.programCounter, 16) + 2).toString(16) );
        }
        return 1;

      case "6":// 6XKK - Set VX == KK
        this.pushUndo(ins,{registersV:this.registersV[x].slice(0)}); ////**** not sure if this is correct****////
        this.setRegistersV(x, kk);
        return 1;

      case "7":// 7XKK - Set VX = VX + KK
        this.pushUndo(ins,{registersV:this.registersV[x].slice(0)}); ////**** not sure if this is correct****////
        this.setRegistersV(x, (parseInt(this.registersV[x], 16) + parseInt(kk, 16)).toString(16) );
        return 1;

      case "8":
        this.pushUndo(ins,{registersVX:this.registersV[x].slice(0), registersVY:this.registersV[y].slice(0), flagV:this.VF});// push to undo stacks: VX, VY, VF(carry flag)
        switch(ins[3]){
          case "0":// 8XY0 - Set VX = VY
            this.setRegistersV(x, this.registersV[y]);
            break;

          case "1":// 8XY1 - Set VX = VX OR VY
            this.setRegistersV(x, (parseInt(this.registersV[x], 16) | parseInt(this.registersV[y], 16)).toString(16) );
            break;

          case "2":// 8XY2 - Set VX = VX AND VY
            this.setRegistersV(x, (parseInt(this.registersV[x], 16) & parseInt(this.registersV[y], 16)).toString(16) );
            break;

          case "3":// 8XY3 - Set VX = VX XOR VY
            this.setRegistersV(x, (parseInt(this.registersV[x], 16) ^ parseInt(this.registersV[y], 16)).toString(16) );
            break;

          case "4":// 8XY4 - Set VX = VX + VY, VF = 1 =
            if( (parseInt(this.registersV[x], 16) + parseInt(this.registersV[y], 16)) > parseInt("FF", 16)){
              this.setRegistersV(x, (parseInt(this.registersV[x], 16) + parseInt(this.registersV[y], 16)).toString(16).substring(0,4));
              this.setVF(1);
            }else{
              this.setRegistersV(x, (parseInt(this.registersV[x], 16) + parseInt(this.registersV[y], 16)).toString(16)  );
            }

            break;

          case "5":// 8XY5 - Set VX = VX - VY, VF = 1 = not borrow
            if(parseInt(this.registersV[x], 16) > parseInt(this.registersV[y], 16)){
              this.setVF(1);
            }

            this.setRegistersV(x, (parseInt(this.registersV[x], 16) - parseInt(this.registersV[y], 16)).toString(16) );
            break;

          case "6":// 8XY6 - Set VX = VX >> 1
            if(( parseInt(this.registersV[x], 16) % 2) != 0){
              this.setVF(1);
            }

            this.setRegistersV(x, (parseInt(this.registersV[x], 16) / 2).toString(16) );
            break;

          case "7":// 8XY7 - Set VX = VY - VX, VF = 1 = not borrow
            if(parseInt(this.registersV[y], 16) > parseInt(this.registersV[x], 16)){
              this.setVF(1);
            }

            this.setRegistersV(x, (parseInt(this.registersV[x], 16) - parseInt(this.registersV[y], 16)).toString(16) );
            break;

          case "E":// 8XY5 - Set VX = VX << 1
          case "e":
            if(parseInt(this.registersV[x], 16) >= 128){
              this.setVF(1);
            }

            this.setRegistersV(x, (parseInt(this.registersV[x]) * 2).toString(16) );
            break;

          default:// Print error if doesn't regconize instruction
            console.log("Error: Unkown opcode 8");
        }
        return 1;

      case "9":// 9XY0 - Skip next instruction if VX != VY
        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});

        if(this.registersV[x] != this.registersV[y]){
          this.setProgramCounter( (parseInt(this.programCounter, 16) + 2).toString(16) );
        }
        return 1;

      case "a":
      case "A":// ANNN - Set I = nnn.
        this.pushUndo(ins,{registerI:this.registerI.slice(0)});
        this.setRegisterI(ins.substring(1,4));
        return 1;

      case "b":
      case "B":// BNNN - Jump to location nnn + V0.
        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});
        this.setProgramCounter( (parseInt(nnn, 16) + parseInt(registersV[0], 16)).toString(16) );
        return 1;

      case "c":
      case "C":// CXKK - Set VX = random byte AND KK
        this.pushUndo(ins, {registersV: this.registersV[parseInt(ins[1], 16)]});
        this.setRegistersV( parseInt(ins[1], 16) ,(Match.round(Match.random()*255) & parseInt(ins.substring(2,4), 16)).toString(16) );
        return 1;

      case "d":
      case "D": //DXYN - display n-byte sprite at memory location I at (VX, VY), set VF = collision
        this.pushUndo(ins,{vf:this.VF, pixels:this.pixels.slice(0)});
        let size = parseInt(ins[3], 16);
        let pixelStart = parseInt(this.registerI,16);

        this.VF = 0;
        for(let i=0; i<size; i++){
          let pixelByte = this.hexToBin(this.memory[pixelStart+i]);
          let posX = parseInt(this.registersV[x],16);
          let posY = parseInt(this.registersV[y],16);
          if(this.updateScreen(pixelByte,64*(this.mod((posY+i),32))+posX)){
            this.VF = 1;
          }
        }
        return 1;

      case "e":
      case "E":
        this.pushUndo(ins, {programCounter:this.programCounter.slice(0)});
        switch(ins.substring(2, 4)){
          case "9E":
          case "9e":// EX9E - SKP VX - Skip next instruction if key with the value of VX is pressed
            if(this.keyInput == x){
               this.setProgramCounter((parseInt(this.programCounter, 16) + 2).toString(16));
            }
            break;

          case "A1":
          case "a1":// EXA1 - SKNP - Skip next instruction if key with the value VX is not pressed
            if(this.keyInput !== x){
               this.setProgramCounter((parseInt(this.programCounter, 16) + 2).toString(16));
            }
            break;
        }
        break;

      case "f":
      case "F": ////**** missing pushUndo ****////
        let maxReg = parseInt(ins[1], 16);
        let regI = parseInt(this.registerI, 16);
        switch(ins.substring(2,4)){
          case "07":// FX07 - LD VX, DT - Set VX = delay timer value
            this.setRegistersV(x, this.registerDelay);
            break;

          case "0A":
          case "0a":// FX0A - LD VX, K - Wait for a key to press, store value of key into VX
            for(let i=0; i< 16; i++){
              if(this.keyInput[i.toString(16)]){
                this.pushUndo(ins,{registersV:this.registersV[x].slice(0)});
                this.setRegistersV(x, i.toString(16));
                return 1;
              }
            }
            return 2;

          case "15":// FX15 - LD DT, VX - Set delay timer = VX
            this.setRegisterDelay(this.registersV[x]);
            break;

          case "18":// FX18 - LD ST, VX - Set sound timer = VX
            this.setRegisterSoundTimer(this.registersV[x]);
            break;

          case "1E":
          case "1e":// FX1E - ADD I, VX - Set I = I + VX
            this.setRegisterI((parseInt(this.registerI, 16) + parseInt(this.registersV[x], 16)).toString(16));
            break;

          case "29":// FX29 - LD F, VX - Set I = location of sprite for digit VX

            break;

          case "33":// FX33 - Store Binary Coded Decimal VX in memory location I, I+1, I+2
            let registerVX = parseInt(this.regitersV[x], 16).toString(10);

            if(registerVX.length == 3){
              this.setMemory(this.registerI, registerVX[0]);
              this.setMemory(this.registerI + 1, registerVX[1]);
              this.setMemory(this.registerI + 2, registerVX[2]);
            }
            else if(registerVX.length == 2){
              this.setMemory(this.registerI + 1, registerVX[0]);
              this.setMemory(this.registerI + 2, registerVX[1]);
            }
            else
              this.setMemory(this.registerI + 2, registerVX[0]);
            break;

          case "55":// FX55 - LD [I], VX - Store registers V0 through VX in memory starting at location I
              for(let i = 0; i <= maxReg; i++){
                this.setMemory(regI, this.registersV[i]);
                regI += 2;
              }
              break;

          case "65":// FX65 - LD VX, [I] - Read registers V0 through VX from memory starting at location I
            for(let i = 0; i <= maxReg; i++){
              this.setRegistersV(i, this.memory[regI]);
              regI += 2;
            }
            break;
        }
        break;
    }
    return 0;
  }//end of executeInstruction()

  togglePause(){//pause or resume the running program
    this.paused = !this.paused;
    this.vis.updatePaused(this.paused);
    if(!this.paused){
        this.emulationLoop();
    }
  }
  byteFromMem(address){//returns a byte from memory ad a given address (int 0-255)
    return this.memory[address];
  }
  mod(x,n){ //modulus that works with negative numbers. found online, sourced in sources.txt
    return (x % n + n) % n;
  }
  hexToBin(hex, len = 8){// translate from hexadecimal to binary
    let result = this.separatePixels(parseInt(hex,16).toString(2));
    while(result.length < len){
      result = [0].concat(result);
    }
    return result;
  }
  separatePixels(pixString){ //converts binary string into an int array
    let result = [];
    for(let i=0;i<pixString.length;i++){
      result.push(parseInt(pixString[i],2));
    }
    return result;
  }
  keyIsDown(key){// recognize if a key is pressed
    return this.keyInput[key];
  }
  setupFont(){// Setup a list of Chip-8 fonts and place them into beginning of the memory
    let fot0 = ["F0", "90", "90", "90", "F0"];
    let font1 = ["20", "60", "20", "20", "70"];
    let font2 = ["F0", "10", "F0", "80", "F0"];
    let font3 = ["F0", "10", "F0", "10", "F0"];
    let font4 = ["90", "90", "F0", "10", "10"];
    let font5 = ["F0", "80", "F0", "10", "F0"];
    let font6 = ["F0", "80", "F0", "90", "F0"];
    let font7 = ["F0", "10", "20", "40", "40"];
    let font8 = ["F0", "90", "F0", "90", "F0"];
    let font9 = ["F0", "90", "F0", "10", "F0"];
    let fontA = ["F0", "90", "F0", "90", "90"];
    let fontB = ["E0", "90", "E0", "90", "E0"];
    let fontC = ["F0", "80", "80", "80", "F0"];
    let fontD = ["E0", "90", "90", "90", "E0"];
    let fontE = ["F0", "80", "F0", "80", "F0"];
    let fontF = ["F0", "80", "F0", "80", "80"];
    let fontArray = [
      font0,
      font1,
      font2,
      font3,
      font4,
      font5,
      font6,
      font7,
      font8,
      font9,
      fontA,
      fontB,
      fontC,
      fontD,
      fontE,
      fontF
    ];
    for(let int i=0; i<fromArray.length; i++){
      setMemory(i, fontArray[i]);
    }
  }
}
let chip = new emulator();
