Instructions
============


## Using Chip-8
### Run sample Chip 8 title page
1. Open index.html or use this link : https://adamnizol.github.io/CHIP-8-Emulator/
2. Press "Load Program" button.
3. Press "Play" button.

### How to use additional features
1. Speed Slider: Slide dial to change speed after starting the program.
2. Undo/Redo buttons: press undo or redo after pausing the program to undo or redo opcodes.
3. Toggle Legacy mode: tick to enable Legacy mode. Turn on Legacy mode to use value of VY for shifting instructions. Turn off Legacy mode to use only value of VX for shifting, ignoring VY.
## Using Sprite Editor Tool
1. Open tool.html located in Tool folder.
2. Draw sprite of choice by clickin on boxes in grid.
3. Click "Finish Translating" button get the binary and hexidecimal conversion of sprite.
4. Click "Reset Pixels" if you wish to restart it.

## Running the CHIP8 Compiler
_The compiler is built into the emulator, however, if you wish to see the opcodes separately, follow these steps._
1. Open Compiler/index.html in web browser.
2. Click import and open pong.ch8 or tetris276.ch8 found in games folder.

## Running the games in our emulator
_For instructions with pictures, see the GameInstructions document, located in the Games folder._
Note: Currently there are problems running Tetris in our emulator, however, it runs fine in the external emulator. The emulator works best with Chrome.

## Running the assembly files for the Tetris and Pong games using an external emulator
_For instructions with pictures, see the ExternalEmulatorInstructions document, located in Games folder._

## Automated Testing
_Press the "Test" button to do automated testing, the result is displayed on the console. To see if the fonts are working, use testFonts() in the console. The test will automatically output the results of all the instructions that are loaded into the memory. The result displays PASSED if that instruction is working correctly, FAILED otherwise_

## Chip-8 testing
_For testing, opcodes(instruction) can be entered into the "Text field" that is below the "Display screen". After entering the opcodes, the user then has to press the "Load program" button in order for the emulator to initialize the data. Then the user proceed to press the "Play"/"Pause" button to run the program. The program can be stopped, or resumed, when pressing the "Play"/"Pause" button. The user can slow down or speed up the execution of the opcodes by sliding the "Speed slider" bar. The user can use backward or forward button to move to the closest instruction in the stack. Lastly, below the "Text field" displays all the registers and values of them after in the current state. Each opcode includes of 4 hexadecimal characters, separating opcodes can be recognize by the emulator through a space or a new line. For reference, a list of opcodes can be looked up into Wikipedia, Cowgod's Chip-8 specification that was cited in this project_

### Tool-Sprite Editor Testing

_There are three tests made for the tool. You can run them individually or all together. To run tests input the function calls into console of the browser._

Testing horizontally gapped sprite:
translateSpriteWithHGaps();

Testing vertically gapped sprite:
translateSpriteWithVGaps();

Testing sprite with random gaps:
translateSpriteWithRandomGaps();

Running all tests at once:
runTests();
