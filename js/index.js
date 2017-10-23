$(document).ready(function() {
  let isClickable = false;
  var audio, audio1, audio2, audio3, audio4, failAudio;
  audio1 = new Audio(["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"]);
  audio2 = new Audio(["https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"]);
  audio3 = new Audio(["https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"]);
  audio4 = new Audio(["https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"]);
  audio = [audio1, audio2, audio3, audio4];
  failAudio = new Audio(["https://www.soundjay.com/button/sounds/beep-03.mp3"]);
  //Data controller zone
  var dataController = (function() {
    var trackArr = [],
        testArr = [];
    return {
      testing: function() {
        console.log(trackArr);
      },

      trackClick: function(ID) {
        trackArr.push(parseInt(ID));
      },

      saveTest: function(randomID) {
        testArr.push(randomID);
      },

      getTrackArr: function() {
        return trackArr;
      },

      getTestArr: function() {
        return testArr;
      },

      resetTrackArr: function() {
        trackArr.splice(0, trackArr.length);
      },
      resetTestArr: function() {
        testArr.splice(0, testArr.length);
      },

      checkResult: function() {
        let trackResult;
        trackResult = trackArr.every(function(ele, index) {
          return trackArr[index] === testArr[index];
        });
        return trackResult;
      }
    }; // end of return
  })();

  //----------------------------------------------------

  //Center controller zone
  var controller = (function(dataCtrl) {
    function startNewGame() {
    
      botGiveTest();
      $(".box").click(function() {
        console.log(dataCtrl.getTrackArr())
        if(isClickable){
          let isStrictMode = $("#strict").val();
          let trackArr = dataCtrl.getTrackArr(),
              testArr = dataCtrl.getTestArr();
          //1.get the ID
          let box = this,
              ID = parseInt(box.id);
          //2.play the ID box and save the ID to track array
          playerPlay(ID);
          // console.log(trackArr);
          //3.checking
          let trackResult = dataCtrl.checkResult();
          if (trackResult === true && trackArr.length === testArr.length) {
            isClickable=false;
            $("#screen").text(testArr.length);
            if (testArr.length === 20) {
              alert("You win");
            }
            if (testArr.length < 20) {
              dataCtrl.resetTrackArr();
              setTimeout(function() {
                botGiveTest();
              },2000);
            }
          } else if (trackResult === false && isStrictMode === "off") {
            isClickable = false;
            $("#screen").text(testArr.length);
            setTimeout(function() {
              failAudio.play();
            }, 2000);
            dataCtrl.resetTrackArr();
            setTimeout(function() {
              botGiveOldTest();
            }, 3000);
          } else if (trackResult === false && isStrictMode === "on") {
            isClickable=false;
            $("#screen").text("0");
            setTimeout(function() {
              failAudio.play();
            }, 2000);
            dataCtrl.resetTestArr();
            dataCtrl.resetTrackArr();
            setTimeout(function() {
              botGiveTest();
            }, 3000);
          }
        }
      }); //end of click event
     
     
    }

  


    function playerPlay(ID) {
      boxPlayed(ID);
      //1. Push id into array to track the result
      dataCtrl.trackClick(ID);
      dataCtrl.testing();
    }

    function boxPlayed(ID) {
      audio[ID - 1].play();
      $("#" + ID).addClass("active");
      setTimeout(function() {
        $("#" + ID).removeClass("active");
      }, 200);
    }

    function botGiveTest() {
      isClickable =false;
      let randomID, testArr;
      randomID = Math.floor(Math.random() * 4) + 1;
      //1.save the test in the test array in data controller
      dataCtrl.saveTest(randomID);
      //2. get test array
      testArr = dataCtrl.getTestArr();
      console.log(testArr);
      //3.play the test, loop throung test array
      testArr.forEach(function(randomID, index,array) {
        if(index === array.length-1 && array.length >= 1) {
          setTimeout(function(){
            isClickable =true;
          },1500*(index+1));
        }
        setTimeout(function() {
          boxPlayed(randomID);
        }, 1200 * (index+1));
      });

    }

    function botGiveOldTest() {
      isClickable=false;
      testArr = dataCtrl.getTestArr();
      testArr.forEach(function(randomID, index,array) {
        if(index === array.length-1 && array.length >= 1) {
          setTimeout(function(){
            isClickable =true;
          },1000*(index+1));
        }
        setTimeout(function() {
          boxPlayed(randomID);
        }, 1000 * index);
      });

    }

    return {
      init: function() {
        dataCtrl.resetTrackArr();
        dataCtrl.resetTestArr();
        startNewGame();
      }
    };
  })(dataController);

  $("#normal").click(function() {
    controller.init();
    $(this).off("click");

  });
  var clicked = false;
  $("#strict").click(function() {
    $(this).text("Strict Mode : " + (clicked ? "OFF" : "ON"));
    $(this).val(clicked ? "off" : "on");
    clicked = !clicked;
  });

  //--------------------------------------------------
}); //end of document ready