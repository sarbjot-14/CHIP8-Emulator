console.log("this is the tool");

var spriteArray = [0,1,0]

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
