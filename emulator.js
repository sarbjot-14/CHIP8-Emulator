window.onload = function(){


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
  //pixels are now added to dom

  setPixels(separatePixels(title));

}

//sets pixels on the screen given a 1D array of pixel eluminations (bool)
function setPixels(pix){
  for(let i=0; i<pix.length; i++){
    let rowNum = Math.floor(i/64);
    let colNum = i%64;

    let pixelDom = document.getElementById("pixels").childNodes;
    pixelDom = pixelDom[rowNum+1].childNodes;
    pixelDom = pixelDom[colNum];
    //pixelDom is now the pixel's DOM element
    if(pix[i]){
      pixelDom.style.backgroundColor = "rgba(150,255,150,1)";
    }else{
      pixelDom.style.backgroundColor = "rgba(150,255,150,0.5)";
    }
  }
}

function separatePixels(pixString){
  let result = [];
  for(let i=0;i<pixString.length;i++){
    result.push(parseInt(pixString[i],2));
  }
  return result;
}
