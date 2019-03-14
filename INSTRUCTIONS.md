Instructions
============


## Using Chip-8
### Run sample Chip 8 title page
1. Open index.html or use this link : https://adamnizol.github.io/CHIP-8-Emulator/
2. Press "Load Program" button
3. Press "Play" button

### How to use additional features
1. Speed Slider: Slide dial to change speed after starting the program
2. Undo/Redo buttons: press undo or redo after pausing the program to undo or redo opcodes
## Using Sprite Editor Tool
1. Open tool.html located in Tool folder.
2. Draw sprite of choice by clickin on boxes in grid
3. Click Finish Translating button get the binary and hexidecimal conversion of sprite
4. Click Pixels if you wish to restart the

## Running the CHIP8 Compiler
_Currently compiler only works with Compiler/testGames/primitivePong.chip8. We are working on debugging for other games_
1. Open Compiler/index.html in web browser
2. Click import and open primitivePong.chip8 found in Compiler/testGames/primitivePong.chip8
3. Copy paste the opcodes into the emulator using the index.html file found at the root of the folder_
4. Click load then the play button

## Running basic pong sample code
_For instructions with pictures, see the PongInstructions document, located in the Games folder_
1. Open index.html located in the main directory of the project.
2. Delete the default opcodes (the sample Chip8 title page opcodes) from the Emulator's text field in the center of the screen.
3. In the space where the default opcodes were deleted, copy and paste the following opcodes:  
00e0 A22A 6620 6710 6801 6901 6102 D672  
D672 4700 8914 471E 8915 463F 8815 4600  
8814 8684 8794 D672 1210 0080  
4. Press the "Load Program" button.
5. Press the "Play" button.

## Running the assembly files for the Tetris and Pong games using an external emulator
_For instructions with pictures, see the ExternalEmulatorInstructions document, located in Games folder_

## Automated Testing
_To run automated testing, turn on console and use function testInstructions() for instructions, use function testFonts() to display CHIP-8 default fonts. The test will automatically output all the instructions that are loaded into the memory. The test displays all the variables after each instruction is executed. To look at the program loaded, scroll to the top of the console._

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
