console.log("running tests");

runTests();

function runTests(){
  ///TESTING HORIZONTAL GAPS//////
  translateSpriteWithHGaps();
  resetPixels();

  ///TESTING VERTICAL GAPS//////
  translateSpriteWithVGaps();
  resetPixels();

  ///TESTING RANDOM GAPS//////
  translateSpriteWithRandomGaps();
  //resetPixels();

}
///TESTING HORIZONTAL GAPS//////
function translateSpriteWithHGaps(){
  console.log("TESTING HORIZONTAL GAPS");
  elements = document.getElementsByClassName("pixel");

  image =new Array(15*8).fill(0);
  for(let i=0; i<15 ; i++){ //find startRow and endRow
    let binRow = "";
    for(let j= 0; j<8; j++){
        if(i%2==0){
          //Manually filling changing boxes
          elements[j+8*i].style.backgroundColor="white";
          image[j+8*i] = 1; //storing right answer

        }
      }
  }

  translateSprite(); //running function that we are testing
  checkTranslation(image); //passing in right answer to check if translation worked

}

///TESTING VERTICAL GAPS//////
function translateSpriteWithVGaps(){
  console.log("TESTING RANDOM GAPS");
  elements = document.getElementsByClassName("pixel");

  image =new Array(15*8).fill(0);
  for(let i=0; i<15 ; i++){ //find startRow and endRow
    let binRow = "";
    for(let j= 0; j<8; j++){
        if(j%2==0){
            //Manually filling changing boxes
          elements[j+8*i].style.backgroundColor="white";
          image[j+8*i] = 1; //storing right answer

        }
      }
  }

  translateSprite(); //running function that we are testing
  checkTranslation(image); //passing in right answer to check if translation worked

}



///TESTING RANDOM GAPS//////
function translateSpriteWithRandomGaps(){
  console.log("TESTING HORIZONTAL GAPS");
  elements = document.getElementsByClassName("pixel");

  image =new Array(15*8).fill(0);
  for(let i=0; i<15 ; i++){ //find startRow and endRow
    let binRow = "";
    for(let j= 0; j<8; j++){
        if((j+i/2)%3==0){
          //Manually filling changing boxes
          elements[j+8*i].style.backgroundColor="white";
          image[j+8*i] = 1; //storing right answer

        }
      }
  }

  translateSprite(); //running function that we are testing
  checkTranslation(image); //passing in right answer to check if translation worked

}


///////FUNCTIONS FOR TESTING///////


function checkTranslation(image){ //pass in right answer

  var noErrors = true;
  //console.log(image);
  var theTranslation= "";
  theTranslation = document.getElementById("outputBox").value; //read translation from textbox

  outputBin = Array(8);
  retreivedImage = new Array(15*8).fill(0);
  var retreivedIndex=0;

  for(var i=0; i< theTranslation.length ; i++){
    if(theTranslation.substring(i , i + 5)== "Bin: "){ //extract binary
      for(var j =0 ; j<8 ; j++){
        retreivedImage[retreivedIndex] =theTranslation[j+i+5];
        retreivedIndex++;
      }
    }
  }

  for(var m =0; m<120; m++){ //compare extracted binary with right answer

    if(!(image[m] == parseInt(retreivedImage[m],10))){
      //console.log("comparing: "+ image[m] + " and " + parseInt(retreivedImage[m],10)  );
      console.log("There was an error");
      noErrors =false;
    }
  }

  if(!noErrors){
    console.log("Test Failed");
  }
  else{
    console.log("Test Passed");
  }
}
