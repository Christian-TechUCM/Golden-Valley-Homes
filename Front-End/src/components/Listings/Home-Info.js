import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './Home-Info.css';

  import { useAuth } from "../../components/AuthContext";
const AgentContactModal = ({ agent, onClose }) => {
  const [message, setMessage] = useState('');
  const { currentUser} = useAuth();

  const handleSendMessage = () => {
    if (message.trim() === '') {
      alert('Please enter a message.');
      return;
    }
    axios.post('http://127.0.0.1:5000/api/send_message', {
      user_id: currentUser.user_id,
      agent_id: agent.id,
      message: message,
      Sender:'user'
    })
    .then(response => {
      alert('Message sent successfully!');
      setMessage('');
      onClose(); 
    })
    .catch(error => {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Contact Agent</h2>
        <p>Name: {agent.name}</p>
        <p>Email: {agent.email}</p>
        <p>Phone: {agent.contact_number}</p>
        <textarea
          className='message-input'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
        ></textarea>
        <button className = "send-button" onClick={handleSendMessage}>Send Message</button>
        <button className = "close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};




function HomeDetail() {
  const { id } = useParams();
  const [home, setHome] = useState(null);
  const [agent, setAgent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saveConfirmation, setSaveConfirmation] = useState('');
  const { currentUser} = useAuth();
  const user_id = currentUser.user_id;



  const handleSaveHome = () => {
    axios.post(`http://127.0.0.1:5000/api/users/${user_id}/save_home`, { home_id: id })
      .then(response => {
        setSaveConfirmation('Home saved successfully!');
        setTimeout(() => {
          setSaveConfirmation('');
        }, 2000);
      })
      .catch(error => {
        console.error("Error saving home:", error);
        setSaveConfirmation('Failed to save home. Please try again.');
        setTimeout(() => {
          setSaveConfirmation('');
        }, 2000);
      });
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/homes/${id}`)
      .then(response => {
        setHome(response.data);
        return axios.get(`http://127.0.0.1:5000/api/agent_represents_home/${id}`)
      })
      .then(response => {
        const agentRepresentation = response.data.id;
        if (agentRepresentation) {
          return axios.get(`http://127.0.0.1:5000/api/agents/${agentRepresentation}`);
        } else {
          throw new Error('No agent found for this home.');
        }
      })
      .then(response => {
        setAgent(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  const handleContactClick = () => {
    setShowModal(!showModal);
  };


  if (!home || !agent)  return <div>Loading...</div>;


  return (
    <div className="home-detail">
         <Link to="/">Back to Home</Link>
      {saveConfirmation && <div className="save-confirmation">{saveConfirmation}</div>}
      <img src={home.imageURL} alt="House" className="home-image" /> {/* Use the imageURL from the home object */}
      <h1>{home.address}</h1>
      <div className="home-info">
        <p>Price: ${home.price}</p>
        <p>Square Feet: {home.square_feet}</p>
        <p>Bedrooms: {home.bedrooms}</p>
        <p>Bathrooms: {home.bathrooms}</p>
        <p>Availability: {home.availability_status}</p>
        <p>Agent: {agent.name}</p>
      </div>
      
      <div className="home-actions">
        <button onClick={handleSaveHome}>Save Home</button>
        <button onClick={handleContactClick}>Contact Agent</button>
      </div>
      {showModal && <AgentContactModal agent={agent} onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default HomeDetail;