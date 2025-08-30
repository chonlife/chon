import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext.tsx';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import './Results.css';
import { tagLabels as sharedTagLabels, findBestMatch as sharedFindBestMatch, mapTagStatsToScores, TagTranslations } from '../../../utils/archetypes.ts';
import { cardsData as sharedCardsData } from '../../../features/personality-test/data/characters.ts';
import { MemoizedHexagonChart } from './HexagonChart.tsx';
import { CardData } from '../../../features/personality-test/types/character';

interface ResultsProps {
  onCreateAccount?: () => void;
  onRestart?: () => void;
}

const Results: React.FC<ResultsProps> = ({ onCreateAccount, onRestart }) => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [tagScores, setTagScores] = useState<Record<string, number>>({});
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cards, setCards] = useState<CardData[]>(sharedCardsData);
  const [matchedCard, setMatchedCard] = useState<CardData | null>(null);
  const [bestMatchCard, setBestMatchCard] = useState<CardData | null>(null); // Add new state
  const [animationKey, setAnimationKey] = useState(0);

  // Carousel state for narrow screens
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Screen size detection for narrow screen carousel
  useEffect(() => {
    const checkScreenSize = () => {
      setIsNarrowScreen(window.innerWidth <= 480);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 移除图片预加载以加快初始渲染

  // Carousel navigation functions
  const getVisibleCards = () => {
    if (!isNarrowScreen) return cards;
    
    const visibleCount = getVisibleCount();
    const start = carouselIndex;
    
    // Ensure we always show the maximum number of cards possible
    const actualStart = Math.max(0, Math.min(start, cards.length - visibleCount));
    const actualEnd = Math.min(actualStart + visibleCount, cards.length);
    
    return cards.slice(actualStart, actualEnd);
  };

  const getVisibleCount = () => window.innerWidth <= 380 ? 3 : 4;
  
  const canNavigateLeft = () => carouselIndex > 0;
  const canNavigateRight = () => {
    const visibleCount = getVisibleCount();
    return carouselIndex + visibleCount < cards.length;
  };

  const navigateLeft = () => {
    if (canNavigateLeft()) {
      setCarouselIndex(prev => Math.max(0, prev - 1));
    }
  };

  const navigateRight = () => {
    if (canNavigateRight()) {
      const visibleCount = getVisibleCount();
      setCarouselIndex(prev => Math.min(prev + 1, cards.length - visibleCount));
    }
  };

  // Update carousel when active card changes to ensure it's visible
  useEffect(() => {
    if (!isNarrowScreen || cards.length === 0) return;

    const visibleCount = getVisibleCount();
    const visibleStart = carouselIndex; // read current state
    const visibleEnd = visibleStart + visibleCount;
  
    if (activeCardIndex < visibleStart) {
      // active moved left of viewport → align left
      setCarouselIndex(activeCardIndex);
    } else if (activeCardIndex >= visibleEnd) {
      // active moved right of viewport → bring it into view, keeping a full page if possible
      setCarouselIndex(Math.min(activeCardIndex - visibleCount + 1, cards.length - visibleCount));
    }
    // IMPORTANT: do NOT depend on carouselIndex here, or it will fight with user navigation
  }, [activeCardIndex, isNarrowScreen, cards.length]); // removed carouselIndex

  // Reset carousel to show best match when cards are reordered
  useEffect(() => {
    if (bestMatchCard && cards.length > 0) {
      // Find the index of the best match in the current cards array
      const bestMatchIndex = cards.findIndex(card => card.id === bestMatchCard.id);
      if (bestMatchIndex !== -1) {
        setActiveCardIndex(bestMatchIndex);
        setCarouselIndex(0); // Start carousel from beginning to show best match
      }
    }
  }, [bestMatchCard, cards]);

  // Touch/swipe handling for mobile devices
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && canNavigateRight()) {
      navigateRight();
    }
    if (isRightSwipe && canNavigateLeft()) {
      navigateLeft();
    }
  };

  // Use shared labels and cards
  const tagLabels: Record<string, TagTranslations> = sharedTagLabels;
  const cardsData: CardData[] = sharedCardsData;

  useEffect(() => {
    // 从localStorage获取用户测试结果或使用模拟数据
    const getTagStats = () => {
      const savedStats = localStorage.getItem('tagStats');
      if (savedStats) {
        try {
          return JSON.parse(savedStats);
        } catch (e) {
          console.error('Error parsing saved tag statistics:', e);
        }
      }
    };

    // 处理标签得分（共享方法）
    const stats = getTagStats();
    const userScores: Record<string, number> = mapTagStatsToScores(stats);

    setTagScores(userScores);
    // 初始 cards 已设置为共享数据，等待排序后更新

    // 匹配最佳符合的卡片
    if (Object.keys(userScores).length > 0) {
      findBestMatch(userScores);
    }
  }, []);

  // Use shared findBestMatch
  const findBestMatch = (userScores: Record<string, number>) => {
    const { sortedCards, bestMatch } = sharedFindBestMatch(userScores, cardsData);
    setCards(sortedCards);
    setActiveCardIndex(0);
    setMatchedCard(bestMatch);
    setBestMatchCard(bestMatch);
  };

  // Modify handleCardClick to only trigger hexagon animation
  const handleCardClick = (index: number) => {
    if (index !== activeCardIndex) {
      setAnimationKey(prevKey => prevKey + 1); // Only affects hexagon now
      setActiveCardIndex(index);
      setMatchedCard(cards[index]); // Only update matchedCard for hexagon ranges
    }
  };

  // 处理图片加载错误的函数，使用memo防止重复渲染
  const handleImageError = React.useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>, size: string) => {
    // 如果图片加载失败，使用默认占位图像
    const target = e.currentTarget;
    target.src = `https://via.placeholder.com/${size}?text=C`;
    
    // 添加样式防止闪烁
    target.style.objectFit = 'cover';
    target.style.backgroundColor = '#333';
  }, []);

  // Use the currently selected character (from dock) for character introductions (red areas).
  // Fall back to the best match when there is no explicit selection yet.
  const displayedCard = matchedCard || bestMatchCard || cards[0];

  return (
    <div className="results-container" lang={language}>
      <div className="results-layout">
        <div className="results-left">
          <div className="character-portrait">
            <img 
              src={displayedCard.image}
              alt={language === 'en' ? displayedCard.name.en : displayedCard.name.zh}
              onError={(e) => handleImageError(e, '350x350')}
            />
          </div>
          
          <div className="hexagon-chart">
            <MemoizedHexagonChart 
              scores={tagScores} 
              labels={tagLabels} 
              language={language} 
              animationKey={animationKey} 
              selectedCharacter={matchedCard}
            />
          </div>
        </div>
        
        <div className="results-right">
          <div className="character-info">
            <h1 className="character-name">
              {language === 'en' ? displayedCard?.name.en : displayedCard?.name.zh}
            </h1>
            <h2 className="character-title">
              {language === 'en' ? displayedCard?.title.en : displayedCard?.title.zh}
            </h2>
            {/* Moved archetype dock under the character name/title */}
            <div className="character-comparison">
              <div className="comparison-title">
                {language === 'en' ? 'Compare with other archetypes' : '与其他原型比较'}
              </div>
              <div className={`character-grid ${isNarrowScreen ? 'character-grid--carousel' : ''}`}>
                {/* Navigation arrows for narrow screens */}
                {isNarrowScreen && (
                  <button 
                    className={`carousel-nav carousel-nav--left ${canNavigateLeft() ? '' : 'carousel-nav--disabled'}`}
                    onClick={navigateLeft}
                    disabled={!canNavigateLeft()}
                    aria-label={language === 'en' ? 'Previous characters' : '上一页角色'}
                  >
                    ‹
                  </button>
                )}
                
                <div 
                  className="character-grid-inner"
                  onTouchStart={isNarrowScreen ? handleTouchStart : undefined}
                  onTouchMove={isNarrowScreen ? handleTouchMove : undefined}
                  onTouchEnd={isNarrowScreen ? handleTouchEnd : undefined}
                >
                  {getVisibleCards().map((card) => {
                    const originalIndex = cards.findIndex(c => c.id === card.id);
                    const isBestMatch = card.id === bestMatchCard?.id;
                    const isActive = originalIndex === activeCardIndex;
                    
                    return (
                      <div 
                        key={card.id}
                        onClick={() => handleCardClick(originalIndex)}
                        className={`dock-card ${isActive ? 'active' : ''} ${isBestMatch ? 'best-match' : ''}`}
                      >
                        {isBestMatch && (
                          <div className="best-match-badge">
                            {language === 'en' ? 'Best Match' : '最佳匹配'}
                          </div>
                        )}
                        <img 
                          src={card.image} 
                          alt={language === 'en' ? card.name.en : card.name.zh}
                          className="character-image"
                          onError={(e) => handleImageError(e, '50x50')}
                          loading="eager"
                          decoding="async"
                        />
                        <span className="dock-card-name">
                          {language === 'en' ? card.name.en : card.name.zh}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation arrows for narrow screens */}
                {isNarrowScreen && (
                  <button 
                    className={`carousel-nav carousel-nav--right ${canNavigateRight() ? '' : 'carousel-nav--disabled'}`}
                    onClick={navigateRight}
                    disabled={!canNavigateRight()}
                    aria-label={language === 'en' ? 'Next characters' : '下一页角色'}
                  >
                    ›
                  </button>
                )}
              </div>
            </div>
            
            <div className="mythology-description">
              <p>{language === 'en' ? displayedCard?.mythology.en : displayedCard?.mythology.zh}</p>
            </div>
          </div>
          
          <section className="personalized-section">
            <div className="workplace-description">
              <p>{language === 'en' ? bestMatchCard?.description.en : bestMatchCard?.description.zh}</p>
            </div>
            
            <div className="user-results">
              <h3>{language === 'en' ? 'Your Test Results' : '您的测试结果'}</h3>
              <div className="results-grid">
              {Object.entries(tagScores).map(([tag, score], index) => (
                <div key={tag} className="result-item" style={{ animationDelay: `${1.3 + index * 0.1}s` }}>
                  <span className="result-label">
                    {tagLabels[tag] ? (language === 'en' ? tagLabels[tag].en : tagLabels[tag].zh) : tag}
                  </span>
                  <div className="result-bar-container">
                    <div 
                      className="result-bar" 
                      style={{ 
                        '--target-width': `${score}%`,
                        animation: `growWidth 1.5s cubic-bezier(0.17, 0.67, 0.83, 0.67) ${1.4 + index * 0.1}s forwards`
                      } as React.CSSProperties}
                    ></div>
                  </div>
                  <span className="result-value">{score.toFixed(2)}%</span>
                </div>
              ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* Sticky CTA bar */}
      <div className="sticky-cta">
        <div className="sticky-cta__content">
          <button
            className="sticky-cta__button save-results-button "
            onClick={() => onCreateAccount && onCreateAccount()}
            disabled={isAuthenticated}
          >
            {isAuthenticated ? (language === 'en' ? 'Saved' : '已保存') : (language === 'en' ? 'Save my results' : '保存我的结果')}
          </button>
          <button
            className="sticky-cta__button results-restart-button"
            onClick={() => onRestart && onRestart()}
          >
            {language === 'en' ? 'Restart' : '重新开始'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results; 