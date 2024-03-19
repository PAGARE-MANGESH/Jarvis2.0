import React, { useState, useEffect, useRef } from 'react';
import CameraCapture from './assets/Cammands/Capture';

function App() {
  const [transcript, setTranscript] = useState('');
  const recognition = useRef(null);
  const synthesis = useRef(null);
  const [isListening, setIsListening] = useState(false);



  // web cam  

  const [imageSrc, setImageSrc] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();



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


    // finding  location code   




  }, []);


  const startRecognition = () => {
    recognition.current.start();
    setIsListening(true);
    document.getElementById('cammand')
    synthesis.current.speak(new SpeechSynthesisUtterance("Initializing Jarvis2.0"));

  };

  const stopRecognition = () => {
    recognition.current.stop();
    setIsListening(false);
    document.getElementById('cammand').innerHTML = ''
    synthesis.current.speak(new SpeechSynthesisUtterance("Now I'm Stoping "));

  };


  const speak = (text) => {

    const utterance = new SpeechSynthesisUtterance(text);
    synthesis.current.speak(utterance);

    // for  web camera  


    if (text.toLowerCase().includes('cartoon')) {

      synthesis.current.speak(utterance);

    } else if (text.toLowerCase().includes('open google')) {

      synthesis.current.speak(new SpeechSynthesisUtterance("Opening Google boss"));

      window.open('https://google.com/', '_blank');

    } else if (text.toLowerCase().includes('open youtube')) {

      synthesis.current.speak(new SpeechSynthesisUtterance("Opening YouTube boss"));

      window.open('https://youtube.com/', '_blank');

    } else if (text.toLowerCase().includes('what is') || text.toLowerCase().includes('who is') || text.toLowerCase().includes('when') || text.toLowerCase().includes('where is')) {

      window.open(`https://www.google.com/search?q=${text}`, '_blank');

      synthesis.current.speak(new SpeechSynthesisUtterance("I Found Something Here"));

    } else if (text.toLowerCase().includes('clear all')) {

      document.getElementById('cammand').replaceChild = '';

    } else if (text.toLowerCase().includes('stop now')) {

      console.log('object');

    } else if (text.toLowerCase().includes('tell me today\'s date')) {

      const today = new Date();

      // Extract components of the date
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');

      // Format the date
      const formattedDate = `${year}-${month}-${day}`;

      // Respond with today's date

      console.log(formattedDate);
      synthesis.current.speak(new SpeechSynthesisUtterance(`${formattedDate}`));


    }
    else {
      console.error('hello');
    }

  }


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
          <i id='cammand'> {transcript} </i>
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
          <button className="bg-sky-400 hover:bg-sky-700 p-3 rounded-xl" onClick={stopRecognition}>Stop Recognition</button>
        ) : (
          <button className="bg-sky-400 hover:bg-sky-700 p-3 rounded-xl" onClick={startRecognition}>Start Recognition</button>
        )}


        <br />

      </center>

    </div>
  );

}

export default App;
