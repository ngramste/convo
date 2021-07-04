// const CLIENT_TOKEN = "4F7WLVUU2ZDZM4LPJZFGXFAWSC2R36JM"

// function setup() {
//   let testAudio = undefined;

//   const q = encodeURIComponent('javascript test');
//   const uri = 'https://api.wit.ai/message?v=20170307&q=' + q;
//   const auth = 'Bearer ' + CLIENT_TOKEN;
//   const options = {
//     headers: {
//       Authorization: auth
//     }
//   };

//   if (!('webkitSpeechRecognition' in window)) {
//     upgrade();
//   } else {
//     var recognition = new webkitSpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;

//     recognition.onstart = srOnStart;
//     recognition.onresult  = srOnresult ;
//     recognition.onspeechend = srOnspeechend;
//     recognition.onerror = srOnerror;
//   }
// }

// function srOnStart() {
//   console.log('Voice recognition activated. Try speaking into the microphone.');
// }

// function srOnresult(event) {
//   console.log('Speech resulted in something');
// }

// function srOnspeechend() {
//   console.log('You were quiet for a while so voice recognition turned itself off.');
// }

// function srOnerror(event) {
//   if(event.error == 'no-speech') {
//     console.log('No speech was detected. Try again.');
//   };
// }

// function draw() {

// }

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral' ];
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

var colorHTML= '';
colors.forEach(function(v, i, a){
  console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});
// hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';

document.onclick = function() {
  recognition.stop();
}

recognition.onresult = function(event) {
  var color = event.results[event.results.length - 1][0].transcript;
  console.log('Result received: ' + color + '.');
  bg.style.backgroundColor = color;
  console.log('Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function() {
  // recognition.stop();
  // recognition.start();
  recognition.abort();
  console.log('Ready to receive a color command.');
}

recognition.onnomatch = function(event) {
  console.log('I didnt recognise that color.');
}

recognition.onerror = function(event) {
  console.log('Error occurred in recognition: ' + event.error);
}

recognition.start();
