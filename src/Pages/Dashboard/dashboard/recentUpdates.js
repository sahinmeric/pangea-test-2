import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { keyframes } from 'styled-components';
import { styled } from '@mui/material/styles';

const scrollAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% + 16.5rem)); /* Revolving scroll */
  }
`;

const UpdatesContainer = styled(Box)`
  display: flex;
  overflow: hidden;
`;

const ScrollWrapper = styled(Box)`
  display: flex;
  animation: ${scrollAnimation} 30s linear infinite; /* Adjust duration and timing function as needed */
`;

const UpdateCard = styled(Card)`
  flex: 0 0 auto;  // Flex-basis set to auto, keeps original width
  margin: 0 10px;  // Margin for spacing between cards
  width: 300px;  // Width of each card
`;

const RecentUpdates = () => {
  const updates = [
    { title: "Creator Dashboard Enhancements", description: "Introduction of new routes and features for creator dashboards, including invoicing and payment functionalities." },
    { title: "UI Improvements for Signups", description: "Enhanced user interface for signup and login processes tailored for creators, with advanced security features." },
    { title: "Invoicing and Payment Updates", description: "New invoicing functionalities allowing creators to generate and send invoices directly to brands or clients." },
    { title: "Tax Calculation Page", description: "New page for creators to calculate their taxes based on U.S. data and state-specific regulations." },
    { title: "Bug Fixes and Performance Improvements", description: "Several bug fixes including search result duplicates, updating POs, and improving CSV downloads." },
    { title: "Additional Functionalities", description: "New functionalities such as PDF submission for briefs and enhanced creator campaign popups with more detailed content sections." }
  ];

  return (
    <UpdatesContainer>
      <ScrollWrapper>
        {updates.map((update, index) => (
          <UpdateCard key={index} elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {update.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {update.description}
              </Typography>
            </CardContent>
          </UpdateCard>
        ))}
      </ScrollWrapper>
    </UpdatesContainer>
  );
};

export default RecentUpdates;
