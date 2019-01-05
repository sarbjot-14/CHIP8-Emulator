let chip;
window.onload = function(){
  generatePixels();
  chip = new emulator();
  document.getElementById("resetColours").onclick = function(){
    document.getElementById("primaryColour").value = "#99ff99";
    document.getElementById("secondaryColour").value = "#ccffcc";
    chip.updateScreen();
  }
  document.getElementById("primaryColour").onchange = function(){ chip.updateScreen(); }
  document.getElementById("secondaryColour").onchange = function(){ chip.updateScreen(); }
}

function generatePixels(){
  let pixels = document.getElementById("pixels");
  for(let i=0; i<32; i++){
    let row = document.createElement("div");
    row.className += "pixelRow"
    pixels.appendChild(row);

    for(let j=0; j<64; j++){
      let pixel = document.createElement("div");
      pixel.className += "pixel";
      row.appendChild(pixel);
    }
  }
}
