import React, { useState } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const sendStringToFlask = () => {
    axios.post('/api/endpoint', { string: inputValue })
      .then(response => {
        setResult(response.data.result); // Extract the result from the response
      })
      .catch(error => {
        // Handle any errors that occur during the request
      });
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
      <button onClick={sendStringToFlask}>Send String to Flask</button>
      <p>Result from Flask: {result}</p>
    </div>
  );
};

export default MyComponent;
