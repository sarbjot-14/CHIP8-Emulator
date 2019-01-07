
class visualizer{
  constructor(){

  }

  init(){
    this.generatePixels();
    document.getElementById("resetColours").onclick = function(){
      document.getElementById("primaryColour").value = "#ffffff";
      document.getElementById("secondaryColour").value = "#000000";
      chip.chipEmulator.updateScreen();
    }
    document.getElementById("primaryColour").onchange = function(){ chip.chipEmulator.updateScreen(); }
    document.getElementById("secondaryColour").onchange = function(){ chip.chipEmulator.updateScreen(); }
  }

  generatePixels(){
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

}
