import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Card, CardContent, TextField, Typography, Dialog, DialogActions, DialogTitle, DialogContent, List, ListItem } from '@mui/material';
import { useAuth } from "../../components/AuthContext";
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
function AgentChat() {
    const [users, setUsers] = useState([]);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { currentUser} = useAuth();
    const userId = currentUser.user_id;
    const [agentId, setAgentId] = useState('')
    const baseUrl = 'http://127.0.0.1:5000';
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const [error, setError] = useState('');
    const [hover, setHover] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };
    
    useEffect(() =>{
        axios.get(`${baseUrl}/api/agents/user/${userId}`)
          .then(response => {
            setAgentId(response.data.id);
          })
        }
      );
    
      

      const toggleUserList = () => {
        setShowUserList(!showUserList);
      };
  
      useEffect(() => {
          axios.get(`${baseUrl}/api/agents/${agentId}/messages`)
              .then(response => {
                  // Extract unique user IDs from messages
                  const uniqueUserIds = [...new Set(response.data.map(msg => msg.user_id))];
  
                  // Fetch each user's details
                  return Promise.all(uniqueUserIds.map(userId =>
                      axios.get(`${baseUrl}/api/users/${userId}`)
                  ));
              })
              .then(userResponses => {
                  // Map responses to user objects with names
                  const usersData = userResponses.map(res => ({
                      id: res.data.id,
                      name: res.data.name
                  }));
                  setUsers(usersData); // Store the full user details
              })
              .catch(error => {
                  console.error("Error fetching users:", error);
              });
      }, [agentId, baseUrl]);
  
    const sendMessage = () => {
        const messageData = {
            agent_id: agentId,
            user_id: selectedUserId,
            message: newMessage,
            Sender: 'agent'
        };

        axios.post(`${baseUrl}/api/send_message`, messageData)
            .then(response => {
                if (response.data && response.status === 201) {
                    const sentMessage = {
                        ...messageData,
                        id: response.data.data.id,
                        interaction_date: new Date().toISOString(),
                    };
                    setMessages(prevMessages => [...prevMessages, sentMessage]);
                    setNewMessage('');
                }
            })
            .catch(error => {
                setError(error.message);
                console.error('Error sending message:', error);
            });
    };


    const handleChatClose = () => {
        setShowChat(false);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { timeStyle: 'short', hour12: true }) + ' ' + date.toLocaleDateString();
    };

    const openChatWithUser = (user) => {
        setSelectedUserName(user.name);
        setSelectedUserId(user.id);
        setShowChat(true);
        
        // Fetch messages for this user
        axios.get(`${baseUrl}/api/agents/${agentId}/messages/users/${user.id}`)
            .then(response => {
                setMessages(response.data); // Set the fetched messages to state
                setShowChat(true); // Open chat window after fetching messages
            })
            .catch(error => {
                console.error("Error fetching messages for user:", error);
                setError(error.message);
            });
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
        width: '20%',
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
      const collapsibleHoverStyle = {
        backgroundColor: hover ? '#4a90e2' : '', // Apply background color when hovering
        boxShadow: hover ? '0 0 8px #4a90e2' : '', // Apply box shadow when hovering
        transition: 'background-color 0.3s, box-shadow 0.3s',
        color: 'white', 
      };
    
    const buttonStyle = {
        backgroundColor: '#1976d2', // blue background for the send button
        color: '#fff', // white text color for the send button
        '&:hover': {
            backgroundColor: '#1565c0', // darker blue on hover
        },
        margin: '8px 0', // margin around the send button
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
            {/* Chat Card */}
            <Card style={listCardStyle}>
                <CardContent>
                    {/* Chat Card Header */}
                    <Typography
                        variant="h6"
                        gutterBottom
                        onClick={toggleChat} // Toggle the chat card when clicked
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <MarkChatUnreadIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
                            Chats with Users
                        </div>
                        <div>{isChatOpen ? '▲' : '▼'}</div> {/* Display arrow up or down based on open/closed state */}
                    </Typography>
                    
                    {/* Show users and chats when the chat card is open */}
                    {isChatOpen && (
                        <List>
                            {users.map(user => (
                                <ListItem 
                                    key={user.id} 
                                    button 
                                    onClick={() => openChatWithUser(user)} 
                                    style={listItemStyle}
                                >
                                    <ForumRoundedIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                    {user.name}
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>
    
           

            <Dialog open={showChat} onClose={handleChatClose} maxWidth="sm" fullWidth>
                <DialogTitle>Chat with {selectedUserName}</DialogTitle>
                <DialogContent dividers>
    <div className="chat-messages">
        {messages.map((message, index) => (
            <div 
                key={message.id || index} 
                style={{
                    textAlign: message.Sender === 'agent' ? 'right' : 'left',
                    marginLeft: message.Sender === 'agent' ? 'auto' : '0',
                    marginRight: message.Sender === 'agent' ? '0' : 'auto',
                    padding: '5px', 
                }}
            >
                <Typography component="span" style={{ fontWeight: message.Sender === 'agent' ? 'bold' : 'normal' }}>
                    {message.Sender === 'agent' ? 'You: ' : `${selectedUserName}: `}
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
export default AgentChat;
