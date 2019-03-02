

class chip8Compiler{
  constructor(){

  }
  compileMneonicToOpcodes(code){
    let result = this.removeComments(code);
    result = this.removeEmptyLines(result);
    let assemblyArray = this.splitAssembly(result);


    //convert assembly to opcode one line at a time
    for(let x=0 ; x< assemblyArray.size ; x++){

      command = this.replaceAssemblyWithOpcode(command);
      assemblyArray[x] = command;
      console.log(command);
    }
    //final opcodes is the good version of the opcodes
    let finalOpcodes = "";
    assemblyArray.forEach(function(command) {
      finalOpcodes += command + "\n";
    });

    console.log(finalOpcodes);
    return finalOpcodes;
  }
  removeComments(code){
    console.log("removing comments");
    let result = code.replace(/;.*\n*/g, "\n");
    console.log(result);
    return result;
  }
  splitAssembly(code){
    let assemblyArray = code.split("\n");
    return assemblyArray;

  }
  removeEmptyLines(code){
    let result = code.replace(/\t+/g,"");
    result = result.replace(/^\s*\n/gm, "");
    return result;
  }

  replaceAssemblyWithOpcodes(code){
    let result = code;
    //00E0 - CLS
    result = code.replace(/CLS/, "00E0");


    //00EE - RET
    //0nnn - SYS addr
    //1nnn - JP addr
    //2nnn - CALL addr
    //3xkk - SE Vx, byte
    //4xkk - SNE Vx, byte
    //5xy0 - SE Vx, Vy
    //6xkk - LD Vx, byte
    result = result.replace(/LD\sV[0-9A-F],\s\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b/g, "6xkk");
    //7xkk - ADD Vx, byte
    //8xy0 - LD Vx, Vy
    //8xy1 - OR Vx, Vy
    //8xy2 - AND Vx, Vy
    //8xy3 - XOR Vx, Vy
    //8xy4 - ADD Vx, Vy
    //8xy5 - SUB Vx, Vy
    //8xy6 - SHR Vx {, Vy}
    //8xy7 - SUBN Vx, Vy
    //8xyE - SHL Vx {, Vy}
    //9xy0 - SNE Vx, Vy
    /*
    Annn - LD I, addr
    Bnnn - JP V0, addr
    Cxkk - RND Vx, byte
    Dxyn - DRW Vx, Vy, nibble
    Ex9E - SKP Vx
    ExA1 - SKNP Vx
    Fx07 - LD Vx, DT
    Fx0A - LD Vx, K
    Fx15 - LD DT, Vx
    Fx18 - LD ST, Vx
    Fx1E - ADD I, Vx
    Fx29 - LD F, Vx
    Fx33 - LD B, Vx
    Fx55 - LD [I], Vx
    Fx65 - LD Vx, [I]
  3.2 - Super Chip-48 Instructions
    00Cn - SCD nibble
    00FB - SCR
    00FC - SCL
    00FD - EXIT
    00FE - LOW
    00FF - HIGH
    Dxy0 - DRW Vx, Vy, 0
    Fx30 - LD HF, Vx
    Fx75 - LD R, Vx
    Fx85 - LD Vx, R
      */
      return result;
  }


}
