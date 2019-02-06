class visualizer{
  constructor(em){
    this.em = em; //reference to parent emulator object
  }

  init(){
    this.generatePixels();

    document.getElementById("resetColours").onclick = function(){
      document.getElementById("primaryColour").value = "#ffffff";
      document.getElementById("secondaryColour").value = "#000000";
      chip.updateScreen();
    }

    document.getElementById("primaryColour").onchange = function(){ chip.updateScreen(); }
    document.getElementById("secondaryColour").onchange = function(){ chip.updateScreen(); }

    document.getElementById("stepBackBtn").onclick = function(){chip.undo()}
    document.getElementById("stepForwardBtn").onclick = function(){chip.emulationLoop();}
    document.getElementById("playPauseBtn").onclick = function(){chip.togglePause()}

    document.getElementById("loadBtn").onclick = function(){chip.loadProgram(document.getElementById('code').value); chip.vis.updatePaused(1)}

    document.getElementById("speedSlider").oninput = function(){
      if(this.value < 1){
        chip.speed = 10- 10*this.value;
      }else{
        chip.speed = 1 - (this.value-1)
      }
    }
    document.getElementById("resetSpeed").onclick = function(){document.getElementById("speedSlider").value = 1; chip.speed = 1;};

    //keyboard events:
    document.addEventListener('keydown', function(e){
      switch(e.key){
        case 'x': //0
          if(!chip.keyInput['0']){
            //console.log("0 t");
            chip.keyInput['0'] = true;
          }
          break;
        case '1': //1
          if(!chip.keyInput['1']){
            //console.log("1 t");
            chip.keyInput['1'] = true;
          }
          break;
        case '2': //2
          if(!chip.keyInput['2']){
            //console.log("2 t");
            chip.keyInput['2'] = true;
          }
          break;
        case '3': //3
          if(!chip.keyInput['3']){
            //console.log("3 t");
            chip.keyInput['3'] = true;
          }
          break;
        case 'q': //4
          if(!chip.keyInput['4']){
            //console.log("4 t");
            chip.keyInput['4'] = true;
          }
          break;
        case 'w': //5
          if(!chip.keyInput['5']){
            //console.log("5 t");
            chip.keyInput['5'] = true;
          }
          break;
        case 'e': //6
          if(!chip.keyInput['6']){
            //console.log("6 t");
            chip.keyInput['6'] = true;
          }
          break;
        case 'a': //7
          if(!chip.keyInput['7']){
            //console.log("7 t");
            chip.keyInput['7'] = true;
          }
          break;
        case 's': //8
          if(!chip.keyInput['8']){
            //console.log("8 t");
            chip.keyInput['8'] = true;
          }
          break;
        case 'd': //9
          if(!chip.keyInput['9']){
            //console.log("9 t");
            chip.keyInput['9'] = true;
          }
          break;
        case 'z': //a
          if(!chip.keyInput['a']){
            //console.log("a t");
            chip.keyInput['a'] = true;
          }
          break;
        case 'c': //b
          if(!chip.keyInput['b']){
            //console.log("b t");
            chip.keyInput['b'] = true;
          }
          break;
        case '4': //c
          if(!chip.keyInput['c']){
            //console.log("c t");
            chip.keyInput['c'] = true;
          }
          break;
        case 'r': //d
          if(!chip.keyInput['d']){
            //console.log("d t");
            chip.keyInput['d'] = true;
          }
          break;
        case 'f': //e
          if(!chip.keyInput['e']){
            //console.log("e t");
            chip.keyInput['e'] = true;
          }
          break;
        case 'v': //f
          if(!chip.keyInput['f']){
            //console.log("f t");
            chip.keyInput['f'] = true;
          }
          break;
      }
      //console.log("down: "+ e.key);
    });
    document.addEventListener('keyup', function(e){
      switch(e.key){
        case 'x': //0
          if(chip.keyInput['0']){
            //console.log("0 f");
            chip.keyInput['0'] = false;
          }
          break;
        case '1': //1
          if(chip.keyInput['1']){
            //console.log("1 f");
            chip.keyInput['1'] = false;
          }
          break;
        case '2': //2
          if(chip.keyInput['2']){
            //console.log("2 f");
            chip.keyInput['2'] = false;
          }
          break;
        case '3': //3
          if(chip.keyInput['3']){
            //console.log("3 f");
            chip.keyInput['3'] = false;
          }
          break;
        case 'q': //4
          if(chip.keyInput['4']){
            //console.log("4 f");
            chip.keyInput['4'] = false;
          }
          break;
        case 'w': //5
          if(chip.keyInput['5']){
            //console.log("5 f");
            chip.keyInput['5'] = false;
          }
          break;
        case 'e': //6
          if(chip.keyInput['6']){
            //console.log("6 f");
            chip.keyInput['6'] = false;
          }
          break;
        case 'a': //7
          if(chip.keyInput['7']){
            //console.log("7 f");
            chip.keyInput['7'] = false;
          }
          break;
        case 's': //8
          if(chip.keyInput['8']){
            //console.log("8");
            chip.keyInput['8'] = false;
          }
          break;
        case 'd': //9
          if(chip.keyInput['9']){
            //console.log("9 f");
            chip.keyInput['9'] = false;
          }
          break;
        case 'z': //a
          if(chip.keyInput['a']){
            //console.log("a f");
            chip.keyInput['a'] = false;
          }
          break;
        case 'c': //b
          if(chip.keyInput['b']){
            //console.log("b f");
            chip.keyInput['b'] = false;
          }
          break;
        case '4': //c
          if(chip.keyInput['c']){
            //console.log("c f");
            chip.keyInput['c'] = false;
          }
          break;
        case 'r': //d
          if(chip.keyInput['d']){
            //console.log("d f");
            chip.keyInput['d'] = false;
          }
          break;
        case 'f': //e
          if(chip.keyInput['e']){
            //console.log("e f");
            chip.keyInput['e'] = false;
          }
          break;
        case 'v': //f
          if(chip.keyInput['f']){
            //console.log("f f");
            chip.keyInput['f'] = false;
          }
          break;
      }
      //console.log("up: "+e.key);
    });
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

  setPixel(index, value){
    if(index < 64*32){
      let rowNum = Math.floor( (index)/64);
      let colNum = (index)%64;

      let pixelDom = document.getElementById("pixels").childNodes;
      pixelDom = pixelDom[rowNum+1].childNodes;
      pixelDom = pixelDom[colNum];
      //pixelDom is the pixel's DOM element
      if(value){
        pixelDom.style.backgroundColor = document.getElementById("primaryColour").value;
      }else{
        pixelDom.style.backgroundColor = document.getElementById("secondaryColour").value;
      }
    }
  }

  runCode(){
    let lines = document.getElementById('code').value.split('\n');
    for(let i=0; i< lines.length; i++){
      chip.executeInstruction(lines[i]);
    }
  }

  updatePaused(state){ //state is 1 if paused, 0 if not.
    if(state){//paused
      document.getElementById("playPauseBtn").style.backgroundImage = "url('Images/playBtn.png')";
      document.getElementById("playPauseBtn").title = "Play"
    }else{
      document.getElementById("playPauseBtn").style.backgroundImage = "url('Images/pauseBtn.png')";
      document.getElementById("playPauseBtn").title = "Pause"
    }
  }
  updateRegistersV(){
    let registerDoms = document.getElementById("registersV");
    for(let i=0; i<16; i++){
      registerDoms.children[i].children[1].innerHTML = this.em.registersV[i]
    }
  }
  updateRegisterI(){}
  updateRegisterDelay(){}
  updateRegisterSoundTimer(){}
  updateProgramCounter(){}
  updateStackPointer(){}
  updateStack(){}
  updateMemory(){}
  updateVF(){}

}
