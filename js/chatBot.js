const CLIENT_TOKEN = 'D2L3LEQZABK533LD5BXBCZ55RAWLNAJE';
const URI = 'https://api.wit.ai/message?v=20170307&q=';
const AUTH = 'Bearer ' + CLIENT_TOKEN;
const OPTIONS = {
  headers: {
    Authorization: AUTH
  }
};

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var grammar = '#JSGF V1.0;';

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

var mReplying = false;
var script;

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function displayStatus(text) {
  document.getElementById("status").innerHTML = text;
}

function displayResult(text) {
  document.getElementById("result").innerHTML = text;
}

function interpretResult(text) {
  fetch(URI + text, OPTIONS)
    .then(res => res.json())
    .then(response => {
      // console.log(response);
      let text = response["_text"];

      if (undefined != response["entities"]["intent"])
      {
        let intent = response["entities"]["intent"][0]["value"];
        console.log('intetnt: ' + intent);
        displayResult("I heard: " + text);

        if ("repeat" == intent){
          output = script.repeat();
          if (undefined == output) {
            output = script.nextState("");
          }
        }
        else {
          output = script.nextState(intent);
        }
      }
      else {
        output = script.nextState("");
        displayResult("I heard: " + text);
      }

      var audio = new Audio(output + '/1.wav');
      audio.onended = () => {
        recognition.start();
        mReplying = false;
        displayStatus('Listening...');
        displayResult("");
      }
      mReplying = true;
      recognition.stop();
      displayStatus('Replying...');
      var promise = audio.play();
      if (promise !== undefined) {
        promise.then(_ => {
          console.log('Autoplay started!');
        }).catch(error => {
          console.log('Autoplay was prevented.');
        });
      }
    });
}

recognition.onresult = function(event) {
  recognition.stop();
  displayStatus('Thinking...');
  var text = event.results[event.results.length - 1][0].transcript;
  interpretResult(text);
}

recognition.onend = function() {
  if (!mReplying)
  {
    recognition.stop();
    setTimeout(() => recognition.start(), 100);
  }
}

recognition.onerror = function(event) {
  displayStatus('Error occurred in recognition:');
  displayResult(event.error);
  setTimeout(() => displayStatus('Listening...'), 1000);
  // recognition.start();
}

fetch('./scripts/theRightQuestion/theRightQuestion.json')
  .then(res => res.json())
  .then(res => {
    script = new StateMachine(res);
    recognition.start();
    displayStatus('Listening...');
  });

