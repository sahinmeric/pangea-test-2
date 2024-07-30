import React, { useState } from 'react';
import { Avatar, Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useMutation } from 'react-query';
import client from '../../../../../API'; // Ensure the client has an appropriate method for GET requests

const SMSChannels = () => {
  const [messages, setMessages] = useState([]);
  const [selectedSender, setSelectedSender] = useState(null);

  const { mutate: fetchMessages } = useMutation(client.twilio.fetch, {
    onSuccess: (data) => {
      setMessages(data);
    },
    onError: (error) => {
      console.error('Failed to fetch messages:', error);
    },
  });

  React.useEffect(() => {
    fetchMessages();
  }, []);

  const groupedMessages = messages.reduce((acc, message) => {
    if (!acc[message.from_number]) {
      acc[message.from_number] = [];
    }
    acc[message.from_number].push(message);
    return acc;
  }, {});

  const handleCardClick = (fromNumber) => {
    setSelectedSender(fromNumber);
  };

  return (
    <Box>
      {selectedSender ? (
        <Box>
          <Typography variant="h6">Messages from {selectedSender}</Typography>
          {groupedMessages[selectedSender].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((message) => (
            <Card key={message.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body2">{message.timestamp}</Typography>
                <Typography variant="body1">{message.message_body}</Typography>
              </CardContent>
            </Card>
          ))}
          <Typography variant="body2" onClick={() => setSelectedSender(null)} style={{ cursor: 'pointer', color: 'blue' }}>
            Back to All Messages
          </Typography>
        </Box>
      ) : (
        Object.keys(groupedMessages).map((fromNumber) => {
          const firstMessage = groupedMessages[fromNumber][0];
          return (
            <Card key={fromNumber} sx={{ mb: 2 }} onClick={() => handleCardClick(fromNumber)} style={{ cursor: 'pointer' }}>
              <CardHeader
                avatar={
                  firstMessage.pfphref ? (
                    <Avatar src={firstMessage.pfphref} />
                  ) : (
                    <Avatar>{firstMessage.creator_name ? firstMessage.creator_name[0] : 'U'}</Avatar>
                  )
                }
                title={firstMessage.creator_name || 'Unknown Sender'}
                subheader={fromNumber}
              />
              <CardContent>
                <Typography variant="body2">Last message: {firstMessage.message_body}</Typography>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default SMSChannels;
