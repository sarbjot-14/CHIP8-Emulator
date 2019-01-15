/*  WORKING OPCODES:
-00E0
-00EE
-1nnn
-2nnn

*/

class emulator{
  constructor(){
    this.pixels = this.separatePixels(title);
    this.vis = new visualizer();
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

  }

  start(){
    this.vis.init();
    this.initializeRegisters();
    this.updateScreen();
  }
  initializeRegisters(){
    this.setRegisterI("0000");
    for(let i=0; i< 16; i++){
      this.setRegistersV(i,"00");
      this.setStack(i, "0000");
    }
    this.setRegisterDelay("00");
    this.setRegisterSoundTimer("00");
    this.setProgramCounter("0000");
    this.setStackPointer(0);
    for(let i= 0; i<4096;i++){
      this,this.setMemory(i, "00")
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
          break;
      }
    }
  }

  executeInstruction(ins){ //ins is a 4-character string with each character beteen 0-1 or a-f/A-F
    ins = ins.toLowerCase();
    switch(ins[0]){
      case "0":
        switch(ins.substring(1,4)){
          case "0E0":// 00E0 - CLS - Clear the display
          case "0e0":
            this.pushUndo(ins, {pixels:this.pixels.slice(0)} );
            this.updateScreen(new Array(64*32), 0, {fill: true});
            break;

          case "0EE"://00EE - RET
          case "0ee":
          case "0Ee":
          case "0eE":
            if(this.stackPointer > 0){
              this.pushUndo(ins,{programCounter:this.programCounter.slice(0), stackData:this.stack[this.stackPointer].slice(0)})
              this.setProgramCounter(this.popStack());
            }

          default:
            console.log("Error: Unknown opcode 0");

        }
        break;

      case "1":// 1NNN - JP addr - Jump to location NNN
        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});
        this.setProgramCounter(ins.substring(1,4));
        break;

      case "2":// 2NNN - CALL addr - Call subroutine at NNN
        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)}); //////****** not sure if this is correct *****///////
        this.pushStack(this.programCounter.slice(0));
        this.setProgramCounter(ins.substring(1,4));
        break;

      case "3":// 3XKK - SE Vx, byte - Skip next instruction if VX = KK
        let x = parseInt(ins[1],16);
        let kk =parseInt(ins.substring(2,3));

        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});
        if(this.registersV[x] == kk){
          this.setProgramCounter(this.programCounter + 2);
        }
        break;

      case "4":// 4XKK - Skip next instruction if VX != KK
        let x = parseInt(ins[1],16);
        let kk =parseInt(ins.substring(2,3));

        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});
        if(this.registersV[x] != kk){
          this.setProgramCounter( (parseInt(this.programCounter, 16) + 2).toString(16) );
        }
        break;

      case "5":// 5XY0 - Skip next instruction if VX = VY
        let x = parseInt(ins[1],16);
        let y = parseInt(ins[2],16);

        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});
        if(this.registersV[x] == this.registersV[y])
          this.setProgramCounter( (parseInt(this.programCounter, 16) + 2).toString(16) );
        break;

      case "6":// 6XKK - Set VX == KK
        let x = parseInt(ins[1],16);
        let kk = parseInt(ins.substring(2,3));

        this.pushUndo(ins,{registersV:this.registersV[x].slice(0)}); /////////****************** not sure if this is correct*****************///////////////
        this.setRegistersV(x, kk);
        break;

      case "7":// 7XKK - Set VX = VX + KK
        let x = parseInt(ins[1],16);
        let kk = parseInt(ins.substring(2,3));

        this.pushUndo(ins,{registersV:this.registersV[x].slice(0)}); /////////****************** not sure if this is correct*****************///////////////
        this.setRegistersV(x, (parseInt(this.registersV[x], 16) + parseInt(kk, 16)).toString(16) );
        break;

      case "8":
      let x = parseInt(ins[1],16);
      let y = parseInt(ins[2],16);
      this.pushUndo(ins,{registersVX:this.registersV[x].slice(0), registersVY:this.registersV[y].slice(0), flagV:this.VF.slice(0)});// push to undo stacks: VX, VY, VF(carry flag)
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

          case "4":// 8XY4 - Set VX = VX + VY, VF = 1 = carry
            if( (parseInt(this.registersV[x], 16) + parseInt(his.registersV[y], 16)) > parseInt("FF", 16)){
              this.setRegistersV(x, (parseInt(this.registersV[x], 16) + parseInt(his.registersV[y], 16)).toString(16).substring(0,3))
              this.setVF(1);
            }else{
              this.setRegistersV(x, (parseInt(this.registersV[x], 16) + parseInt(his.registersV[y], 16)).toString(16)  );
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
        break;

      case "9":// 9XY0 - Skip next instruction if VX != VY
        let x = parseInt(ins[1],16);
        let y = parseInt(ins[2],16);
        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});

        if(this.registersV[x] != this.registersV[y]){
          this.setProgramCounter( (parseInt(this.programCounter, 16) + 2).toString(16) );
        }
        break;

      case "a":
      case "A":// ANNN - Set I = nnn.
        this.pushUndo(ins,{registerI:this.registerI.slice(0)});
        this.setRegisterI(ins.substring(1,4))
        break;

      case "b":
      case "B":// BNNN - Jump to location nnn + V0.
        this.pushUndo(ins,{programCounter:this.programCounter.slice(0)});
        this.setProgramCounter( (parseInt(ins.substring(1,4), 16) + parseInt(registersV[0], 16)).toString(16) )
        break;

      case "c":
      case "C":// CXKK - Set VX = random byte AND KK
        this.pushUndo(ins, {registersV: this.registersV[parseInt(ins[1], 16)]});
        this.setRegistersV( parseInt(ins[1], 16) ,(Match.round(Match.random()*255) & parseInt(ins.substring(2,4), 16)).toString(16) );
        break;

      case "d":
      case "D": //DXYN - display n-byte sprite at memory location I at (VX, VY), set VF = collision
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
  /*      let x = parseInt(ins[1], 16);
        switch(ins.substring(2, 3)){
          case "9E":
          case "9e":// EX9E - SKP VX - Skip next instruction if key with the value of VX is pressed

            break;

          case "A1":
          case "a1":// EXA1 - SKNP - Skip next instruction if key with the value VX is not pressed

            break;
        }*/
        break;

      case "f":
      case "F":
        let x = parseInt(ins[1], 16);
        switch(ins.substring(2, 3)){
          case "07":// FX07 - LD VX, DT - Set VX = delay timer value
            setRegistersV(this.registersV[x], this.registerDelay);
            break;

          /*case "0A"// FX0A - LD VX, K - Wait for a key to press, store value of key into VX
            break;*/

          case "15":// FX15 - LD DT, VX - Set delay timer = VX
            setRegisterDelay(this.registersV[x]);
            break;

          case "18":// FX18 - LD ST, VX - Set sound timer = VX
            setRegisterSoundTimer(this.registersV[x]);
            break;

          case "1E":
          case "1e":// FX1E - ADD I, VX - Set I = I + VX
            setRegisterI((parseInt(this.registerI, 16) + parseInt(this.registersV[x], 16)).toString(16));
            break;

        /*  case "29":// FX29 - LD F, VX - Set I = Location of sprite for digit VX
            break;*/

          case "33":// FX33 - Store Binary Coded Decimal VX in memory location I, I+1, I+2
            let registerVX = parseInt(this.regitersV[x], 16).toString(10);

            if(registerVX.length == 3)
              setMemory(this.registerI, registerVX[0]);
              setMemory(this.registerI + 1, registerVX[1]);
              setMemory(this.registerI + 2, registerVX[2]);
            else if(registerVX.length == 2)
              setMemory(this.registerI + 1, registerVX[0]);
              setMemory(this.registerI + 2, registerVX[1]);
            else
              setMemory(this.registerI + 2, registerVX[0])
            break;

          case "55":// FX55 - LD [I], VX - Store registers V0 through VX in memory starting at location I
              let maxReg = parseInt(ins[1], 16);
              let regI = parseInt(this.registerI, 16);

              for(let int i = 0; i <= maxReg; i++){
                setMemory(regI, this.registersV[i])
                regI += 2;
              }
              break;

          case "65":// FX65 - LD VX, [I] - Read registers V0 through VX from memory starting at location I
            let maxReg = parseInt(ins[1], 16);
            let regI = parseInt(this.registerI, 16);

            for(let int i = 0; i <= maxReg; i++){
              setRegistersV(i, this.memory[regI])
              regI += 2;
            }
            break;
        }
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
