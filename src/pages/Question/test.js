import React, { useEffect,useState } from 'react';
import axios from 'axios';


const api_address = 'http://jakkapatkan.pythonanywhere.com/api/sentiment'

const MyComponent = () => {
  
  


  /*----------------------- Old Version --------------------*/
  /*
  const [inputValue, setInputValue] = useState('');
  const sendStringToFlask = () => {
    axios.post('http://127.0.0.1:5000/api/sentiment', { string: inputValue })
      .then(response => {
        setResult(response.data.result); // Extract the result from the response
        console.log(response.data.result)
      })
      .catch(error => {
        // Handle any errors that occur during the request
      });
  };
  */

  /*----------------------- New Version --------------------*/
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');

  const TestsendDataToFlask = async () => {
    try {
      const response = await axios.post(api_address, {
        text: inputText,

      });
      setResult(response.data.result);
      console.log('result => '+response.data.result);
    } catch (error) {
      console.error(error);
    }
  };


 
  return (
    <div>
        <div >
          <textarea className='form-control mb-3' rows="3" type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />

          <button onClick={TestsendDataToFlask}>Send to Flask</button>
          
        </div>

        <div>
          <p>Response from Flask: {result}</p>
        </div>
      
      
    </div>
  );
};

export default MyComponent;
