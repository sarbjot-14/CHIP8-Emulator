class emulator{
  constructor(){
    this.pixels = this.separatePixels(title);
    this.vis = new visualizer();
  }

  start(){
    this.vis.init();
    this.updateScreen();
  }


  //Updates the screen given a binary array and a starting index
  updateScreen(pix = this.pixels, start = 0){
    for(let i=0; (i<pix.length)&&(i+start < 64*32); i++){
      this.pixels[(i+start)] = pix[i];
      this.vis.setPixel((i+start), pix[i]);
    }
  }

  separatePixels(pixString){ //converts binary string into an int array
    let result = [];
    for(let i=0;i<pixString.length;i++){
      result.push(parseInt(pixString[i],2));
    }
    return result;
  }

}
let chip = new emulator();
