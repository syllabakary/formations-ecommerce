// components/LazyImage.js
import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const LazyImage = ({ src, alt, className, placeholder, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  const defaultPlaceholder = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500';

  return (
    <div ref={elementRef} className={className}>
      {hasIntersected && (
        <>
          {!loaded && !error && (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400">Chargement...</div>
            </div>
          )}
          <img
            src={error ? (placeholder || defaultPlaceholder) : src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            {...props}
          />
        </>
      )}
    </div>
  );
};

export { LazyImage };