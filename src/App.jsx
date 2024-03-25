import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';




function App() {

  const [transcript, setTranscript] = useState('');
  const recognition = useRef(null);
  const synthesis = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [weatherData, setWeatherData] = useState(null);



  // web cam  



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


    if (text.toLowerCase().includes('hi')) {

      // synthesis.current.speak(utterance);

      let currentDate = new Date();

      let currentHour = currentDate.getHours();

      if (currentHour >= 6 && currentHour < 12) {
        synthesis.current.speak(new SpeechSynthesisUtterance(`Good morning boss. It's ${currentHour} AM.`));
      } else if (currentHour >= 12 && currentHour < 18) {
        synthesis.current.speak(new SpeechSynthesisUtterance(`Good afternoon, boss. It's ${currentHour} PM.`));
      } else if (currentHour >= 18 && currentHour < 20) {
        synthesis.current.speak(new SpeechSynthesisUtterance(`Good evening, boss. It's ${currentHour} PM.`));
      } else if (currentHour >= 20 || currentHour < 6) {
        synthesis.current.speak(new SpeechSynthesisUtterance(`Good night, boss. It's ${currentHour} PM.`));
      }

      // synthesis.current.speak(new SpeechSynthesisUtterance("hii boss How are you"));

    } else if (text.toLowerCase().includes('open google')) {

      synthesis.current.speak(new SpeechSynthesisUtterance("Opening Google boss"));

      window.open('https://google.com/', '_blank');

    } else if (text.toLowerCase().includes('open youtube')) {

      synthesis.current.speak(new SpeechSynthesisUtterance("Opening YouTube boss"));

      window.open('https://youtube.com/', '_blank');

    } else if (text.toLowerCase().includes('play')) {

      synthesis.current.speak(new SpeechSynthesisUtterance("Opening YouTube boss"));

      window.open(`https://www.youtube.com/results?search_query=${text}`, '_blank');

      synthesis.current.speak(new SpeechSynthesisUtterance(`here are list of ${text}`));

    } else if (text.toLowerCase().includes('what is') || text.toLowerCase().includes('who is') || text.toLowerCase().includes('when') || text.toLowerCase().includes('where is')) {

      window.open(`https://www.google.com/search?q=${text}`, '_blank');

      synthesis.current.speak(new SpeechSynthesisUtterance("I Found Something Here"));

    } else if (text.toLowerCase().includes('clear all')) {

      document.getElementById('cammand').replaceChild = '';

    } else if (text.toLowerCase().includes('open calculator')) {

      window.open('calculator.exe', '_blank');

    } else if (text.toLowerCase().includes('tell me date')) {

      let currentDate = new Date();

      let formattedDate = currentDate.toDateString();

      let dateTimeString = "Today's date is " + formattedDate


      synthesis.current.speak(new SpeechSynthesisUtterance(`${dateTimeString}`));

    } else if (text.toLowerCase().includes('tell me time')) {

      let currentDate = new Date();

      // Extract components of the date

      // let formattedDate = currentDate.toDateString();  // E.g., "Fri Mar 19 2024"

      let formattedTime = currentDate.toLocaleTimeString();  // E.g., "10:30:15 AM"
      console.log(typeof formattedTime)

      // Format the date

      // let dateTimeString = " Today's date is " + formattedDate + " and the current time is " + formattedTime;

      // Respond with today's date

      // console.log(dateTimeString);
      // console.log('object')

      synthesis.current.speak(new SpeechSynthesisUtterance(`current time is ${formattedTime}`));

    } else if (text.toLowerCase().includes("pune weather")) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=91d6e3f2c94214748f7848663adf99bf
          &units=metric`
        )
        .then((response) => {
          console.log('Weather API Response:', response.data);
          // Extract relevant data and set state
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            console.error('Error response from server:', error.response.data);
            console.error('Status code:', error.response.status);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
          } else {
            // Something happened in setting up the request that triggered an error
            console.error('Error setting up request:', error.message);
          }
        });

    }
    // };

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
