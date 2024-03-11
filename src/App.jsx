

import React, { useState, useEffect, useRef } from 'react';

function App() {

  const [transcript, setTranscript] = useState('');

  const recognition = useRef(null);

  const synthesis = useRef(null);

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {

    if (!('webkitSpeechRecognition' in window) || !('speechSynthesis' in window)) {

      alert('Your browser does not support speech recognition or synthesis. Please use Chrome.');

    } else {

      recognition.current = new window.webkitSpeechRecognition();

      recognition.current.continuous = true;

      recognition.current.interimResults = true;

      recognition.current.lang = 'en-US';

      recognition.current.onresult = function (event) {

        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {

          if (event.results[i].isFinal) {

            setTranscript(event.results[i][0].transcript);

            speak(event.results[i][0].transcript); // Speak back the recognized speech

          } else {

            interimTranscript += event.results[i][0].transcript;

          }
        }
      };

      recognition.current.onerror = function (event) {

        console.error('Speech recognition error:', event.error);

      };

      recognition.current.onend = function () {


        console.log('Speech recognition ended.');

        setIsListening(false);

      };

      synthesis.current = window.speechSynthesis;
    }
  }, []);

  const startRecognition = () => {

    recognition.current.start();

    setIsListening(true);

  };

  const stopRecognition = () => {

    recognition.current.stop();


    setIsListening(false);
  };

  const speak = (text) => {

    const utterance = new SpeechSynthesisUtterance(text);

    console.log(text)

    synthesis.current.speak(utterance);

  };

  return (

    <div className='Container'>
      <div className="ui-abstergo">
        <div className="abstergo-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <br />

        <div className="loader">
          <div className="light"></div>
          <div className="black_overlay"></div>
        </div>

        <div className="ui-text" id='UsersCommand'>
          {transcript}  <br />
          <div className="ui-dot ml-3"></div>
          <div className="ui-dot"></div>
          <div className="ui-dot"></div>
        </div>
      </div>
      <br />
      <div className="loader">
        <div className="light"></div>
        <div className="black_overlay"></div>
      </div><br />
      <center>
        {isListening ? (

          <button className="bg-sky-400 hover:bg-sky-700 p-3 rounded-xl " onClick={stopRecognition}>Stop Recognition</button>

        ) : (

          <button className="bg-sky-400 hover:bg-sky-700 p-3 rounded-xl" onClick={startRecognition}>Start Recognition</button>

        )}
      </center>
    </div>
  );
}

export default App;
