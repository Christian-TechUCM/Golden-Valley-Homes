// LoginAlert.js
import React from 'react';
import '../../pages/common/Home.css'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button
  } from "@chakra-ui/react";
  import { useNavigate } from 'react-router-dom';

  const LoginAlert = ({ isOpen, onClose }) => {
    const cancelRef = React.useRef();
    const navigate = useNavigate(); // Initialize useNavigate
  
    const handleLogin = () => {
      onClose(); // Close the dialog
      navigate('/login'); // Navigate to login page
    };
  
    return (
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay className="alert-backdrop">
          <AlertDialogContent className="alert-dialog" bg="white" borderRadius="md" boxShadow="sm" m={3}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Not Signed In
            </AlertDialogHeader>
  
            <AlertDialogBody>
              Please sign in to view more details.
            </AlertDialogBody>
  
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} colorScheme="gray" mr={3}>
                Close
              </Button>
              <Button onClick={handleLogin} colorScheme="blue">
                Login
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  }
  
  export default LoginAlert;