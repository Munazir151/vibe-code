import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '../App'; // Import the Event interface from App.tsx
import ImageLoader from './ImageLoader';

interface EventListProps {
  onMintTicket: (event: Event) => void;
  isProcessing?: boolean;
}

const EventList: React.FC<EventListProps> = ({ onMintTicket, isProcessing = false }) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  
  // Gallery images for events that have them
  const eventGalleries: { [key: number]: string[] } = {
    3: [
      "https://source.unsplash.com/random/800x600/?beach,sunset",
      "https://source.unsplash.com/random/800x600/?beach,party",
      "https://source.unsplash.com/random/800x600/?beach,dj",
      "https://source.unsplash.com/random/800x600/?beach,music",
    ],
    4: [
      "https://source.unsplash.com/random/800x600/?hackathon,code",
      "https://source.unsplash.com/random/800x600/?coding,team",
      "https://source.unsplash.com/random/800x600/?developer,computer",
      "https://source.unsplash.com/random/800x600/?technology,conference",
    ],
    7: [
      "https://source.unsplash.com/random/800x600/?quantum,technology",
      "https://source.unsplash.com/random/800x600/?computer,circuit",
      "https://source.unsplash.com/random/800x600/?quantum,laboratory",
      "https://source.unsplash.com/random/800x600/?technology,server",
    ],
    8: [
      "https://source.unsplash.com/random/800x600/?ibiza,sunset",
      "https://source.unsplash.com/random/800x600/?ibiza,party",
      "https://source.unsplash.com/random/800x600/?dj,club",
      "https://source.unsplash.com/random/800x600/?beach,club",
    ],
  };
  
  const closeImageViewer = () => setSelectedImageIndex(-1);
  
  // Sample upcoming events
  const events: Event[] = [
    {
      id: 1,
      name: "Neo Tokyo Nights",
      date: "May 15, 2025",
      location: "Neon District, Tokyo",
      vibeTag: "Hype",
      image: "https://source.unsplash.com/random/800x600/?cyberpunk",
      category: "festival"
    },
    {
      id: 2,
      name: "Digital Dreams Festival",
      date: "June 2, 2025",
      location: "Virtual Reality Plaza",
      vibeTag: "Creative",
      image: "https://source.unsplash.com/random/800x600/?digital,art",
      category: "festival"
    },
    {
      id: 3,
      name: "Ocean Sunset Sessions",
      date: "July 10, 2025",
      location: "Malibu Beach Club",
      vibeTag: "Chill",
      image: "https://source.unsplash.com/random/800x600/?beach,sunset",
      category: "session",
      description: "Experience the ultimate beachside music journey as world-class DJs spin relaxing beats while the sun sets over the Pacific. This 6-hour session includes exclusive beach access, signature cocktails, and a special sunset ceremony ritual. Featuring artists Coastal Dreamers, Luna Wave, and headliner Maya Sol.",
      schedule: "4:00 PM - Doors Open\n5:30 PM - Opening Set\n7:15 PM - Sunset Ritual\n7:30 PM - Headliner Set\n10:00 PM - Afterglow Session",
      ticketsRemaining: 75
    },
    {
      id: 4,
      name: "Blockchain Build-a-thon",
      date: "May 28-30, 2025",
      location: "Tech Hub, San Francisco",
      vibeTag: "Innovative",
      image: "https://source.unsplash.com/random/800x600/?hackathon,code",
      category: "hackathon",
      description: "Join the Web3 revolution at this intensive 48-hour blockchain hackathon where developers, designers, and entrepreneurs will collaborate to build groundbreaking decentralized applications. With expert mentors from top blockchain companies, state-of-the-art development toolkits, and exclusive API access to major protocols. Compete for $50,000 in total prizes across 5 categories: DeFi Innovation, NFT Marketplace Solutions, DAO Governance Tools, Decentralized Identity Systems, and Public Good Applications. All skill levels welcome - form teams or join solo and find your perfect match onsite.",
      schedule: "Day 1: Registration & Team Formation, Opening Ceremony, Workshop Sessions\nDay 2: Full Hacking Day, Mentor Sessions, Midnight Pitch Practice\nDay 3: Final Submissions, Demos, Judging & Awards",
      sponsors: ["EtherBlock Ventures", "ChainLink", "Crypto Valley Association"],
      skillLevels: ["Beginner", "Intermediate", "Advanced"]
    },
    {
      id: 5,
      name: "AI Music Production Workshop",
      date: "June 15, 2025",
      location: "Soundwave Studio, Berlin",
      vibeTag: "Educational",
      image: "https://source.unsplash.com/random/800x600/?music,studio",
      category: "workshop"
    },
    {
      id: 6,
      name: "Mindful Coding Retreat",
      date: "July 5, 2025",
      location: "Mountain View Lodge, Colorado",
      vibeTag: "Zen",
      image: "https://source.unsplash.com/random/800x600/?mountains,retreat",
      category: "workshop"
    },
    {
      id: 7,
      name: "Quantum Computing Hackathon",
      date: "August 12-14, 2025",
      location: "Innovation Campus, Singapore",
      vibeTag: "Futuristic",
      image: "https://source.unsplash.com/random/800x600/?quantum,technology",
      category: "hackathon",
      description: "The frontier of computing awaits at this exclusive quantum computing hackathon. Work with cutting-edge quantum processors and simulators to solve problems impossible for classical computers. This event brings together quantum physicists, computer scientists, and curious minds to explore quantum algorithms, error correction, and practical applications in cryptography, chemistry, and optimization.",
      schedule: "Day 1: Quantum Fundamentals Bootcamp, Algorithm Design Workshop\nDay 2: Quantum Circuit Implementation, Hardware Access Sessions\nDay 3: Project Presentations, Expert Panel Discussions, Awards",
      prizes: "Grand Prize: $25,000 + Quantum Computer Cloud Credits\n2nd Place: $10,000\n3rd Place: $5,000\nInnovation Awards: 5 x $2,000",
      requirements: "Basic knowledge of linear algebra and Python programming recommended"
    },
    {
      id: 8,
      name: "Deep House Sunset Sessions",
      date: "May 22, 2025",
      location: "Ibiza Beach Club",
      vibeTag: "Groovy",
      image: "https://source.unsplash.com/random/800x600/?ibiza,sunset",
      category: "session",
      description: "The legendary Deep House Sunset Sessions returns to Ibiza for its 15th year, bringing together the world's most innovative house DJs for an unforgettable evening. Experience 8 hours of cutting-edge deep house, tech house, and melodic techno while overlooking the Mediterranean. VIP packages include private cabanas, premium bottle service, and artist meet-and-greets.",
      lineup: "6:00 PM - Local Talent Showcase\n8:00 PM - Aria Martinez\n9:30 PM - The Groove Collective\n11:00 PM - Headliner: Sebastian Mendez\n1:00 AM - Sunrise Set: Luna Waves",
      ticketsRemaining: 120
    }
  ];
  
  const categories = [
    { id: "all", name: "All Events" },
    { id: "festival", name: "Festivals" },
    { id: "session", name: "Sessions" },
    { id: "hackathon", name: "Hackathons" },
    { id: "workshop", name: "Workshops" }
  ];
  
  const filteredEvents = activeCategory === "all" 
    ? events 
    : events.filter(event => event.category === activeCategory);

  return (
    <Container>
      <HeaderSection>
        <SectionTitle>Upcoming Events</SectionTitle>
        <CategoryFilters>
          {categories.map(category => (
            <CategoryButton
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={activeCategory === category.id ? 'active' : ''}
            >
              {category.name}
            </CategoryButton>
          ))}
        </CategoryFilters>
      </HeaderSection>
      
      <EventGrid>
        {filteredEvents.map(event => (
          <EventCard
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <EventImage>
              <ImageLoader src={event.image} alt={event.name} />
              <VibeTag>{event.vibeTag}</VibeTag>
            </EventImage>
            <EventInfo>
              <EventName>{event.name}</EventName>
              <EventDetails>
                <EventDate>{event.date}</EventDate>
                <EventLocation>{event.location}</EventLocation>
              </EventDetails>

              {(event.category === 'session' || event.category === 'hackathon') && (
                <>
                  <DetailsToggle
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  >
                    {expandedEvent === event.id ? 'Hide Details' : 'Show Details'} 
                    <ToggleIcon expanded={expandedEvent === event.id}>›</ToggleIcon>
                  </DetailsToggle>
                  
                  {expandedEvent === event.id && (
                    <ExpandedDetails 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <DetailSection>
                        <DetailHeading>About</DetailHeading>
                        <DetailText>{event.description}</DetailText>
                      </DetailSection>
                      
                      {event.category === 'session' && (
                        <>
                          <DetailSection>
                            <DetailHeading>{event.lineup ? 'Lineup' : 'Schedule'}</DetailHeading>
                            <DetailSchedule>
                              {event.lineup ? event.lineup.split('\n').map((item, i) => (
                                <ScheduleItem key={i}>{item}</ScheduleItem>
                              )) : (event.schedule ?? '').split('\n').map((item, i) => (
                                <ScheduleItem key={i}>{item}</ScheduleItem>
                              ))}
                            </DetailSchedule>
                          </DetailSection>
                          
                          {eventGalleries[event.id] && (
                            <DetailSection>
                              <DetailHeading>Event Gallery</DetailHeading>
                              <ImageGallery>
                                {eventGalleries[event.id].map((imgSrc, index) => (
                                  <GalleryThumbnail 
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    whileHover={{ y: -3, boxShadow: '0 6px 15px rgba(0,0,0,0.3)' }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <ImageLoader src={imgSrc} alt={`${event.name} thumbnail ${index}`} />
                                  </GalleryThumbnail>
                                ))}
                              </ImageGallery>
                            </DetailSection>
                          )}
                          
                          {event.ticketsRemaining && (
                            <TicketsRemaining>
                              Only {event.ticketsRemaining} tickets remaining!
                            </TicketsRemaining>
                          )}
                        </>
                      )}
                      
                      {event.category === 'hackathon' && (
                        <>
                          <DetailSection>
                            <DetailHeading>Schedule</DetailHeading>
                            <DetailSchedule>
                              {(event.schedule ?? '').split('\n').map((item, i) => (
                                <ScheduleItem key={i}>{item}</ScheduleItem>
                              ))}
                            </DetailSchedule>
                          </DetailSection>
                          
                          {eventGalleries[event.id] && (
                            <DetailSection>
                              <DetailHeading>Previous Edition</DetailHeading>
                              <ImageGallery>
                                {eventGalleries[event.id].map((imgSrc, index) => (
                                  <GalleryThumbnail 
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    whileHover={{ y: -3, boxShadow: '0 6px 15px rgba(0,0,0,0.3)' }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <ImageLoader src={imgSrc} alt={`${event.name} thumbnail ${index}`} />
                                  </GalleryThumbnail>
                                ))}
                              </ImageGallery>
                            </DetailSection>
                          )}
                          
                          {event.sponsors && (
                            <DetailSection>
                              <DetailHeading>Sponsors</DetailHeading>
                              <SponsorsContainer>
                                {event.sponsors.map((sponsor, i) => (
                                  <Sponsor key={i}>{sponsor}</Sponsor>
                                ))}
                              </SponsorsContainer>
                            </DetailSection>
                          )}
                          
                          {event.prizes && (
                            <DetailSection>
                              <DetailHeading>Prizes</DetailHeading>
                              <DetailSchedule>
                                {event.prizes.split('\n').map((item, i) => (
                                  <ScheduleItem key={i}>{item}</ScheduleItem>
                                ))}
                              </DetailSchedule>
                            </DetailSection>
                          )}
                          
                          {event.requirements && (
                            <DetailSection>
                              <DetailHeading>Requirements</DetailHeading>
                              <DetailText>{event.requirements}</DetailText>
                            </DetailSection>
                          )}
                        </>
                      )}
                    </ExpandedDetails>
                  )}
                </>
              )}

              <MintButton 
                whileHover={{ scale: isProcessing ? 1 : 1.05 }} 
                whileTap={{ scale: isProcessing ? 1 : 0.95 }}
                onClick={() => !isProcessing && onMintTicket(event)}
                disabled={isProcessing}
                className={isProcessing ? 'processing' : ''}
              >
                {isProcessing ? 'Processing...' : 'Get Vibe Ticket'}
              </MintButton>
            </EventInfo>
          </EventCard>
        ))}
      </EventGrid>
      
      {filteredEvents.length === 0 && (
        <NoEventsMessage>
          No events found in this category. Check back soon!
        </NoEventsMessage>
      )}
      
      {/* Full-screen image viewer */}
      <AnimatePresence>
        {selectedImageIndex >= 0 && expandedEvent && eventGalleries[expandedEvent] && (
          <ImageViewerOverlay 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImageViewer}
          >
            <ImageViewerContainer
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={closeImageViewer}>×</CloseButton>
              
              <ImageViewerContent>
                <ImageNavButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (expandedEvent && eventGalleries[expandedEvent]) {
                      setSelectedImageIndex(prev => 
                        (prev - 1 + eventGalleries[expandedEvent].length) % eventGalleries[expandedEvent].length
                      );
                    }
                  }}
                >❮</ImageNavButton>
                
                <ImageViewerFrame>
                  {expandedEvent && eventGalleries[expandedEvent] && (
                    <ImageLoader 
                      src={eventGalleries[expandedEvent][selectedImageIndex]} 
                      alt={`Event image ${selectedImageIndex + 1}`}
                    />
                  )}
                </ImageViewerFrame>
                
                <ImageNavButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (expandedEvent && eventGalleries[expandedEvent]) {
                      setSelectedImageIndex(prev => 
                        (prev + 1) % eventGalleries[expandedEvent].length
                      );
                    }
                  }}
                >❯</ImageNavButton>
              </ImageViewerContent>
              
              <ImageCounter>
                {selectedImageIndex + 1} / {expandedEvent && eventGalleries[expandedEvent] ? eventGalleries[expandedEvent].length : 0}
              </ImageCounter>
            </ImageViewerContainer>
          </ImageViewerOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

const Container = styled.section`
  margin-bottom: 50px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &.active {
    background: linear-gradient(90deg, #7928ca 0%, #ff0080 100%);
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(255, 0, 128, 0.3);
  }
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  background: linear-gradient(90deg, #ffffff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  margin: 0;
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
`;

const EventCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  }
`;

const EventImage = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 50%);
    z-index: 1;
    pointer-events: none;
  }
`;

const VibeTag = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(90deg, #ff6bcf 0%, #ffb86c 100%);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 2;
`;

const EventInfo = styled.div`
  padding: 20px;
`;

const EventName = styled.h3`
  font-size: 22px;
  margin: 0 0 12px 0;
  font-weight: 600;
`;

const EventDetails = styled.div`
  margin-bottom: 20px;
  opacity: 0.8;
  font-size: 14px;
`;

const EventDate = styled.div`
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  
  &:before {
    content: "📅";
    margin-right: 8px;
  }
`;

const EventLocation = styled.div`
  display: flex;
  align-items: center;
  
  &:before {
    content: "📍";
    margin-right: 8px;
  }
`;

const MintButton = styled(motion.button)`
  background: linear-gradient(90deg, #7928ca 0%, #ff0080 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(255, 0, 128, 0.3);
  
  &.processing {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const NoEventsMessage = styled.div`
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
`;

const DetailsToggle = styled.button`
  background: none;
  border: none;
  color: #a78bfa;
  font-size: 14px;
  padding: 0;
  margin-bottom: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 600;
  
  &:hover {
    color: #c4b5fd;
  }
`;

const ToggleIcon = styled.span<{ expanded: boolean }>`
  display: inline-block;
  margin-left: 8px;
  transform: rotate(${props => props.expanded ? '90deg' : '0'});
  transition: transform 0.3s ease;
  font-size: 16px;
`;

const ExpandedDetails = styled(motion.div)`
  margin-bottom: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
  overflow: hidden;
`;

const DetailSection = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailHeading = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #f0abfc;
`;

const DetailText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
`;

const DetailSchedule = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ScheduleItem = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const SponsorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Sponsor = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
`;

const TicketsRemaining = styled.div`
  color: #fcd34d;
  font-weight: 600;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  
  &:before {
    content: "🎟️";
    margin-right: 8px;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const GalleryThumbnail = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ImageViewerOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;

const ImageViewerContainer = styled(motion.div)`
  max-width: 90%;
  max-height: 90%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const ImageViewerContent = styled.div`
  display: flex;
  align-items: center;
`;

const ImageViewerFrame = styled.div`
  width: 80vw;
  max-width: 1000px;
  height: 60vh;
  position: relative;
  
  img {
    object-fit: contain;
  }
`;

const ImageNavButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  padding: 16px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  margin: 0 10px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  transition: background-color 0.2s, transform 0.1s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
`;

export default EventList;