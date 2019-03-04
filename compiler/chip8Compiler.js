

class chip8Compiler{
  constructor(){

  }
  compileMneonicToOpcodes(code){
    let result = this.removeComments(code);
    result = this.removeEmptyLines(result);
    let assemblyArray = result.split("\n");
    //convert assembly to opcode one line at a time
    assemblyArray = this.compileJumps(assemblyArray);
    assemblyArray = this.compileFunctionCalls(assemblyArray);
    assemblyArray = this.assemblyToOpcode(assemblyArray);

    //final opcodes is the good version of the opcodes
    let finalOpcodes = "";
    let memmoryAddresses = 510;
    assemblyArray.forEach(function(command) {
      memmoryAddresses += 2;
      finalOpcodes += memmoryAddresses.toString(16)+ " " + command + "\n";
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

  removeEmptyLines(code){
    let result = code.replace(/\t+/g,"");
    result = result.replace(/^\s*\n/gm, "");
    return result;
  }
  assemblyToOpcode(assemblyArray){

    console.log(assemblyArray);

    for(var x=0 ; x< assemblyArray.length ; x++){
      let opcode= "";
      let code = assemblyArray[x];
      //00E0 - CLS
      let r = /CLS/;
      if(r.test(code)){
        opcode = code.replace(/CLS/, "00E0");
      }

      //00EE - RET
      //0nnn - SYS addr
      //1nnn - JP addr
      //2nnn - CALL addr
      //3xkk - SE Vx, byte
      //4xkk - SNE Vx, byte
      //5xy0 - SE Vx, Vy
      //6xkk - LD Vx, byte
      r = /\b^LD\sV[0-9A-F],\s[0-9A-F]{1,2}\b/i;
      if(r.test(code)){
        let register =code.substring(4,5);
        let byte = code.match(/\d+$/)[0];
        if(byte.length ==1){
          byte = "0" + byte;
        }
        //console.log(" register is " + code + "and "+ register +" " + byte);
        opcode = code.replace(/\b^LD\sV[0-9A-F],\s[0-9A-F]{1,2}\b/i, "6"+ register + byte);
      }

      //7xkk - ADD Vx, byte

      /////////GROUP FROM 8xy0 TO 8xy5///////////
      //8xy0 - LD Vx, Vy
      //8xy1 - OR Vx, Vy
      //8xy2 - AND Vx, Vy
      //8xy3 - XOR Vx, Vy
      //8xy4 - ADD Vx, Vy
      //8xy5 - SUB Vx, Vy
      r = /\b(LD|OR|AND|XOR|ADD|SUB)\sV[1-9a-f],\sV[1-9a-f]\b/i;
      if(r.test(code)){
        let register1 =code.substring(5,6);
        let regester2 = code.substring(9,10);
        let number = 0;
        if(code.substring(0,2)=="LD"){
          number = 0;
        }
        if(code.substring(0,2)=="OR"){
          number = 1;
        }
        if(code.substring(0,3)=="AND"){
          number = 2;
        }
        if(code.substring(0,3)=="XOR"){
          number = 3;
        }
        if(code.substring(0,3)=="ADD"){
          number = 4;
        }
        if(code.substring(0,3)=="SUB"){
          number = 5;
        }
        //console.log(" register is " + code + "and "+ register +" " + byte);
        opcode = code.replace(r, "8"+ register1+ regester2 +number);
      }
      //8xy6 - SHR Vx {, Vy}
      //8xy7 - SUBN Vx, Vy
      //8xyE - SHL Vx {, Vy}
      //9xy0 - SNE Vx, Vy


      //Annn - LD I, addr
      //Bnnn - JP V0, addr //TAKE CARE OF THIS IN NEXT STEP/////

      //Cxkk - RND Vx, byte
      //Dxyn - DRW Vx, Vy, nibble
      r = /\b^DRW\sV[0-9a-f],\sV[0-9a-f],\s[0-9a-f]\b/i;
      if(r.test(code)){
        let register1 =code.substring(5,6);
        let regester2 = code.substring(9,10);


        let nibble = code.match(/\d+\s*$/)[0];
        //console.log(" register is " + code + "and "+ register +" " + byte);
        opcode = code.replace(r, "D"+ register1+ regester2 + nibble);
      }
      //Ex9E - SKP Vx
      //ExA1 - SKNP Vx
      //Fx07 - LD Vx, DT
      //Fx0A - LD Vx, K
      //Fx15 - LD DT, Vx
      //Fx18 - LD ST, Vx
      //Fx1E - ADD I, Vx
      //Fx29 - LD F, Vx
      //Fx33 - LD B, Vx
      //Fx55 - LD [I], Vx
      //Fx65 - LD Vx, [I]
      /*
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
      if(opcode == ""){
        console.log("ERROR IN LINE: " +code);
        assemblyArray[x] = code; //deltet this once all codes are done
      }
      else{
        assemblyArray[x] = opcode;
      }

    }

    return assemblyArray;
  }

  compileJumps(assemblyArray){
    //var addressOfMemory = 512;
    var jumpNameArray= [];
    for(var x=0 ; x< assemblyArray.length ; x++){
      let code = assemblyArray[x];
        let r = /^\bjp\b\s\b[a-z1-9]+\b/i;
        if(r.test(code)){
          console.log("found the jp lo000000op "+ code);
          let nameLocation = code.match(/[a-z1-9]+$/im)[0]; //name of location where to jump to
          jumpNameArray.push(nameLocation);
          let addressOfJump = this.findNameLocation(nameLocation, assemblyArray);
          addressOfJump = parseInt(addressOfJump);
          let addressOfJumpInHex = addressOfJump.toString(16); //convert to hexidecimal
          //1nnn - JP addr
          console.log("replacing "+assemblyArray[x]+" with " +"1" + addressOfJumpInHex)
          assemblyArray[x] = "1" + addressOfJumpInHex;
        }
    }
    for(var m=0 ; m< jumpNameArray.length ; m++){
      for(var n=0 ; n< assemblyArray.length ; n++){
        if(assemblyArray[n].includes(jumpNameArray[m])){
          assemblyArray.splice(n,1);
        }
      }
    }
    return assemblyArray;
  }
  compileFunctionCalls(assemblyArray){
    //var addressOfMemory = 512;
    var functionNameArray= [];
    for(var x=0 ; x< assemblyArray.length ; x++){
      let code = assemblyArray[x];
        let r = /^CALL\s[a-z1-9]+$/im;
        if(r.test(code)){
          let nameLocation = code.match(/[a-z1-9]+$/im)[0]; //name of location where to jump to
          functionNameArray.push(nameLocation);
          let addressOfCall = this.findNameLocation(nameLocation, assemblyArray);

          addressOfCall = parseInt(addressOfCall);
          let addressOfCallInHex = addressOfCall.toString(16); //convert to hexidecimal
          //1nnn - JP addr
          assemblyArray[x] = "2" + addressOfCallInHex;
        }
    }
    //deleting function declartions
    for(var m=0 ; m< functionNameArray.length ; m++){
      for(var n=0 ; n< assemblyArray.length ; n++){
        if(assemblyArray[n].includes(functionNameArray[m])){
          assemblyArray.splice(n,1);
        }
      }
    }
    return assemblyArray;
  }
  isChip8Instruction(code){
    let r = /\b(?:CLS|BYTE|RET|SYS|JP|LD|SE|CALL|SNE|ADD|OR|AND|XOR|SUB|SHR|SUBN|SHL|RND|DRW|SKP|SKNP|SCD|SCR|SCL|EXIT|LOW|HIGH)\b/i;
    if(r.test(code)){
      //console.log("this is a intruction: "+ code);
      return true;
    }
    else{
      /////////////////////////////////////////////////////////////////
      let regexJumpOpcodes = /^(1|2|a)[1-9a-f]{3}$/im
      if(regexJumpOpcodes.test(code)){
        return true;
      }
      else{
        //console.log("this is not an instruction "+ code);
        return false;
      }
      /////////////////////////////////////////////////////////////////

    }
  }
  findNameLocation(nameLocation, assemblyArray){
    var addressOfMemory = 512;
    var r = new RegExp("^"+nameLocation+"$","im");
    for(var x=0 ; x< assemblyArray.length ; x++){
      let code = assemblyArray[x];

      let inHex = addressOfMemory.toString(16);
      console.log(inHex+ " " + assemblyArray[x]);
      //console.log("hey"+code);
      if(!this.isChip8Instruction(code)){
        //console.log("hey"+code+ nameLocation);
        if(r.test(code)){
          console.log("\nbreak\b");

          return addressOfMemory;
        }
      }
      else{
        addressOfMemory= addressOfMemory+2;
      }
    }


  }
}
