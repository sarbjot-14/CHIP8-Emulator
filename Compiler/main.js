
window.onload = function(){
  init();
}

function init(){
  document.getElementById("importBtn").onclick = () => { document.getElementById("fileInput").click() }

  document.getElementById("fileInput").onchange = () => {
    let reader = new FileReader();
    reader.readAsText(document.getElementById("fileInput").files[0]);
    reader.onloadend = (event) => {
      let output = (reader.result);
      //console.log(output);
      let chip8 = new chip8Compiler();
      output = chip8.compileMneonicToOpcodes(output);
      document.getElementById("outputBox").innerHTML = output;
    }
  }
}
