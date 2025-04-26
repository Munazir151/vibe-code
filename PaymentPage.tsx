import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '../App';
import ImageLoader from './ImageLoader';

// AO Connect types and integration
interface AOConnectWallet {
  address: string;
  balance: string;
  network: string;
}

interface AOConnectResponse {
  status: 'connected' | 'disconnected' | 'error';
  wallet?: AOConnectWallet;
  error?: string;
}

interface PaymentPageProps {
  event: Event;
  onClose: () => void;
  onPaymentComplete: () => void;
  isProcessing: boolean;
}

// AO Connect process ID
const AO_PROCESS_ID = 'U0GCr8mz6c2hkkh90rx-0cE8mh_BrOcKI4x_KzZbcqc';

const PaymentPage: React.FC<PaymentPageProps> = ({ 
  event, 
  onClose, 
  onPaymentComplete,
  isProcessing 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('crypto');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [nameOnCard, setNameOnCard] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [aoWallet, setAOWallet] = useState<AOConnectWallet | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState<boolean>(false);
  
  const ticketPrice = (event.id % 3 === 0) ? 0.05 : (event.id % 2 === 0) ? 0.08 : 0.15;
  const ticketPriceUSD = ticketPrice * 3400; // Mock ETH to USD conversion

  // Check for AO Connect on component mount
  useEffect(() => {
    const checkAOConnect = () => {
      return typeof window !== 'undefined' && 'aoconnect' in window;
    };
    
    if (checkAOConnect()) {
      console.log('AO Connect detected');
    } else {
      console.log('AO Connect not detected');
    }
  }, []);
  
  const connectAOWallet = async () => {
    if (typeof window === 'undefined' || !('aoconnect' in window)) {
      setErrors({
        wallet: 'AO Connect not detected. Please install the AO Connect extension.'
      });
      return null;
    }
    
    setIsConnectingWallet(true);
    
    try {
      // @ts-ignore - aoconnect is injected by the browser extension
      const response: AOConnectResponse = await window.aoconnect.connect();
      
      if (response.status === 'connected' && response.wallet) {
        setAOWallet(response.wallet);
        return response.wallet;
      } else {
        setErrors({
          wallet: response.error || 'Failed to connect wallet'
        });
        return null;
      }
    } catch (error) {
      console.error('Error connecting AO wallet:', error);
      setErrors({
        wallet: 'Error connecting to AO Connect'
      });
      return null;
    } finally {
      setIsConnectingWallet(false);
    }
  };
  
  const handleSubmit = async () => {
    setErrors({});
    
    // Validate form based on selected method
    if (selectedMethod === 'card') {
      const newErrors: {[key: string]: string} = {};
      
      if (!cardNumber || cardNumber.length < 16) {
        newErrors.cardNumber = 'Valid card number is required';
      }
      
      if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
        newErrors.expiryDate = 'Valid expiry date (MM/YY) is required';
      }
      
      if (!cvv || cvv.length < 3) {
        newErrors.cvv = 'Valid CVV is required';
      }
      
      if (!nameOnCard) {
        newErrors.nameOnCard = 'Name on card is required';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    } else if (selectedMethod === 'crypto') {
      // For crypto payments, ensure wallet is connected
      if (!aoWallet) {
        const connectedWallet = await connectAOWallet();
        if (!connectedWallet) {
          return; // Exit if wallet connection failed
        }
      }
    }
    
    // Process payment
    setIsSubmitting(true);
    
    try {
      if (selectedMethod === 'crypto') {
        // Process crypto payment with AO Connect
        if (aoWallet) {
          // @ts-ignore - aoconnect is injected by the browser extension
          const txResponse = await window.aoconnect.sendTransaction({
            to: '0xVibeChainWalletAddress', // Replace with actual wallet address
            value: `${ticketPrice}`, // ETH amount
            data: `Purchase ticket for ${event.name}` // Transaction message
          });
          
          if (txResponse.status === 'success') {
            console.log('Transaction successful:', txResponse.txHash);
          } else {
            throw new Error(txResponse.error || 'Transaction failed');
          }
        }
      }
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      onPaymentComplete();
    } catch (error) {
      console.error('Payment failed:', error);
      setErrors({
        payment: 'Payment failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <PaymentContainer
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <PaymentHeader>
            <PaymentTitle>Complete Your Purchase</PaymentTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </PaymentHeader>
          
          <EventSummary>
            <EventImageContainer>
              <ImageLoader src={event.image} alt={event.name} />
              <VibeTag>{event.vibeTag}</VibeTag>
            </EventImageContainer>
            <EventDetails>
              <EventName>{event.name}</EventName>
              <EventInfo>{event.date} • {event.location}</EventInfo>
              <PriceTag>
                <EthLogo>Ξ</EthLogo>
                <PriceValue>{ticketPrice} ETH</PriceValue>
                <UsdPrice>(~${ticketPriceUSD.toFixed(2)} USD)</UsdPrice>
              </PriceTag>
            </EventDetails>
          </EventSummary>
          
          <PaymentOptions>
            <PaymentMethodTitle>Select Payment Method</PaymentMethodTitle>
            <MethodsContainer>
              <PaymentMethod 
                className={selectedMethod === 'crypto' ? 'active' : ''}
                onClick={() => setSelectedMethod('crypto')}
              >
                <MethodIcon>💎</MethodIcon>
                <MethodName>Crypto</MethodName>
                <MethodDesc>Pay with ETH</MethodDesc>
              </PaymentMethod>
              
              <PaymentMethod 
                className={selectedMethod === 'card' ? 'active' : ''}
                onClick={() => setSelectedMethod('card')}
              >
                <MethodIcon>💳</MethodIcon>
                <MethodName>Card</MethodName>
                <MethodDesc>Credit/Debit</MethodDesc>
              </PaymentMethod>
            </MethodsContainer>
          </PaymentOptions>
          
          <AnimatePresence mode="wait">
            {selectedMethod === 'crypto' ? (
              <PaymentForm
                key="crypto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {aoWallet ? (
                  <ConnectedWallet>
                    <WalletHeader>
                      <WalletIcon>👛</WalletIcon>
                      <WalletDetails>
                        <WalletAddress>
                          {`${aoWallet.address.substring(0, 8)}...${aoWallet.address.substring(aoWallet.address.length - 6)}`}
                        </WalletAddress>
                        <WalletBalance>
                          Balance: {Number(aoWallet.balance).toFixed(4)} ETH
                        </WalletBalance>
                        <WalletNetwork>{aoWallet.network}</WalletNetwork>
                      </WalletDetails>
                    </WalletHeader>
                    <TransactionPreview>
                      <TransactionDetail>
                        <DetailLabel>Amount:</DetailLabel>
                        <DetailValue>{ticketPrice} ETH</DetailValue>
                      </TransactionDetail>
                      <TransactionDetail>
                        <DetailLabel>Gas Fee (est.):</DetailLabel>
                        <DetailValue>~0.002 ETH</DetailValue>
                      </TransactionDetail>
                      <TransactionDetail>
                        <DetailLabel>Total:</DetailLabel>
                        <DetailValue>{(ticketPrice + 0.002).toFixed(3)} ETH</DetailValue>
                      </TransactionDetail>
                    </TransactionPreview>
                  </ConnectedWallet>
                ) : (
                  <>
                    <CryptoInfo>
                      <InfoIcon>ℹ️</InfoIcon>
                      <InfoText>
                        Connect your AO wallet to complete this purchase with cryptocurrency. Transaction fees will apply.
                      </InfoText>
                    </CryptoInfo>
                    <ConnectWalletButton 
                      onClick={connectAOWallet}
                      disabled={isConnectingWallet}
                      whileHover={{ scale: isConnectingWallet ? 1 : 1.03 }}
                      whileTap={{ scale: isConnectingWallet ? 1 : 0.98 }}
                    >
                      {isConnectingWallet ? (
                        <ButtonContent>
                          <Spinner />
                          Connecting...
                        </ButtonContent>
                      ) : (
                        <ButtonContent>
                          Connect AO Wallet
                        </ButtonContent>
                      )}
                    </ConnectWalletButton>
                    {errors.wallet && <ErrorMessage>{errors.wallet}</ErrorMessage>}
                  </>
                )}
                <BenefitsList>
                  <Benefit>✓ Immediately receive your NFT ticket</Benefit>
                  <Benefit>✓ Verifiable ownership on the blockchain</Benefit>
                  <Benefit>✓ Resellable on secondary markets</Benefit>
                </BenefitsList>
              </PaymentForm>
            ) : (
              <PaymentForm
                key="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FormRow>
                  <FormField isFullWidth hasError={!!errors.cardNumber}>
                    <Input 
                      type="text" 
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                    {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
                  </FormField>
                </FormRow>
                
                <FormRow>
                  <FormField hasError={!!errors.nameOnCard}>
                    <Label>Name on Card</Label>
                    <Input 
                      type="text" 
                      placeholder="John Doe"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                    />
                    {errors.nameOnCard && <ErrorMessage>{errors.nameOnCard}</ErrorMessage>}
                  </FormField>
                </FormRow>
                
                <FormRow>
                  <FormField hasError={!!errors.expiryDate}>
                    <Label>Expiry Date</Label>
                    <Input 
                      type="text" 
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      maxLength={5}
                    />
                    {errors.expiryDate && <ErrorMessage>{errors.expiryDate}</ErrorMessage>}
                  </FormField>
                  
                  <FormField hasError={!!errors.cvv}>
                    <Label>CVV</Label>
                    <Input 
                      type="text" 
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                    />
                    {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}
                  </FormField>
                </FormRow>
                <CardInfoNote>
                  Your card will be charged ${ticketPriceUSD.toFixed(2)} USD.
                  The NFT ticket will be minted to your connected wallet.
                </CardInfoNote>
              </PaymentForm>
            )}
          </AnimatePresence>
          
          <ButtonContainer>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <PayButton 
              onClick={handleSubmit}
              disabled={isSubmitting || isProcessing || (selectedMethod === 'crypto' && !aoWallet)}
              whileHover={{ scale: (isSubmitting || isProcessing || (selectedMethod === 'crypto' && !aoWallet)) ? 1 : 1.05 }}
              whileTap={{ scale: (isSubmitting || isProcessing || (selectedMethod === 'crypto' && !aoWallet)) ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <ButtonContent>
                  <Spinner />
                  Processing...
                </ButtonContent>
              ) : (
                <ButtonContent>
                  {selectedMethod === 'crypto' 
                    ? aoWallet 
                      ? `Pay Ξ${ticketPrice} ETH` 
                      : 'Connect Wallet to Pay'
                    : `Pay $${ticketPriceUSD.toFixed(2)}`}
                </ButtonContent>
              )}
            </PayButton>
          </ButtonContainer>
          
          {errors.payment && (
            <ErrorContainer>
              <ErrorMessage>{errors.payment}</ErrorMessage>
            </ErrorContainer>
          )}
          
          <SecurityNote>
            <SecurityIcon>🔒</SecurityIcon>
            <SecurityText>Secure payment processing. Your data is encrypted.</SecurityText>
          </SecurityNote>
        </PaymentContainer>
      </Overlay>
    </AnimatePresence>
  );
};

// Styled components for the payment page
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const PaymentContainer = styled(motion.div)`
  background: rgba(30, 20, 60, 0.95);
  border-radius: 24px;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const PaymentHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PaymentTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  background: linear-gradient(90deg, #ffffff 0%, #d1d1d1 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 28px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: color 0.2s;
  
  &:hover {
    color: white;
  }
`;

const EventSummary = styled.div`
  display: flex;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const EventImageContainer = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
`;

const VibeTag = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(90deg, #ff6bcf 0%, #ffb86c 100%);
  color: white;
  padding: 3px 8px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
`;

const EventDetails = styled.div`
  margin-left: 16px;
  flex: 1;
`;

const EventName = styled.h3`
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 600;
`;

const EventInfo = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12px;
`;

const PriceTag = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const EthLogo = styled.span`
  font-size: 18px;
  font-weight: bold;
  margin-right: 4px;
`;

const PriceValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const UsdPrice = styled.span`
  margin-left: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`;

const PaymentOptions = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PaymentMethodTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

const MethodsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentMethod = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #a78bfa;
    background: rgba(167, 139, 250, 0.1);
  }
`;

const MethodIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`;

const MethodName = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const MethodDesc = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
`;

const PaymentForm = styled(motion.div)`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CryptoInfo = styled.div`
  display: flex;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.05);
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const InfoIcon = styled.span`
  font-size: 18px;
  margin-right: 12px;
  line-height: 1.5;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`;

const BenefitsList = styled.div`
  padding: 0 12px;
`;

const Benefit = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const FormField = styled.div<{ isFullWidth?: boolean; hasError?: boolean }>`
  flex: ${props => props.isFullWidth ? 1 : '0 0 calc(50% - 6px)'};
  
  @media (max-width: 480px) {
    flex: 1;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
  color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 12px;
  color: white;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #a78bfa;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const ErrorMessage = styled.div`
  color: #f87171;
  font-size: 12px;
  margin-top: 4px;
`;

const CardInfoNote = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 8px 0 0 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const PayButton = styled(motion.button)`
  background: linear-gradient(90deg, #7928ca 0%, #ff0080 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 0, 128, 0.3);
  transition: opacity 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  margin-right: 8px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
`;

const SecurityIcon = styled.span`
  margin-right: 8px;
  font-size: 16px;
`;

const SecurityText = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
`;

const ConnectedWallet = styled.div`
  background: rgba(30, 20, 80, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid rgba(167, 139, 250, 0.3);
`;

const WalletHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const WalletIcon = styled.div`
  font-size: 24px;
  margin-right: 12px;
`;

const WalletDetails = styled.div`
  flex: 1;
`;

const WalletAddress = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #a78bfa;
  margin-bottom: 4px;
`;

const WalletBalance = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2px;
`;

const WalletNetwork = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
`;

const TransactionPreview = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 12px;
`;

const TransactionDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-weight: 600;
  }
`;

const DetailLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
`;

const DetailValue = styled.span`
  color: white;
`;

const ConnectWalletButton = styled(motion.button)`
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorContainer = styled.div`
  padding: 0 24px;
  margin-top: -10px;
  margin-bottom: 10px;
  text-align: center;
`;

export default PaymentPage;