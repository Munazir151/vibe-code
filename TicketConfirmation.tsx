import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { VibeTicket } from '../App';

interface TicketConfirmationProps {
  ticket: VibeTicket;
  onClose: () => void;
}

const TicketConfirmation: React.FC<TicketConfirmationProps> = ({ ticket, onClose }) => {
  useEffect(() => {
    // Auto-close after 8 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ConfirmationCard
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <SuccessIcon>🎉</SuccessIcon>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ConfirmationTitle>Vibe Ticket Minted!</ConfirmationTitle>
            <ConfirmationSubtitle>Your NFT has been successfully created on the blockchain</ConfirmationSubtitle>
          </motion.div>
          
          <TicketContainer
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <TicketPreview style={{ backgroundImage: `url(${ticket.image})` }}>
              <TicketOverlay />
              <TicketContent>
                <TicketEventName>{ticket.eventName}</TicketEventName>
                <TicketDetails>
                  <TicketDetail><strong>Date:</strong> {ticket.eventDate}</TicketDetail>
                  <TicketDetail><strong>Vibe:</strong> {ticket.vibeTag}</TicketDetail>
                  <TicketDetail><strong>Minted:</strong> {new Date(ticket.timestamp).toLocaleString()}</TicketDetail>
                  <TicketDetail><strong>Wallet:</strong> {ticket.walletAddress.slice(0, 6)}...{ticket.walletAddress.slice(-4)}</TicketDetail>
                </TicketDetails>
                <TicketBarcode>
                  {Array.from({ length: 30 }).map((_, i) => (
                    <BarcodeBar key={i} height={Math.random() * 80 + 20} />
                  ))}
                </TicketBarcode>
              </TicketContent>
            </TicketPreview>
          </TicketContainer>
          
          <CloseButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Close
          </CloseButton>
        </ConfirmationCard>
      </Overlay>
    </AnimatePresence>
  );
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ConfirmationCard = styled(motion.div)`
  background: rgba(30, 20, 60, 0.9);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
`;

const ConfirmationTitle = styled.h2`
  font-size: 28px;
  margin: 0 0 10px;
  background: linear-gradient(90deg, #ff6bcf 0%, #ffb86c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const ConfirmationSubtitle = styled.p`
  font-size: 16px;
  margin: 0 0 30px;
  opacity: 0.7;
`;

const TicketContainer = styled(motion.div)`
  width: 100%;
  margin-bottom: 30px;
  perspective: 1000px;
`;

const TicketPreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transform-style: preserve-3d;
  transform: rotateX(10deg);
`;

const TicketOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%);
`;

const TicketContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TicketEventName = styled.h3`
  font-size: 24px;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const TicketDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const TicketDetail = styled.div`
  font-size: 12px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const TicketBarcode = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 40px;
  gap: 2px;
`;

const BarcodeBar = styled.div<{ height: number }>`
  width: 2px;
  height: ${props => props.height}%;
  background-color: white;
  opacity: 0.8;
`;

const CloseButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export default TicketConfirmation;