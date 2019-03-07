

class chip8Compiler{
  constructor(){

  }
  compileMneonicToOpcodes(code){
     let result = this.removeComments(code); //including spaces in front and end of line

    console.log("WORKING WITH THIS: \n"+ result);
    let assemblyArray = result.split("\n"); //split the commands into array

    //convert assembly to opcode one line at a time
    assemblyArray = this.compileJumps(assemblyArray);
    assemblyArray = this.compileFunctionCalls(assemblyArray);
    assemblyArray = this.compileSpritesLD(assemblyArray);
    assemblyArray = this.assemblyToOpcode(assemblyArray);
    assemblyArray = this.compileSpritesBinToHex(assemblyArray);

    //final opcodes is the good version of the opcodes
    let finalOpcodes = "";
    let memmoryAddresses = 510; //this is memory address 200 in decimal
    let regEmptyLine = /^\s*\n?$/im;

    for(var x=0 ; x< assemblyArray.length ; x++){
      let command = assemblyArray[x];
      if(!regEmptyLine.test(command)){ //skip empty lines
        memmoryAddresses += 2;
        //**********UN-COMMENT NEXT LINE FOR DEBUGGING********///////
        //finalOpcodes += memmoryAddresses.toString(16)+ " " + command + "\n"; //
        finalOpcodes += command + " ";
      }
    }

    return finalOpcodes;
  }
  removeComments(code){
    code = code.replace(/\s*$/g, "\n");
    let result = code.replace(/;.*\n*/g, "\n");
    //removing space before and after commands
    result = result.replace(/\t+/g,""); //remove tabs
    result = result.replace(/\s*$/img,""); //remove spaces in front
    result = result.replace(/^\s*/img,"\n"); //remove spaces in back

    return result;
  }

  assemblyToOpcode(assemblyArray){
    let lineNumber = 0;
    let regEmptyLine = /^\s*\n?$/im;

    for(var x=0 ; x< assemblyArray.length ; x++){
      lineNumber++;
      let code = assemblyArray[x];
      let opcode = "";
      if(!regEmptyLine.test(code)){ //skip empty lines

        let opcode= "";
        let code = assemblyArray[x];
        //00E0 - CLS
        let r = /CLS/im;
        if(r.test(code)){
          opcode = code.replace(/CLS/, "00E0");
        }

        //00EE - RET
        r = /^ret$/im;
        if(r.test(code)){
          opcode = code.replace(r, "00EE");
        }
        //******all opcodes with addr ******8
        //0nnn - SYS addr
        //1nnn - JP addr  //this is delt with in seperate function
        //2nnn - CALL addr //this is delt with in a seperate function
        //Annn - LD I, addr //delt with this in seperate function/////
        //Bnnn - JP V0, addr


        //3xkk - SE Vx, byte
        r = /^se\sv[0-9a-f],\s*-?[0-9a-f][0-9a-f]?$/im;
        if(r.test(code)){
          let register =code.substring(4,5);
          let byte = code.match(/-?[a-f0-9][a-f0-9]?$/im)[0];
          byte = parseInt(byte);
          byte = byte.toString(16);
          if(byte.length ==1){
            byte = "0" + byte;
          }
          if(byte[0]=="-" && byte.length == 2){
            byte = "0" + byte;
          }
          //console.log(" register is " + code + "and "+ register +" " + byte);
          opcode = code.replace(r, "3"+ register + byte);
        }
        //4xkk - SNE Vx, byte
        r = /^sne\sv[0-9a-f],\s*-?[0-9a-f][0-9a-f]?$/im;
        if(r.test(code)){
          let register =code.substring(5,6);
          let byte = code.match(/[a-f0-9][a-f0-9]?$/im)[0];
          byte = parseInt(byte);
          byte = byte.toString(16);
          if(byte.length ==1){
            byte = "0" + byte;
          }
          if(byte[0]=="-" && byte.length == 2){
            byte = "0" + byte;
          }
          //console.log(" register is " + code + "and "+ register +" " + byte);
          opcode = code.replace(r, "4"+ register + byte);
        }
        //5xy0 - SE Vx, Vy
        r = /^se\sV[0-9a-f],\sv[0-9a-f]$/mi;
        if(r.test(code)){
          let register1 =code.substring(4,5);
          let regester2 = code.substring(8,9);

          opcode = code.replace(r, "5"+ register1+ regester2 + "0");
        }

        //6xkk - LD Vx, byte
        r = /^LD\sV[0-9A-F],\s*-?[0-9A-F]{1,2}$/im;
        if(r.test(code)){
          let register =code.substring(4,5);
          let byte = code.match(/-?[0-9a-f]{1,2}$/im)[0];
          byte = parseInt(byte);
          byte = byte.toString(16);
          //byte = parseInt(byte, 2).toString(16);
          if(byte.length ==1){
            byte = "0" + byte;
          }
          //console.log("why did it not add a zero toooooo " + code);
          if(byte[0]=="-" && byte.length == 2){
            byte = "0" + byte;
          }
          //console.log(" register is " + code + "and "+ register +" " + byte);
          opcode = code.replace(r, "6"+ register + byte);
        }

        //7xkk - ADD Vx, byte
        r = /^Add\sV[0-9A-F],\s*-?[0-9A-F]{1,2}$/im;
        if(r.test(code)){
          let register =code.substring(5,6);
          let byte = code.match(/-?[0-9a-f]{1,2}$/im)[0];
          byte = parseInt(byte);
          byte = byte.toString(16);
          if(byte.length ==1){
            byte = "0" + byte;
          }
          //console.log("why did it not add a zero toooooo " + code);
          if(byte[0]=="-" && byte.length == 2){
            byte = "0" + byte;
          }
          //console.log(" register is " + code + "and "+ register +" " + byte);
          opcode = code.replace(r, "7"+ register + byte);
        }

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

          opcode = code.replace(r, "8"+ register1+ regester2 +number);
        }
        //8xy6 - SHR Vx {, Vy}
        //8xy7 - SUBN Vx, Vy
        //8xyE - SHL Vx {, Vy}
        //9xy0 - SNE Vx, Vy


        //Annn - LD I, addr //delt with this in seperate function/////
        //Bnnn - JP V0, addr

        //Cxkk - RND Vx, byte
        //Dxyn - DRW Vx, Vy, nibble
        r = /\b^DRW\sV[0-9a-f],\sV[0-9a-f],\s[0-9a-f]\b/i;
        if(r.test(code)){
          let register1 =code.substring(5,6);
          let regester2 = code.substring(9,10);
          let nibble = code.match(/\d+\s*$/)[0];

          opcode = code.replace(r, "D"+ register1+ regester2 + nibble);
        }
        //Ex9E - SKP Vx
        //ExA1 - SKNP Vx
        r = /^sknp\sv[0-9a-f]$/i;
        if(r.test(code)){
          let register = code.match(/[0-9a-f]$/im)[0];
          opcode = code.replace(r, "E"+ register+ "A1");
        }
        //Fx07 - LD Vx, DT
        r = /^LD\sV[0-9A-F],\sDT$/im;
        if(r.test(code)){
          let register =code.substring(4,5);

          opcode = code.replace(r, "F"+ register + "07");
        }
        //Fx0A - LD Vx, K
        //Fx15 - LD DT, Vx
        r = /^LD\sDT,\sV[0-9a-f]$/im;
        if(r.test(code)){
          let register =code.substring(8,9);

          opcode = code.replace(r, "F"+ register + "15");
        }
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
        let regJumpCallByte = /^(a|1|2|byte).*/im;

        if(!opcode == "" ){ //if matched with some instruction the its valid
          assemblyArray[x] = opcode;
        }
        else if(regJumpCallByte.test(code)){
          //do nothing
        }
        else{ //if did not match with anything then its not valid
          console.log("ERROR IN LINE: " + lineNumber + "\n" + code);
        }
      }
    }

    return assemblyArray;
  }

  compileJumps(assemblyArray){
    console.log("compiling jumps");
    //var addressOfMemory = 512;
    var jumpNameArray= []; //need to store the names of places to jump in order to delete later
    let regEmptyLine = /^\s*\n?$/im;
    for(var x=0 ; x< assemblyArray.length ; x++){

      let code = assemblyArray[x];
      if(!regEmptyLine.test(code)){ //skip empty lines


        let r = /^\bjp\b\s\b[a-z1-9_]+\b/i;
        if(r.test(code)){
          //console.log("found the jp lo000000op "+ code);
          let nameLocation = code.match(/[a-z1-9_]+\s*$/im)[0]; //name of location where to jump to
          jumpNameArray.push(nameLocation);
          let addressOfJump = this.findNameLocation(nameLocation, assemblyArray);
          addressOfJump = parseInt(addressOfJump);
          let addressOfJumpInHex = addressOfJump.toString(16); //convert to hexidecimal
          //1nnn - JP addr
          //console.log("replacing "+assemblyArray[x]+" with " +"1" + addressOfJumpInHex)
          assemblyArray[x] = "1" + addressOfJumpInHex; //replace with opcode
        }
      }
    }
    console.log(assemblyArray);
    console.log(jumpNameArray);
    var reg;
    //removing all the places we jumped to
    for(var m=0 ; m< jumpNameArray.length ; m++){
      for(var n=0 ; n< assemblyArray.length ; n++){
        //console.log("tryying to remove "+ jumpNameArray[m]);
        reg = new RegExp("^"+jumpNameArray[m]+ " *","im");
        //console.log("testing for " +jumpNameArray[m]);
        if( reg.test(assemblyArray[n]) ){
        //if(assemblyArray[n].includes(jumpNameArray[m])){
          //console.log("spliceing " + assemblyArray[n]);
          assemblyArray.splice(n,1); //removing
        }
      }
    }
    console.log("done compiling jumps");
    return assemblyArray;

  }
  compileFunctionCalls(assemblyArray){
    //var addressOfMemory = 512;
    console.log("compiling functions");
    console.log(assemblyArray);

    var functionNameArray= [];

    let regEmptyLine = /^\s*\n?$/im;
    for(var x=0 ; x< assemblyArray.length ; x++){

      let code = assemblyArray[x];
      if(!regEmptyLine.test(code)){ //skip empty lines
        let r = /^CALL\s+[a-z1-9_]+$/im;

        if(r.test(code)){
          //console.log("so far so good " + code);
          let nameLocation = code.match(/[a-z1-9_]+$/im)[0]; //name of location where function declaration to
          functionNameArray.push(nameLocation);
          let addressOfCall = this.findNameLocation(nameLocation, assemblyArray); //finding where the function is located

          addressOfCall = parseInt(addressOfCall);
          let addressOfCallInHex = addressOfCall.toString(16); //convert to hexidecimal
          //1nnn - JP addr
          assemblyArray[x] = "2" + addressOfCallInHex; // replacing with opcodes
        }
      }
    }
    //deleting function declartions
    console.log(functionNameArray);
    for(var m=0 ; m< functionNameArray.length ; m++){
      for(var n=0 ; n< assemblyArray.length ; n++){
        let reg = new RegExp("^ *"+functionNameArray[m]+" *$","im");
        if( reg.test(assemblyArray[n])){
          //console.log("splicing line " + n +" "+  assemblyArray[n]);
          assemblyArray.splice(n,1);
        }
      }
    }
    console.log("done compiling functions");
    return assemblyArray;

  }
  compileSpritesLD(assemblyArray){
    console.log("compiling sprites now");
    //console.log(assemblyArray);
    var spriteNamesArray= [];

    let regEmptyLine = /^\s*\n?$/im;
    for(var x=0 ; x< assemblyArray.length ; x++){

      let code = assemblyArray[x];
      if(!regEmptyLine.test(code)){ //skip empty lines
        let r = /^LD\si,\s?[a-z1-9_]+$/mi;
        //console.log("testing if Ld i, nnn " + code);
        if(r.test(code)){
          //console.log("dealing with this "+ code);
          //console.log("found this as ld I nnn "+ code );
          let nameLocation = code.match(/[a-z1-9_]+$/im)[0]; //name of location where to sprite is declared
          spriteNamesArray.push(nameLocation);
          let addressOfCall = this.findNameLocation(nameLocation, assemblyArray);
          //console.log("name of sprite iss " + nameLocation);
          //console.log("nameLocation is " + nameLocation+ "and addressOfCall is " + addressOfCall.toString(16));
          addressOfCall = parseInt(addressOfCall);
          let addressOfCallInHex = addressOfCall.toString(16); //convert to hexidecimal
          //1nnn - JP addr
          assemblyArray[x] = "A" + addressOfCallInHex;
        }
      }
    }
    for(var m=0 ; m< spriteNamesArray.length ; m++){
      for(var n=0 ; n< assemblyArray.length ; n++){
        //if(assemblyArray[n].includes(spriteNamesArray[m])){
        let reg = new RegExp("^ *"+spriteNamesArray[m]+" *$","im");
        if( reg.test(assemblyArray[n])){
          assemblyArray.splice(n,1);
        }
      }
    }
    console.log("sprites done");
    return assemblyArray;
  }

  findNameLocation(nameLocation, assemblyArray){
    //returning memory address of where nameLocation is found in the code
    var addressOfMemory = 512; //200 in hex
    var r = new RegExp("^\\s*"+nameLocation+"\\s*$","im");
    let regEmptyLine = /^\s*\n?$/im;
    for(var x=0 ; x< assemblyArray.length ; x++){

      let code = assemblyArray[x];
      if(!regEmptyLine.test(code)){ //skip empty lines

        let inHex = addressOfMemory.toString(16);
        //console.log("looking for: "+ nameLocation);
        //console.log(inHex+ " " + code); //FOR DEBUGGING
        if(!this.isChip8Instruction(code)){ //  if not assembly then increase addressOfMemory

          if(r.test(code)){       //if the address of the name is found then return
            //console.log("\nbreak returning memory address "+ addressOfMemory);

            return addressOfMemory;
          }
        }
        else{
          //console.log(nameLocation+" not a intruction: " +assemblyArray);
          addressOfMemory= addressOfMemory+2;
        }
      }
    }
  }
  compileSpritesBinToHex(assemblyArray){
    console.log("turning sprites binary to hex" );
    let r = /^byte\s*%[01]{8}$/im;
    let regEmptyLine = /^\s*\n?$/im;
    for(var x=0 ; x< assemblyArray.length ; x++){

      let code = assemblyArray[x];
      if(!regEmptyLine.test(code)){ //skip empty lines
        if(r.test(code)){
          //console.log("turning "+ code+" into ......");
          let regBin = /[10]{8}$/im;
          let spriteBin = code.match(regBin)[0];
          //console.log("found binary "+ spriteBin);
          let spriteHex = parseInt(spriteBin, 2).toString(16)
          //console.log("this is the hex version " + spriteHex);
          while(spriteHex.length != 4){
            spriteHex = "0"+ spriteHex;
          }
          assemblyArray[x]= spriteHex;
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
      //need to also return true if it is jump, call , or LD i because we did these steps simaltaniously and are still considered instruction
      //can improve this making changes in another array instead of original.
      let regexJumpOpcodes = /^(1|2|a)[0-9a-f]{3}$/im
      if(regexJumpOpcodes.test(code)){
        return true;
      }
      else{
        //console.log("this is not an instruction "+ code);
        return false;
      }


    }
  }
}
