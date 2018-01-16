var conversationalForm = window.cf.ConversationalForm.startTheConversation({
  formEl: document.getElementById("form"),
  context: document.getElementById("cf-context"),
  userImage: "",
  robotImage:
    "",
  submitCallback: function() {
    alert(
      "Custom submit callback reached, removing Conversational Form, see markup of this file"
    );
  }
});

window.onload = function() {
  var dispatcher = new cf.EventDispatcher(),
    synth = null,
    recognition = null,
    msg = null,
    SpeechRecognition = null;

  try {
    SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  } catch (e) {
    console.log(
      "Example support range: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility"
    );
  }

  // here we use https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
  // you can use what ever API you want, ex.: Google Cloud Speech API -> https://cloud.google.com/speech/

  if (SpeechRecognition) {
    // here we create our input
    var microphoneInput = {
      // behaviors needs to follow the cf.IUserInput interface, they will be checked
      init: function() {
        console.log("voice: init method called from mic integration");
      },
      // set awaiting callback to false, as we will NOT await the speak in this example
      awaitingCallback: false,
      cancelInput: function() {
        console.log("voice: CANCEL");
        finalTranscript = null;
        if (recognition) {
          recognition.onend = null;
          recognition.onerror = null;
          recognition.stop();
        }
      },
      input: function(resolve, reject, mediaStream) {
        console.log("voice: INPUT");
        // input is called when user is interacting with the CF input button (UserVoiceInput)

        // connect to Speech API (ex. Google Cloud Speech), Watson (https://github.com/watson-developer-cloud/speech-javascript-sdk) or use Web Speech API (like below), resolve with the text returned..
        // using Promise pattern -> https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
        // if API fails use reject(result.toString())
        // if API succedes use resolve(result.toString())

        if (recognition) recognition.stop();

        (recognition = new SpeechRecognition()), (finalTranscript = "");

        recognition.continuous = false; // react only on single input
        recognition.interimResults = false; // we don't care about interim, only final.

        // recognition.onstart = function() {}
        recognition.onresult = function(event) {
          // var interimTranscript = "";
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
        };

        recognition.onerror = function(event) {
          reject(event.error);
        };

        recognition.onend = function(event) {
          if (finalTranscript && finalTranscript !== "") {
            resolve(finalTranscript);
          }
        };

        recognition.start();
      }
    };
  }

  var conversationalForm = window.cf.ConversationalForm.startTheConversation({
    formEl: document.getElementById("form"),
    context: document.getElementById("cf-context"),
    eventDispatcher: dispatcher,

    // add the custom input (microphone)
    microphoneInput: microphoneInput,

    submitCallback: function() {
      // remove Conversational Form
      console.log(
        "voice: Form submitted...",
        conversationalForm.getFormData(true)
      );
      alert("You made it! Check console for data");
    }
  });

  if (!SpeechRecognition) {
    conversationalForm.addRobotChatResponse(
      "SpeechRecognition not supported, so <strong>no</strong> Microphone here."
    );
  }
};