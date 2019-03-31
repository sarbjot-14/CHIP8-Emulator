var errorString = "" ;
var isError = false;
class chip8Compiler{


  constructor(){

  }
  compileMneonicToOpcodes(code){



    let assemblyArray = code.split("\n"); //split the commands into array
    assemblyArray = this.removeComments(assemblyArray); //including spaces in front and end of line

    assemblyArray = this.compileSYS_JP_CALL_LDI(assemblyArray);
    console.log("WORKING WITH THIS:" );
    let line = 0;
    for(var x=0 ; x< assemblyArray.length ; x++){
      line++
      let command = assemblyArray[x];
      console.log(command );
    }
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
        finalOpcodes += memmoryAddresses.toString(16)+ " " + command + "\n"; //
        //finalOpcodes += command + " ";
      }
    }
    if(isError){
      isError = false;
      return errorString;
    }
    else{
      return finalOpcodes;
    }

  }
  removeComments(assemblyArray){

    let result;
    for(var x=0 ; x< assemblyArray.length ; x++){
      result = assemblyArray[x];
      result = result.replace(/\s*;.*\n?$/gim, "\n"); //remove removeComments
      result = result.replace(/\t+/g,""); //remove tabs
      result = result.replace(/\s*$/im,""); //remove spaces in back
      result = result.replace(/^\s*/im,""); //remove spaces in front

      assemblyArray[x] = result;
    }

    return assemblyArray;
  }
  compileSYS_JP_CALL_LDI(assemblyArray){
    //0nnn - SYS addr
    //1nnn - JP addr
    let regJP = /^jp\s*[a-z0-9_]+$/im;
    //2nnn - CALL addr
    let regCALL = /^call\s*[a-z0-9_]+$/im;
    //Annn - LD I, addr
    let regLDI = /^ld\s*i\s*,\s*[a-z0-9_]+$/mi;
    //Bnnn - JP V0, addr
    console.log("compiling SYS, JP, CALL, LD I, and JP V0");
    //var addressOfMemory = 512;
    var addrNameArray= []; //need to store the names of places to jump in order to delete later
    let regEmptyLine = /^\s*\n?$/im;
    for(var x=0 ; x< assemblyArray.length ; x++){

      let code = assemblyArray[x];
      if(!regEmptyLine.test(code)){ //skip empty lines

        if(regJP.test(code)){//1nnn - JP addr
          //console.log("found the jp lo000000op "+ code);
          let nameLocation = code.match(/[a-z1-9_]+\s*$/im)[0]; //name of location where to jump to
          let addressOfJump = this.findNameLocation(nameLocation, assemblyArray);
          addrNameArray.push(nameLocation);
          addressOfJump = parseInt(addressOfJump);
          let addressOfJumpInHex = addressOfJump.toString(16); //convert to hexidecimal
          //1nnn - JP addr
          //console.log("replacing "+assemblyArray[x]+" with " +"1" + addressOfJumpInHex)
          assemblyArray[x] = "1" + addressOfJumpInHex; //replace with opcode
        }
        else if(regCALL.test(code)){

            //console.log("so far so good " + code);
            let nameLocation = code.match(/[a-z1-9_]+$/im)[0]; //name of location where function declaration to
            let addressOfCall = this.findNameLocation(nameLocation, assemblyArray); //finding where the function is located
            addrNameArray.push(nameLocation);
            addressOfCall = parseInt(addressOfCall);
            let addressOfCallInHex = addressOfCall.toString(16); //convert to hexidecimal
            //1nnn - JP addr
            assemblyArray[x] = "2" + addressOfCallInHex; // replacing with opcodes
          }
          else if(regLDI.test(code)){
            let nameLocation = code.match(/[a-z1-9_]+$/im)[0]; //name of location where to sprite is declared
            addrNameArray.push(nameLocation);
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

    console.log(assemblyArray);
    console.log(addrNameArray);
    var reg;
    //removing all the places we jumped to
    for(var m=0 ; m< addrNameArray.length ; m++){
      for(var n=0 ; n< assemblyArray.length ; n++){
        //console.log("tryying to remove "+ addrNameArray[m]);
        reg = new RegExp("^"+addrNameArray[m]+ " *","im");
        //console.log("testing for " +addrNameArray[m]);
        if( reg.test(assemblyArray[n]) ){
        //if(assemblyArray[n].includes(addrNameArray[m])){
          //console.log("spliceing " + assemblyArray[n]);
          //assemblyArray.splice(n,1); //removing
          assemblyArray[n] = " " ;
        }
      }
    }
    console.log("done compiling jumps and calls and LD I");
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
          let byteReg = /^byte\s*%/im
          if(byteReg.test(code)){
            addressOfMemory--;
          }
        }
      }
    }
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
        //******all opcodes with addr ****** //taken care with
        //0nnn - SYS addr
        //1nnn - JP addr  //this is delt with in seperate function
        //2nnn - CALL addr //this is delt with in a seperate function
        //Annn - LD I, addr //delt with this in seperate function/////
        //Bnnn - JP V0, addr
        ///////

        //3xkk - SE Vx, byte
        //4xkk - SNE Vx, byte
        //6xkk - LD Vx, byte
        //7xkk - ADD Vx, byte
        //Cxkk - RND Vx, byte
        let regNegOrPosByte = /^(se|Sne|ld|add|rnd)\s*v[0-9a-f]\s*,\s*-?(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/im; //for catching negative bytes and positive bytes
        //regPosByte = /^(se|Sne|ld|add|rnd)\s*v[0-9a-f]\s*,\s*(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/im;
        if(regNegOrPosByte.test(code)){
          var byte;
          let regPosByte = /^(se|Sne|ld|add|rnd)\s*v[0-9a-f]\s*,\s*(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/im;  //for catching positive bytes
          let regNegByte = /^(se|Sne|ld|add|rnd)\s*v[0-9a-f]\s*,\s*-(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/im;
          let register = code.replace(/^[a-z]{2,3}\s*v/im, "")[0];//for catching negative bytes
          if(regPosByte.test(code)){
            //console.log("regPosByte " + code);
            byte = code.match(/(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/im)[0];
            byte = parseInt(byte);
            byte = byte.toString(16);

          }

          else if(regNegByte.test(code)){
            //console.log("regNegByte " + code);
            byte = code.match(/(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/im)[0];
            byte = this.decToHexWithTwoComp(byte);

          }
          if(byte.length ==1){
            byte = "0" + byte;
          }
          if(/^se/im.test(code)){
            opcode = code.replace(regNegOrPosByte, "3"+ register + byte);
          }
          else if(/^sne/im.test(code)){//4xkk - SNE Vx, byte
            opcode = code.replace(regNegOrPosByte, "4"+ register + byte);
          }
          else if(/^ld/im.test(code)){//6xkk - LD Vx, byte
              opcode = code.replace(regNegOrPosByte, "6"+ register + byte);
          }
          else if(/^add/im.test(code)){//7xkk - ADD Vx, byte
            opcode = code.replace(regNegOrPosByte, "7"+ register + byte);
          }
          else if(/^rnd/im.test(code)){  //Cxkk - RND Vx, byte
            opcode = code.replace(regNegOrPosByte, "C"+ register + byte);
          }
        }

        /////////GROUP TOGETHER///////////
        //8xy0 - LD Vx, Vy
        //8xy1 - OR Vx, Vy
        //8xy2 - AND Vx, Vy
        //8xy3 - XOR Vx, Vy
        //8xy4 - ADD Vx, Vy
        //8xy5 - SUB Vx, Vy
        //5xy0 - SE Vx, Vy
        //8xy7 - SUBN Vx, Vy
        //9xy0 - SNE Vx, Vy

        r = /^(LD|OR|AND|XOR|ADD|SUB|SE|SUBN|SNE)\s*v[0-9a-f]\s*,\s*v[0-9a-f]$/im;
        if(r.test(code)){
          //let firstTerm = code.match(/^[a-z_]+/im)[0]);
          let register1 =  code.replace(/^[a-z0-9_]+\s*v/im, "")[0];
          let regester2 = code.replace(/^[a-z_]+\s*v[0-9a-f]\s*,\s*v/im,"")[0];
          let number = 0;

          if(/^LD/im.test(code)){
            number = 0;
          }
          if(/^OR/im.test(code)){
            number = 1;
            opcode = code.replace(r, "8"+ register1+ regester2 +number);
          }
          if(/^AND/im.test(code)){
            number = 2;
            opcode = code.replace(r, "8"+ register1+ regester2 +number);
          }
          if(/^XOR/im.test(code)){
            number = 3;
            opcode = code.replace(r, "8"+ register1+ regester2 +number);
          }
          if(/^ADD/im.test(code)){
            number = 4;
            opcode = code.replace(r, "8"+ register1+ regester2 +number);
          }
          if(/^SUB/im.test(code)){
            number = 5;
            opcode = code.replace(r, "8"+ register1+ regester2 +number);
          }
          if(/^SUBN/im.test(code)){
            number = 5;
            opcode = code.replace(r, "8"+ register1+ regester2 +number);
          }
          if(/^SE/im.test(code)){
            number = 0;
            opcode = code.replace(r, "5"+ register1+ regester2 +number);
          }
          if(/^SNE/im.test(code)){
            number = 0;
            opcode = code.replace(r, "9"+ register1+ regester2 +number);
          }

        }

        //Dxyn - DRW Vx, Vy, nibble
        r = /^drw\s*v[0-9a-f]\s*,\s*v[0-9a-f]\s*,\s*(1[0-5]|[1-9])$/im;
        if(r.test(code)){
          let register1 =  code.replace(/^[a-z0-9_]+\s*v/im, "")[0];
          let regester2 = code.replace(/^[a-z0-9_]+\s*v[0-9a-f]\s*,\s*v/im,"")[0];

          let nibble = code.match(/(1[0-5]|[1-9])$$/)[0];
          nibble = parseInt(nibble).toString(16);
          //console.log("nibble is " + nibble);


          opcode = code.replace(r, "D"+ register1+ regester2 + nibble);
        }
        //Ex9E - SKP Vx
        //ExA1 - SKNP Vx
        r = /^(skp|sknp)\s*v[0-9a-f]$/im;
        if(r.test(code)){
          let register =  code.replace(/^(skp|sknp)\s*v/im, "")[0];

          if(/^skp\s*v[0-9a-f]$/im.test(code)){
            opcode = code.replace(r, "E"+ register + "9E");
          }
          if(/^sknp\s*v[0-9a-f]$/im.test(code)){
            opcode = code.replace(r, "E"+ register + "A1");
          }

        }

        r = /^sknp\s*v[0-9a-f]$/im;
        if(r.test(code)){
          let register = code.match(/[0-9a-f]$/im)[0];
          opcode = code.replace(r, "E"+ register+ "A1");
        }
        //Fx07 - LD Vx, DT
        r = /^ld\s*v[0-9a-f]\s*,\s*dt$/im;
        if(r.test(code)){
          let register =  code.replace(/^ld\s*v/im, "")[0];

          opcode = code.replace(r, "F"+ register + "07");
        }
        //Fx0A - LD Vx, K
        //Fx15 - LD DT, Vx
        r = /ld\s*dt\s*,\s*v[0-9a-f]$/im;
        if(r.test(code)){
          let register =  code.replace(/ld\s*dt\s*,\s*v/im, "")[0];

          opcode = code.replace(r, "F"+ register + "15");
        }
        //ALL THESE TOGETHER//////
        //Fx18 - LD ST, Vx
        //Fx29 - LD F, Vx
        //Fx33 - LD B, Vx
        //Fx55 - LD [I], Vx
      //  ----------------------
        //Fx65 - LD Vx, [I]
        //Fx1E - ADD I, Vx
        ///////////
        r = /^LD\s*(ST|F|B|\[I\]|V)\s*,\s*V[0-9a-f]/im;
        if(r.test(code)){
          let register =  code.replace(/^LD\s*(ST|F|B|\[I\]|V)\s*,\s*V/im, "")[0];
          //Fx18 - LD ST, Vx
          if(/^LD\s*ST\s*,\s*V[0-9a-f]/im.test(code)){
            opcode = code.replace(r, "F"+ register + "18");
          }
          //Fx29 - LD F, Vx
          if(/^LD\s*F\s*,\s*V[0-9a-f]/im.test(code)){
            opcode = code.replace(r, "F"+ register + "29");
          }
          //Fx33 - LD B, Vx
          if(/^LD\s*B\s*,\s*V[0-9a-f]/im.test(code)){
            opcode = code.replace(r, "F"+ register + "33");
          }
          //Fx55 - LD [I], Vx
          if(/^LD\s*\[I\]\s*,\s*V[0-9a-f]/im.test(code)){
            opcode = code.replace(r, "F"+ register + "55");
          }
        }
        //Fx65 - LD Vx, [I]
        r = /^LD\s*V[0-9a-f],\s*\[I\]/im;
        if(r.test(code)){
          let register =  code.replace(/^LD\s*V/im, "")[0];
          opcode = code.replace(r, "F"+ register+ "65");
        }
        //Fx1E - ADD I, Vx
        r = /^add\s*I\s*,\s*v[0-9a-f]/im;
        if(r.test(code)){
          let register =  code.replace(/^add\s*I\s*,\s*v/im, "")[0];

          opcode = code.replace(r, "F"+ register + "1E");
        }
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
          isError = true;
          errorString = errorString + "\nERROR IN LINE: " + lineNumber + "\n" + code;

        }
      }
    }

    return assemblyArray;
  }


  compileSpritesBinToHex(assemblyArray){
    console.log("turning sprites binary to hex" );
    let r = /^byte\s*%[01]{8}$/im;
    let regEmptyLine = /^\s*\n?$/im;
    var code;
    var code2;
    for(var x=0 ; x< assemblyArray.length ; x++){
      //console.log("x is ................." + x);
      code = assemblyArray[x];
      let m = x+1;
      let aCode = assemblyArray[m];
      while(regEmptyLine.test(aCode)){
        m++;
        aCode = assemblyArray[m];
      }
      code2 = assemblyArray[m];
      //console.log("this is code" + code + " and this is code2 " + code2);
      if(!regEmptyLine.test(code)){ //skip empty lines
        //console.log(code);
        if(r.test(code)){
          //console.log("turning "+ code+" into ......");
          let regBin = /[10]{8}$/im;

          let spriteBin = code.match(regBin)[0];
          let spriteHex = parseInt(spriteBin, 2).toString(16);
          //console.log("turning spriteBin to spriteHex " + spriteBin+ " " + spriteHex);
          if(spriteHex.length ==1){
            //console.log("length of spriteHex is " + spriteHex.length);
            spriteHex = "0" + spriteHex;
          }
          //console.log("is sprite")

          //console.log("this is code " + code + " and this is code2 " + code2);
          //console.log("why wont it pass the next one "+ x+1 + " "  +code2+" "+  r.test(code2))
          if(r.test(code2)){
            let spriteBin = code2.match(regBin)[0];
            let spriteHex2 = parseInt(spriteBin, 2).toString(16);
            //console.log("turning again spriteBin to spriteHex " + spriteBin+ " " + spriteHex2);
            if(spriteHex2.length ==1){
              spriteHex2 = "0" + spriteHex2;
            }
            //console.log("hex1 and 2 " + spriteHex+ " " + spriteHex2);
            let combinedHex = spriteHex + spriteHex2;
            //console.log("combined is " + combinedHex);
            assemblyArray[x] = combinedHex;
            assemblyArray[m] = " ";
            x++;

          }
          else{

            while(spriteHex.length != 4){
              spriteHex = spriteHex + "0";
            }
            assemblyArray[x]= spriteHex;
          }
        }

      }
      //console.log(assemblyArray);
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
  //https://stackoverflow.com/questions/42450510/invert-unsigned-arbitrary-binary-bits-in-javascript
  decToHexWithTwoComp(byte){ //using twos compliment

    var flipbits = function flipbits(str) {
      return str.split('').map(function (b) {
        return (1 - b).toString();
      }).join('');
    };
    //byte = "-4";
    //console.log("byte is "+ byte);
    byte = Math.abs(parseInt(byte));
    byte = byte.toString(2);
    byte = this.pad(byte,8);
    //console.log(byte + " after absolute and to binary");
    byte = byte.toString();
    byte = flipbits(byte);
    //console.log("flipped the bytes " +byte);

    byte = parseInt(byte,2);
    byte = 1+byte;
    //turn the decimal back to binary
    byte = byte.toString(2);
    //console.log("answer in biary " +byte);
    byte = parseInt(byte);
    byte =  parseInt(byte, 2).toString(16).toUpperCase()
    //console.log("answer in hex " +byte);
    return byte;

  }
  //https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
  pad(n, width, z) {
    z = z || '0';
    n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}
