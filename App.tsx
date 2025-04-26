import React, { useState } from 'react';
import styled from 'styled-components';
import './App.css';
import EventList from './components/EventList';
import MyVibeTickets from './components/MyVibeTickets';
import TicketConfirmation from './components/TicketConfirmation';
import PaymentPage from './components/PaymentPage';
import { connectWallet, mintNFT, createNFTMetadata } from './utils/wanderSdk';

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  vibeTag: string;
  image: string;
  category?: string;
  description?: string;
  schedule?: string;
  lineup?: string;
  ticketsRemaining?: number;
  sponsors?: string[];
  prizes?: string;
  requirements?: string;
  skillLevels?: string[];
}

export interface VibeTicket {
  id: number;
  eventName: string;
  eventDate: string;
  vibeTag: string;
  walletAddress: string;
  timestamp: string;
  image: string;
}

function App() {
  const [myTickets, setMyTickets] = useState<VibeTicket[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<VibeTicket | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWalletConnection = async () => {
    try {
      setIsProcessing(true);
      const address = await connectWallet();
      setWalletConnected(true);
      setWalletAddress(address);
      return address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return "";
    } finally {
      setIsProcessing(false);
    }
  };

  const mintVibeTicket = async (event: Event) => {
    let address = walletAddress;
    
    if (!walletConnected) {
      address = await handleWalletConnection();
      if (!address) return;
    }

    try {
      setIsProcessing(true);
      console.log(`Minting ticket for ${event.name}...`);
      
      const timestamp = new Date().toISOString();
      
      const metadata = createNFTMetadata(
        event.name, 
        event.date,
        event.vibeTag,
        address,
        timestamp,
        event.image
      );
      
      const result = await mintNFT(address, metadata);
      
      if (result.success) {
        const newTicket: VibeTicket = {
          id: Date.now(),
          eventName: event.name,
          eventDate: event.date,
          vibeTag: event.vibeTag,
          walletAddress: address,
          timestamp: timestamp,
          image: event.image
        };
        
        setCurrentTicket(newTicket);
        setShowConfirmation(true);
        setMyTickets(prevTickets => [...prevTickets, newTicket]);
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEventSelection = async (event: Event) => {
    setSelectedEvent(event);
    setShowPayment(true);
  };

  const closePayment = () => {
    setShowPayment(false);
    setSelectedEvent(null);
  };

  const handlePaymentComplete = async () => {
    if (!selectedEvent) return;
    
    closePayment();
    await mintVibeTicket(selectedEvent);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setCurrentTicket(null);
  };

  return (
    <AppContainer>
      <GradientBackground />
      <AppHeader>
        <AppTitle>VibeChain</AppTitle>
        <AppSubtitle>Collect Digital Vibes as NFTs</AppSubtitle>
        {walletConnected ? (
          <WalletInfo>Wallet Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</WalletInfo>
        ) : (
          <ConnectButton 
            onClick={handleWalletConnection} 
            disabled={isProcessing}
          >
            {isProcessing ? 'Connecting...' : 'Connect Wallet'}
          </ConnectButton>
        )}
      </AppHeader>
      
      <ContentContainer>
        <EventList onMintTicket={handleEventSelection} isProcessing={isProcessing} />
        {myTickets.length > 0 && <MyVibeTickets tickets={myTickets} />}
      </ContentContainer>
      
      {showPayment && selectedEvent && (
        <PaymentPage 
          event={selectedEvent}
          onClose={closePayment}
          onPaymentComplete={handlePaymentComplete}
          isProcessing={isProcessing}
        />
      )}
      
      {showConfirmation && currentTicket && (
        <TicketConfirmation ticket={currentTicket} onClose={closeConfirmation} />
      )}
    </AppContainer>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  font-family: 'Space Grotesk', 'Rajdhani', sans-serif;
  position: relative;
  overflow-x: hidden;
  color: #fff;
  padding: 0 20px;
`;

const GradientBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a103c 0%, #2a1357 50%, #3b1872 100%);
  z-index: -1;
  pointer-events: none;
`;

const AppHeader = styled.header`
  padding: 30px 0;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const AppTitle = styled.h1`
  font-size: 48px;
  margin: 0;
  background: linear-gradient(90deg, #ff6bcf 0%, #ffb86c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const AppSubtitle = styled.p`
  font-size: 18px;
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.8);
`;

const ConnectButton = styled.button`
  background: linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const WalletInfo = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  margin-top: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ContentContainer = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
`;

export default App;
