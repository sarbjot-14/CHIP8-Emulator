window.onload = function(){
  generatePixels();
  let chip = new emulator();
  document.getElementById("refresh").onclick = function(){chip.updateScreen();}
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
