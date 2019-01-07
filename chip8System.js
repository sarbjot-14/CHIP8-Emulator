class chip8System{
  constructor(){
    this.ui = new visualizer();
    this.chipEmulator = new emulator();
  }

  start(){
    this.ui.init();
    this.chipEmulator.start();
  }

}
let chip = new chip8System();
