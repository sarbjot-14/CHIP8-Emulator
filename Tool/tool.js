console.log("this is the tool");

var spriteArray = []

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
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor="black";
  }
}

function translateSprite(){
  elements = document.getElementsByClassName("pixel");
  for (var i = 0; i < elements.length; i++) {
    if(elements[i].style.backgroundColor=="black"){

      spriteArray.push(0);
    }
    else{
      spriteArray.push(1);
    }

  }

  var outputBox= document.getElementById("outputBox");
  var outputString;

  for(var i=0; i<15 ; i++){
    for(var j= 0; j<8; j++){
      outputBox.innerHTML+= spriteArray[j+8*i];
    }
    outputBox.innerHTML+= ",\n";
  }

  console.log("the array is:"+ spriteArray);

}
