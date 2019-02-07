Instructions
============


## Using Chip-8

## Using Sprite Editor Tool
1. Open tool.html located in Tool folder. 
2. Draw sprite of choice by clickin on boxes in grid
3. Click Finish Translating button get the binary and hexidecimal conversion of sprite
4. Click Pixels if you wish to restart the 

## Running basic pong sample code
_For instructions with pictures, see the PongInstructions document, located in the Games folder_
1. Open index.html located in the main directory of the project.
2. Delete the default opcodes from the text field in the center of the screen.
3. In the space where the default opcodes were deleted, copy and paste the following opcodes:  
00e0 A22A 6620 6710 6801 6901 6102 D672  
D672 4700 8914 471E 8915 463F 8815 4600  
8814 8684 8794 D672 1210 0080  
4. Press the "Load Program" button.
5. Press the "Play" button.

## Automated Testing

## Chip-8 testing

## Tool-Sprite Editor Testing

There are three tests made for the tool. You can run them individually or all together. To run tests input the function calls into console of the browser.

Testing horizontally gapped sprite:
translateSpriteWithHGaps();

Testing vertically gapped sprite:
translateSpriteWithVGaps();

Testing sprite with random gaps: 
translateSpriteWithRandomGaps();

Running all tests at once:

runTests();


