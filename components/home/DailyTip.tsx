import React, { useState, useRef, useEffect } from 'react';
import { MOCK_CONTENT } from '../../services/mockData';
import type { ContentArticle } from '../../types';

const ArticleCard: React.FC<{ article: ContentArticle }> = ({ article }) => (
  <div className="relative flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden shadow-lg mx-3 cursor-pointer group/card">
    <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
    <h4 className="absolute bottom-3 left-3 right-3 text-white text-sm font-bold leading-tight">
      {article.title}
    </h4>
  </div>
);

const DailyTip: React.FC = () => {
  const [randomArticles] = useState<ContentArticle[]>(() => 
    [...MOCK_CONTENT, ...MOCK_CONTENT].sort(() => 0.5 - Math.random()).slice(0, 8)
  );
  
  const duplicatedArticles = [...randomArticles, ...randomArticles];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const resumeTimeoutRef = useRef<number>();

  const startScrolling = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      const { scrollLeft, scrollWidth } = scrollContainer;
      const contentWidth = scrollWidth / 2;

      if (scrollLeft >= contentWidth) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 0.5;
      }
      animationFrameRef.current = requestAnimationFrame(scroll);
    };
    
    stopScrolling(); // Ensure no multiple loops
    animationFrameRef.current = requestAnimationFrame(scroll);
  };

  const stopScrolling = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleInteractionStart = () => {
    clearTimeout(resumeTimeoutRef.current);
    stopScrolling();
  };

  const handleInteractionEnd = () => {
    resumeTimeoutRef.current = window.setTimeout(() => {
        startScrolling();
    }, 5000); // Resume after 5 seconds of inactivity
  };


  useEffect(() => {
    startScrolling();
    return () => {
        stopScrolling();
        clearTimeout(resumeTimeoutRef.current);
    };
  }, [randomArticles]);

  return (
    <div>
      <h3 className="text-lg font-semibold text-text-primary mb-3">Conseils & Articles</h3>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-light to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-light to-transparent z-10 pointer-events-none" />
        
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scroll-smooth scrollbar-hide"
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          onWheel={handleInteractionStart}
        >
          <div className="flex py-1">
            {duplicatedArticles.map((article, index) => (
              <ArticleCard key={`${article.id}-${index}`} article={article} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTip;