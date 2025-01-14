import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import ChatBadge from '../ChatBadge/ChatBadge';
import Message from '../Message/Message';
import Picker from 'emoji-picker-react';
import { getUserChats, addChat } from '../../services/dataServiceChats';
import { getMessages, addMessage } from '../../services/dataServiceMessages';
import { getUserInformation, currentUser } from '../../services/dataService';
import { getUsersOnBuoys } from '../../services/dataServiceBuoys';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001');

const ProfileChatRoom = ({ userId }) => {
  const [visitors, setVisitors] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [selectedMemberName, setSelectedMemberName] = useState('');
  const [userStatus, setUserStatus] = useState({});
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [lastReadMessageIds, setLastReadMessageIds] = useState({});

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('userConnected', { userId });
    console.log(`User ${userId} is now online`);

    return () => {
      socket.emit('userDisconnected', { userId });
      console.log(`User ${userId} is now offline`);
    };
  }, [userId]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const users = await getUsersOnBuoys();

        // if production set adminid to 16, if not set to 1
        if (process.env.NODE_ENV === 'production') {
          const adminId = 16;
          const admin = await getUserInformation(adminId);
          users.push(admin);
        } else {
          const user = await getUserInformation(1);
          users.push(user);
        }

        // Delete the current user from the list of visitors
        users.forEach((user, index) => {
          if (user.id === userId) {
            users.splice(index, 1);
          }
        });

        setVisitors(users);
        console.log('Fetched visitors:', users);
      } catch (error) {
        console.error('Error fetching visitors:', error);
      }
    };
    fetchVisitors();
  }, [userId]);

  useEffect(() => {
    const fetchUsernamesForVisitors = async () => {
      const newUsernameMap = {};
      for (const visitor of visitors) {
        if (visitor.id && !usernames[visitor.id]) {
          newUsernameMap[visitor.id] = await getName(visitor.id);
        }
      }
      setUsernames((prevUsernames) => ({ ...prevUsernames, ...newUsernameMap }));
    };
    fetchUsernamesForVisitors();
  }, [visitors]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const userChats = await getUserChats(userId);
        setChats(userChats);
      } catch (error) {
        console.error('Error fetching user chats:', error);
      }
    }
    fetchChats();
  }, [userId]);

  useEffect(() => {
    if (selectedChat) {
      async function fetchMessages() {
        setLoading(true);
        setError(null);
        try {
          const chatMessages = await getMessages(selectedChat.id);
          console.log('Fetched messages from server:', chatMessages);
          setMessages(chatMessages);
          socket.emit('join', selectedChat.id); // Join the selected chat room
          // Update the last read message ID for the selected chat
          if (chatMessages.length > 0) {
            const lastMessage = chatMessages[chatMessages.length - 1];
            setLastReadMessageIds((prev) => ({
              ...prev,
              [selectedChat.id]: lastMessage.id,
            }));
          }
        } catch (error) {
          if (error.message.includes('406')) {
            setMessages([]); // No messages
          } else {
            setError('Failed to fetch messages');
          }
        } finally {
          setLoading(false);
          scrollToBottom(); // Ensure we scroll after the messages are loaded
        }
      }
      fetchMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on('chat message', ({ chatId, message }) => {
      console.log('Received message via socket:', { chatId, message });
      if (message && typeof message.id !== 'undefined' && typeof message.text === 'string') {
        setMessages((prevMessages) => {
          if (!prevMessages.some((msg) => msg.id === message.id)) {
            console.log('Adding message to state:', message);
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      } else {
        console.error('Invalid message structure received via socket:', { chatId, message });
      }
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on('updateUserStatus', ({ userId, status }) => {
      setUserStatus((prevStatus) => ({ ...prevStatus, [userId]: status }));
      console.log(`User ${userId} is now ${status}`);
    });

    socket.on('onlineUsers', (onlineUsers) => {
      const updatedStatus = {};
      onlineUsers.forEach((id) => {
        updatedStatus[id] = 'online';
      });
      setUserStatus(updatedStatus);
      console.log('Online users:', onlineUsers);
    });

    return () => {
      socket.off('updateUserStatus');
      socket.off('onlineUsers');
    };
  }, []);

  const getName = async (id) => {
    try {
      const user = await getUserInformation(id);
      return user.name + ' ' + user.surname;
    } catch (error) {
      console.error('Error fetching user information:', error.message);
      return id;
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChat) {
      console.error('No chat selected');
      return;
    }

    if (messageInput.trim()) {
      try {
        const newMessage = await addMessage(userId, messageInput, new Date().toISOString(), selectedChat.id);
        console.log('Sending message:', newMessage);
        socket.emit('chat message', { chatId: selectedChat.id, message: newMessage });

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessageInput('');
        setLastReadMessageIds((prev) => ({
          ...prev,
          [selectedChat.id]: newMessage.id,
        }));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleVisitorClick = async (visitor) => {
    let existingChat = chats.find((chat) => chat.members.includes(visitor.id));
    if (!existingChat) {
      existingChat = await addChat([userId, visitor.id], new Date().toISOString());
      setChats((prevChats) => [...prevChats, existingChat]);
    }
    setSelectedChat(existingChat);
    const name = await getName(visitor.id);
    setSelectedMemberName(name);
  };

  const handleEmojiClick = (emojiObject, event) => {
    setMessageInput((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getUnreadMessagesCount = (chat) => {
    const lastReadMessageId = lastReadMessageIds[chat.id];
    //check if there are any messages in the chat
    if (!Array.isArray(chat.messages)) return 0;
    if (!lastReadMessageId) return chat.messages.length;

    const lastReadIndex = chat.messages.findIndex((msg) => msg.id === lastReadMessageId);
    console.log("Last read index:", lastReadIndex)

    return lastReadIndex === -1 ? chat.messages.length : chat.messages.length - lastReadIndex - 1;
  };

  return (
    <Flex direction="column" height="100%">
      <Box>
        <HStack overflowX="auto" spacing={2} mb={4}>
          {visitors.map((visitor, index) => {
            const username = usernames[visitor.id] || visitor.id;
            const isActive = userStatus[visitor.id] === 'online';
            // Find the chat associated with this visitor
            const chat = chats.find(chat => chat.members.includes(visitor.id));
            console.log("Found chat for visitor:", chat)
            const unreadCount = chat ? getUnreadMessagesCount(chat) : 0;
            return (
              <ChatBadge
                key={index}
                username={username}
                onClick={() => handleVisitorClick(visitor)}
                isActive={isActive}
                unreadCount={unreadCount}
              />
            );
          })}
        </HStack>

      </Box>
      <Flex direction="column" flex="1" position="relative" p={4}>
        <Box borderBottom="1px" borderColor="gray.200" py={2} mb={4}>
          <Text fontSize="lg" fontWeight="bold">
            {selectedChat ? selectedMemberName : 'Select a chat'}
          </Text>
        </Box>
        <Box flex="1" overflowY="auto" p={4} bg="gray.50" borderRadius="md">
          {loading ? (
            <Spinner />
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : messages.length === 0 ? (
            <Text>No messages yet. Start talking!</Text>
          ) : (
            <VStack maxHeight="45vh" spacing={1}>
              {messages.map((msg) => (
                msg && msg.text ? (
                  <Message key={msg.id} content={msg.text} isUser={msg.senderId === userId} />
                ) : (
                  <Text key={msg.id} color="red.500">Invalid message data</Text>
                )
              ))}
              <div ref={messagesEndRef} />
            </VStack>
          )}
        </Box>
        <Box position="sticky" bottom="0" left="0" width="100%" p={2} bg="white" boxShadow="sm">
          {showEmojiPicker && (
            <Box position="absolute" bottom="50px" right="10px" zIndex="1000">
              <Picker onEmojiClick={handleEmojiClick} />
            </Box>
          )}
          <HStack>
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Enter message"
              flex="1"
            />
            <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              😀
            </Button>
            <Button onClick={handleSendMessage}>Send</Button>
          </HStack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ProfileChatRoom;
