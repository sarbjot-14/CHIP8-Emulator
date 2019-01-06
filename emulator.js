
class emulator{
  constructor(){
    this.pixels = this.separatePixels(title);
  }

  start(){
    this.updateScreen();
  }


  //Updates the screen given a binary array and a starting point (Both are optional)
  updateScreen(pix = this.pixels, start = 0){
    this.pixels = pix;
    for(let i=0; (i<pix.length)&&(i+start < 64*32); i++){
      let rowNum = Math.floor(i/64);
      let colNum = i%64;

      let pixelDom = document.getElementById("pixels").childNodes;
      pixelDom = pixelDom[rowNum+1].childNodes;
      pixelDom = pixelDom[colNum];
      //pixelDom is now the pixel's DOM element
      if(pix[i]){
        pixelDom.style.backgroundColor = document.getElementById("primaryColour").value;
      }else{
        pixelDom.style.backgroundColor = document.getElementById("secondaryColour").value;
      }
    }
  }

  separatePixels(pixString){
    let result = [];
    for(let i=0;i<pixString.length;i++){
      result.push(parseInt(pixString[i],2));
    }
    return result;
  }

}
