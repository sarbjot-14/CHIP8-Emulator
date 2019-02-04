console.log("this is the tool");

let spriteArray = []

function invertColor(x){
  if(x.style.backgroundColor=="black"){

    x.style.background= "white";
  }
  else{
    x.style.background= "black";
  }
}

function resetPixels(){
  elements = document.getElementsByClassName("pixel");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor="black";
  }
}

function translateSprite(){
  let outputBox= document.getElementById("outputBox");
  let outputString;
  let startRow = 0; //figure out what row the sprite starts and ends
  let lastRow = 0;
  outputBox.innerHTML = "";

  spriteArray = [];
  elements = document.getElementsByClassName("pixel");
  for (let i = 0; i < elements.length; i++) {
    if(elements[i].style.backgroundColor=="black"){
      spriteArray.push(0);
    }
    else{
      spriteArray.push(1);
    }
  }

  for(let i=0; i<15 ; i++){ //find startRow and endRow
    let binRow = "";
    for(let j= 0; j<8; j++){
      if(startRow==0 && spriteArray[j+8*i] == 1 ){ //set the startRow
        startRow = i;
      }
      if(i > lastRow && spriteArray[j+8*i] == 1 ){ //update endRow
        lastRow = i;
      }

      binRow += spriteArray[j+8*i];
    }
  }
   //print lines (output translations)
  for(let i=0; i<15 ; i++){
    let binRow = "";
    for(let j= 0; j<8; j++){
      binRow += spriteArray[j+8*i];
    }
    if(i >= startRow && (i<= lastRow) ){
      outputBox.innerHTML+= "Bin: "+ binRow + "  |  Hex: " + byteToHex(binRow) + "\n";
    }
  }
}

function byteToHex(binStr){
  return fixHexLength(parseInt(binStr,2).toString(16), 2);
}

function fixHexLength(val, len){
  if(val.length > len){
    console.log("Error in fixHexLength()")
  }
  while(val.length < len){
    val = "0"+val;
  }
  return val.toLowerCase();
}
