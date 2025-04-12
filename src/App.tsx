import React from 'react';
import './App.css';

function App() {

  const sendMessageToCohere = async (message: string) => {
    const response = await fetch('http://localhost:3001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    console.log('AI Response:', data);
  };

  const websiteURL = "https://gmail.com/";
  const goalOrTask = "Send email to professor";

  // For the final version:
  const userInput = "Give the answer to the following as strictly either \"yes\", or \"no\". Given the following website url: " + websiteURL + " And given the following task/goal: " + goalOrTask + "Is the website the user is on relevant to completing the task? Be lenient. If it could be related, assume it is. Be strict when it comes to websites that are obviously distracting such as social medias but lenient with anything else that could be related.";

  // For fine tuning and testing
  // const userInput = "Given the following website url: " + websiteURL + " And given the following task/goal: " + goalOrTask + "Is the website the user is on relevant to completing the task? Explain your reasoning and what limits your capability to ansswer.";

  const handleSubmit = () => {
   sendMessageToCohere(userInput);
  };

  return (
    <><button onClick={handleSubmit}>Ask AI</button>
    </>
  );
}

export default App;
