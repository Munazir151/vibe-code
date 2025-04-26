import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { VibeTicket } from '../App';

interface MyVibeTicketsProps {
  tickets: VibeTicket[];
}

const MyVibeTickets: React.FC<MyVibeTicketsProps> = ({ tickets }) => {
  return (
    <Container>
      <SectionTitle>My Vibe Tickets</SectionTitle>
      
      <TicketsContainer>
        {tickets.map((ticket, index) => (
          <TicketCard
            key={ticket.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ 
              y: -5,
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' 
            }}
          >
            <TicketImage style={{ backgroundImage: `url(${ticket.image})` }}>
              <TicketOverlay />
              <VibeTag>{ticket.vibeTag}</VibeTag>
            </TicketImage>
            
            <TicketInfo>
              <TicketName>{ticket.eventName}</TicketName>
              <TicketDate>{ticket.eventDate}</TicketDate>
              <TicketMinted>
                <span>Minted:</span> {new Date(ticket.timestamp).toLocaleDateString()}
              </TicketMinted>
            </TicketInfo>
          </TicketCard>
        ))}
      </TicketsContainer>
    </Container>
  );
};

const Container = styled.section`
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 24px;
  background: linear-gradient(90deg, #7928ca 0%, #ff0080 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const TicketsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

const TicketCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

const TicketImage = styled.div`
  height: 140px;
  background-size: cover;
  background-position: center;
  position: relative;
`;

const TicketOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
`;

const VibeTag = styled.span`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: linear-gradient(90deg, #ff6bcf 0%, #ffb86c 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const TicketInfo = styled.div`
  padding: 16px;
`;

const TicketName = styled.h3`
  font-size: 18px;
  margin: 0 0 8px 0;
  font-weight: 600;
`;

const TicketDate = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  
  &:before {
    content: "📅";
    margin-right: 6px;
    font-size: 12px;
  }
`;

const TicketMinted = styled.div`
  font-size: 12px;
  opacity: 0.6;
  
  span {
    font-weight: 600;
  }
`;

export default MyVibeTickets;