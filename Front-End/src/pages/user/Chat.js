import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Card, CardContent, TextField, Typography, Dialog, DialogActions, DialogContent, List, ListItem, DialogTitle } from '@mui/material';
import { useAuth } from "../../components/AuthContext";
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
function Chat() {
    const [agentName, setAgentName] = useState([]);
    const [agents, setAgents] = useState([]);
    const [error, setError] = useState('');
    const [selectedAgentName, setSelectedAgentName] = useState('');
    const [selectedAgentId, setSelectedAgentId] = useState(null);
    const { currentUser} = useAuth();
    const userId = currentUser.user_id;  
    const baseUrl = 'http://127.0.0.1:5000'; // Assuming Flask runs on port 5000
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChat, setShowChat] = useState(false);  
    const [showAgentList, setShowAgentList] = useState(false); 
    const [hover, setHover] = useState(false);
    const toggleAgentList = () => {
      setShowAgentList(!showAgentList);
    };

    const openChatWithAgent = (agent) => {
      setSelectedAgentName(agent.name);
      setSelectedAgentId(agent.id);
      setShowChat(true);
      
    
      axios.get(`${baseUrl}/api/users/${userId}/messages/agents/${agent.id}`)
        .then(response => {
          setMessages(response.data); // Set the fetched messages to state
          setShowChat(true); 
        })
        .catch(error => {
          console.error("Error fetching messages for agent:", error);
          setError(error.message);
        });
    };
    

  useEffect(() => {
    axios.get(`${baseUrl}/api/users/${userId}/messages`)
      .then(response => {
        // Extract unique agent IDs from messages
        const uniqueAgentIds = [...new Set(response.data.map(msg => msg.agent_id))];
  
        // Fetch each agent's details
        return Promise.all(uniqueAgentIds.map(agentId =>
          axios.get(`${baseUrl}/api/agents/${agentId}`)
        ));
      })
      .then(agentResponses => {
        // Map responses to agent objects with names
        const agentsData = agentResponses.map(res => ({
          id: res.data.id,
          name: res.data.name
        }));
        setAgentName(agentsData); // Store the full agent details
      })
      .catch(error => {
        console.error("Error fetching agents:", error);
      });
  }, [userId, baseUrl]);

  useEffect(() => {
    // Fetch messages to get agent IDs
    axios.get(`${baseUrl}/api/users/${userId}/messages`)
      .then(response => {
        // Extract unique agent IDs from messages
        const uniqueAgents = [...new Set(response.data.map(msg => msg.agent_id))];
        setAgents(uniqueAgents.map(id => ({ id }))); // Temporarily set agents as objects with just id
      })
      .catch(error => {
        console.error('Failed to fetch messages:', error);
        setError(error.message);
      });
  }, [userId, baseUrl]);

  const sendMessage = () => {
    const messageData = {
      user_id: userId,
      agent_id: selectedAgentId,
      message: newMessage,
      Sender: 'user'
    };
  
    axios.post(`${baseUrl}/api/send_message`, messageData)
      .then(response => {
        if (response.data && response.status === 201) {
          // Include the new message at the top of the chat messages list
          const sentMessage = {
            ...messageData, // Include all message data
            id: response.data.data.id, // Ensure you have a unique id for the new message
            interaction_date: new Date().toISOString(), // Use the current date-time as an approximation
          };
          setMessages(prevMessages => [...prevMessages, sentMessage]);
          setNewMessage(''); // Clear the input after sending
        }
      })
      .catch(error => {
        setError(error.message);
        console.error('Error sending message:', error);
      });
  };


  const selectAgent = (agentId) => {
    // Find the agent with the matching ID from the agents array
    const agent = agents.find(a => a.id === agentId);
  
    // Check if the agent was found
    if (agent) {
      console.log(`Opening chat with: ${agent.name} (ID: ${agent.id})`);
  
      // Set the state for the selected agent ID and name
      setSelectedAgentId(agentId);
  
      // Set the show chat state to true to open the chat dialog
      setShowChat(true);
  
      // Fetch messages for the selected agent
      axios.get(`${baseUrl}/api/users/${userId}/messages/agents/${agentId}`)
        .then(response => {
          // Set the fetched messages to state
          setMessages(response.data);
        })
        .catch(error => {
          // Log and set the error if the request fails
          console.error('Failed to fetch messages:', error);
          setError(error.message);
        });
    } else {
      // Log or handle the case where no agent is found with the given ID
      console.error(`No agent found with ID: ${agentId}`);
      // You may also set an error state or handle this case as needed
    }
  };
  

const handleChatOpen = (agentId, agentName) => {
  setSelectedAgentName(agentName);
  selectAgent(agentId); // This function will set the selected agent and fetch messages
  console.log(`Opening chat with: ${agentName}`); // Debugging line
};
// Function to handle closing of chat dialog
const handleChatClose = () => {
  setShowChat(false);
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { timeStyle: 'short', hour12: true }) + ' ' + date.toLocaleDateString();
};

const listItemStyle = {
  padding: '10px 20px',
  borderBottom: '1px solid #e0e0e0',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:first-child': {
    borderTopLeftRadius: '16px', // Rounded top corners for the first item
    borderTopRightRadius: '16px',
  },
  '&:last-child': {
    borderBottomLeftRadius: '16px', // Rounded bottom corners for the last item
    borderBottomRightRadius: '16px',
  },
};


const buttonStyle = {
  backgroundColor: '#1976d2', // blue background for the send button
  color: '#fff', // white text color for the send button
  '&:hover': {
      backgroundColor: '#1565c0', // darker blue on hover
  },
  margin: '8px 0', // margin around the send button
};

const listCardStyle = {
  width: '30%', // Adjust the width as needed
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 0 20px rgba(25, 118, 210, 0.5)', 
  margin: '20px 0',
  position: 'absolute', // Position the card absolutely to align it
  right: '25px', // Adjust the position as needed
  borderRadius: '16px', // Rounded corners for the bubble effect
  overflow: 'hidden', // Ensure the inside doesn't spill outside the border radius
  border: '1px solid #ccc', // Optional border for definition
  backgroundColor: '#fff', // White background for the card
};
const collapsibleStyle = {
  width: '45%',
  backgroundColor: 'white',
  color: 'var(--main-text-color)', // Make sure this CSS variable is defined somewhere in your CSS
  cursor: 'pointer',
  padding: '16px',
  border: '1px solid var(--border-color)', // Make sure this CSS variable is defined somewhere in your CSS
  borderRadius: '4px',
  margin: '10px 0',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  transition: 'background-color 0.3s ease',
};
const chatTriggerStyle = {
  cursor: 'pointer',
  color: '#1976d2', // Or any color that suits your theme
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px',
  borderRadius: '20px',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#f0f0f0', // Light background on hover to indicate it's clickable
  },
};

return (
  <Box>
      <Typography
  style={hover ? {...chatTriggerStyle, backgroundColor: '#f0f0f0'} : chatTriggerStyle}
  className="collapsible"
  variant="h6"
  gutterBottom
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
  onClick={toggleAgentList}
>
  <MarkChatUnreadIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
  Chats with Agents
</Typography>

      {showAgentList && (
          <Card style={listCardStyle}>
          <CardContent>
            <List>
              {agentName.map((agent) => (
                <ListItem 
                key={agent.id} 
                button 
                onClick={() => openChatWithAgent(agent)} 
                style={listItemStyle}
              >
                <ForumRoundedIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
                {agent.name}
              </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        
      )}

      <Dialog open={showChat} onClose={() => setShowChat(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Chat with {selectedAgentName}</DialogTitle>
          <DialogContent dividers>
    <div className="chat-messages">
        {messages.map((message, index) => (
            <div 
                key={message.id || index} 
                style={{
                    textAlign: message.Sender === 'user' ? 'right' : 'left',
                    marginLeft: message.Sender === 'user' ? 'auto' : '0',
                    marginRight: message.Sender === 'user' ? '0' : 'auto',
                    padding: '5px', 
                }}
            >
                <Typography component="span" style={{ fontWeight: message.Sender === 'user' ? 'bold' : 'normal' }}>
                    {message.Sender === 'user' ? 'You: ' : `${selectedAgentName}: `}
                </Typography>
                <Typography component="span">
                    {message.message}
                </Typography>
                <Typography variant="caption" display="block">
                    {formatDate(message.interaction_date)}
                </Typography>
            </div>
        ))}
    </div>
</DialogContent>
          <DialogActions>
              <TextField
                  autoFocus
                  margin="dense"
                  id="message"
                  label="Type a message"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
              />
              <Button style={buttonStyle} onClick={sendMessage}>Send</Button>
          </DialogActions>
      </Dialog>
  </Box>
);
}


export default Chat;
