import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface ImageLoaderProps {
  src: string;
  alt?: string;
  className?: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({ src, alt = '', className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  return (
    <Container className={className}>
      {!isLoaded && !error && <LoadingPlaceholder />}
      {error && <ErrorPlaceholder />}
      <StyledImage 
        src={src} 
        alt={alt} 
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
      />
    </Container>
  );
};

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.3s ease;
`;

const LoadingPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s infinite linear;
`;

const ErrorPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 0, 100, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:after {
    content: "🖼️";
    font-size: 32px;
  }
`;

export default ImageLoader;