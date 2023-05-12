import React, { useState } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const sendStringToFlask = () => {
    axios.post('/api/sentiment', { string: inputValue })
      .then(response => {
        setResult(response.data.result); // Extract the result from the response
        console.log(response.data.result)
      })
      .catch(error => {
        // Handle any errors that occur during the request
      });
  };

 
  return (
    <div>
        <div>   

            <textarea
                type="text"
                className='form-control mt-3 '
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
            />

            <button onClick={sendStringToFlask} className='btn btn-primary mt-3'>Send to Flask</button>
            <p className='pt-3'>Result from Flask: {result}</p>

        </div>
      
      
    </div>
  );
};

export default MyComponent;
