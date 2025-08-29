import React, { useState, useEffect } from 'react';
import { TagTranslations } from '../../../utils/archetypes';
import { CardData } from '../../../features/personality-test/types/character';

export const HexagonChart: React.FC<{
    scores: Record<string, number>,
    labels: Record<string, TagTranslations>,
    language: string,
    animationKey?: number,
    selectedCharacter: CardData | null // Add selected character prop
  }> = ({ scores, labels, language, animationKey, selectedCharacter }) => {
    // 六边形的6个顶点 - 调整起始角度为30度，使顶点而非边在正上方
    const getHexagonPoints = (center: [number, number], size: number) => {
      const points = [];
      for (let i = 0; i < 6; i++) {
        // 从30度开始，每隔60度一个顶点
        const angle = (Math.PI / 6) + (Math.PI / 3 * i);
        const x = center[0] + size * Math.cos(angle);
        const y = center[1] + size * Math.sin(angle);
        points.push([x, y]);
      }
      return points;
    };
  
    // Define type for tag keys
    type TagKey = keyof CardData['tagRanges'];
    
    // Define the standard six tag keys
    const tagKeys: TagKey[] = [
      'selfAwareness',
      'dedication',
      'socialIntelligence',
      'emotionalRegulation',
      'objectivity',
      'coreEndurance'
    ];
  
    // 根据分数计算多边形顶点
    const getScorePoints = (center: [number, number], size: number, scores: Record<string, number>) => {
      const points = [];
      
      for (let i = 0; i < 6; i++) {
        const tag = tagKeys[i];
        const score = scores[tag] || 0;
        const scaledSize = (size * score) / 100;
        // 从30度开始，每隔60度一个顶点
        const angle = (Math.PI / 6) + (Math.PI / 3 * i);
        const x = center[0] + scaledSize * Math.cos(angle);
        const y = center[1] + scaledSize * Math.sin(angle);
        points.push([x, y]);
      }
      return points;
    };
  
    // 获取标签位置的函数 - 优化定位
    const getTagPosition = (center: [number, number], size: number, tagIndex: number) => {
      // 从30度开始，每隔60度一个顶点
      const angle = (Math.PI / 6) + (Math.PI / 3 * tagIndex);
      // 为外部标签增加额外距离
      const distance = size + 30;
      
      // 计算标签坐标
      const x = center[0] + distance * Math.cos(angle);
      const y = center[1] + distance * Math.sin(angle);
      
      return { 
        key: tagKeys[tagIndex], 
        labelX: x, 
        labelY: y, 
        angle: angle * (180 / Math.PI) // 转换为角度
      };
    };
  
    // 获取分数标签的位置 - 响应式调整
    const getScorePosition = (center: [number, number], size: number, tagIndex: number, score: number) => {
      // 从30度开始，每隔60度一个顶点
      const angle = (Math.PI / 6) + (Math.PI / 3 * tagIndex);
      
      // 计算分数位置 - 在数据点和中心点之间
      const scaledSize = (size * score) / 100 * 0.7; // 略微靠近中心点，用0.7比例
      
      const x = center[0] + scaledSize * Math.cos(angle);
      const y = center[1] + scaledSize * Math.sin(angle);
      
      return { x, y };
    };
  
    // 生成同心六边形的点（创建刻度线）
    const generateConcentric = (center: [number, number], maxSize: number, count: number = 4) => {
      const polygons = [];
      for (let i = 1; i <= count; i++) {
        const size = maxSize * (i / count);
        const points = getHexagonPoints(center, size);
        polygons.push(points.map(point => point.join(',')).join(' '));
      }
      return polygons;
    };
  
    // Get points for upper and lower bounds
    const getBoundPoints = (center: [number, number], size: number, isUpper: boolean) => {
      const points = [];
      
      for (let i = 0; i < 6; i++) {
        const tag = tagKeys[i];
        const range = selectedCharacter?.tagRanges[tag] || [0, 100];
        const boundValue = isUpper ? range[1] : range[0];
        const scaledSize = (size * boundValue) / 100;
        const angle = (Math.PI / 6) + (Math.PI / 3 * i);
        const x = center[0] + scaledSize * Math.cos(angle);
        const y = center[1] + scaledSize * Math.sin(angle);
        points.push([x, y]);
      }
      return points;
    };
  
    const [animated, setAnimated] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    // 使用useEffect监听窗口大小变化
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    
    // 使用useEffect监听animationKey变化，重置动画状态
    useEffect(() => {
      setAnimated(false);
      const timer = setTimeout(() => {
        setAnimated(true);
      }, 500);
      return () => clearTimeout(timer);
    }, [animationKey]); // 依赖于animationKey
    
    const center: [number, number] = [200, 200]; // 中心点坐标
    const size = 160; // 六边形尺寸
    
    // 获取外部六边形坐标
    const outerPoints = getHexagonPoints(center, size);
    const outerPolygon = outerPoints.map(point => point.join(',')).join(' ');
    
    // 生成同心六边形（刻度线）
    const concentricPolygons = generateConcentric(center, size);
    
    // Get points for user scores, upper bound, and lower bound
    const scorePoints = getScorePoints(center, size, scores);
    const upperBoundPoints = getBoundPoints(center, size, true);
    const lowerBoundPoints = getBoundPoints(center, size, false);
  
    // Convert points to SVG path format
    const scorePolygon = scorePoints.map(point => point.join(',')).join(' ');
    const upperPolygon = upperBoundPoints.map(point => point.join(',')).join(' ');
    const lowerPolygon = lowerBoundPoints.map(point => point.join(',')).join(' ');
    
    // 为每个位置增加标签和分数位置
    const tagPositions = [];
    for (let i = 0; i < 6; i++) {
      const pos = getTagPosition(center, size, i);
      const tagKey = tagKeys[i];
      const score = scores[tagKey] || 0;
      const scorePos = getScorePosition(center, size, i, score);
      
      tagPositions.push({
        ...pos,
        score,
        scoreX: scorePos.x,
        scoreY: scorePos.y
      });
    }
  
    // 添加刻度值 - 调整位置以匹配新的角度
    const scaleValues = ["0", "25", "50", "75", "100"];
    
    const getLabelWidth = () => {
      if (windowWidth <= 380) return 100;
      if (windowWidth <= 480) return 110;
      if (windowWidth <= 768) return 120;
      return 130;
    };
  
    return (
      <div className="svg-hexagon-chart">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          {/* 刻度值 */}
          {scaleValues.map((value, index) => {
            if (index === 0) return null; // 跳过中心点的0值
            const distance = (size * index) / (scaleValues.length - 1);
            // 调整角度使刻度值的位置更合理
            const angle = Math.PI / 6;
            return (
              <text
                key={`scale-${index}`}
                x={center[0] + distance * Math.cos(angle)}
                y={center[1] - distance * Math.sin(angle)}
                fill="rgba(255,255,255,0.5)"
                fontSize="10"
                textAnchor="middle"
                style={{
                  opacity: animated ? 1 : 0,
                  transition: `opacity 0.5s ease ${0.3 + index * 0.1}s`
                }}
              >
                {value}
              </text>
            );
          })}
          
          {/* 同心六边形（刻度线） */}
          {concentricPolygons.map((polygon, index) => (
            <polygon
              key={index}
              points={polygon}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              style={{
                opacity: animated ? 1 : 0,
                transition: `opacity 0.5s ease ${0.2 + index * 0.1}s`
              }}
            />
          ))}
          
          {/* 径向线 */}
          {outerPoints.map((point, i) => (
            <line 
              key={i}
              x1={center[0]} 
              y1={center[1]} 
              x2={point[0]} 
              y2={point[1]} 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="1"
              style={{
                opacity: animated ? 1 : 0,
                transition: `opacity 0.5s ease ${0.3 + i * 0.05}s`
              }}
            />
          ))}
          
          {/* 外部框架 */}
          <polygon 
            points={outerPolygon} 
            fill="none" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="2"
            style={{
              opacity: animated ? 1 : 0,
              transition: 'opacity 0.8s ease 0.5s'
            }}
          />
          
          {/* Shaded area between bounds */}
          <path
            d={`M ${upperBoundPoints[0].join(',')} 
                L ${upperBoundPoints.map(p => p.join(',')).join(' L ')} 
                L ${upperBoundPoints[0].join(',')} 
                L ${lowerBoundPoints[0].join(',')} 
                L ${lowerBoundPoints.map(p => p.join(',')).join(' L ')} 
                L ${lowerBoundPoints[0].join(',')} Z`}
            fill="rgba(240,189,192,0.25)"
            fillRule="evenodd"
            stroke="none"
            style={{
              opacity: animated ? 1 : 0,
              transition: 'opacity 1s ease 0.5s'
            }}
          />
  
          {/* Upper bound line */}
          <polygon 
            points={upperPolygon} 
            fill="none" 
            stroke="rgba(240,189,192,0.5)" 
            strokeWidth="1"
            strokeDasharray="5,5"
            style={{
              opacity: animated ? 1 : 0,
              transition: 'opacity 0.8s ease 0.5s'
            }}
          />
  
          {/* Lower bound line */}
          <polygon 
            points={lowerPolygon} 
            fill="none" 
            stroke="rgba(240,189,192,0.5)" 
            strokeWidth="1"
            strokeDasharray="5,5"
            style={{
              opacity: animated ? 1 : 0,
              transition: 'opacity 0.8s ease 0.5s'
            }}
          />
  
          {/* User score line (existing) */}
          <polygon 
            points={scorePolygon} 
            fill="none"
            stroke="#F0BDC0" 
            strokeWidth="2"
            style={{
              opacity: animated ? 1 : 0,
              transition: 'opacity 1s ease 0.7s'
            }}
          />
  
          {/* 分数点 */}
          {scorePoints.map((point, i) => (
            <circle
              key={i}
              cx={point[0]}
              cy={point[1]}
              r="4"
              fill="#F0BDC0"
              style={{
                opacity: animated ? 1 : 0,
                transition: `opacity 0.5s ease ${0.8 + i * 0.1}s`,
                transform: `scale(${animated ? 1 : 0})`,
                transformOrigin: 'center',
                transitionProperty: 'opacity, transform',
                transitionDuration: '0.5s',
                transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            />
          ))}
          
          {/* Label text */}
          {tagPositions.map((item, index) => {
            const labelText = labels[item.key] 
              ? (language === 'en' ? labels[item.key].en : labels[item.key].zh) 
              : item.key;
            
            const labelWidth = getLabelWidth();
            
            return (
              <g 
                key={`label-${item.key}`}
                style={{
                  opacity: animated ? 1 : 0,
                  transition: `opacity 0.5s ease ${1 + index * 0.1}s`
                }}
              >
                {/* Label text background */}
                <rect
                  x={item.labelX - labelWidth / 2}
                  y={item.labelY - 24}  // Increased height to accommodate score
                  width={labelWidth}
                  height="48"  // Doubled height for two lines
                  rx="12"
                  ry="12"
                  fill="rgba(0,0,0,0.6)"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  className="label-background"
                />
                
                {/* Label text */}
                <text 
                  x={item.labelX} 
                  y={item.labelY - 8}  // Moved up to make room for score
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={windowWidth <= 480 ? 13 : 15}
                  fontWeight="bold"
                  className="label-text"
                >
                  {labelText}
                </text>
  
                {/* Score text */}
                <text 
                  x={item.labelX} 
                  y={item.labelY + 12}  // Positioned below label
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  fill="#F0BDC0"
                  fontSize={windowWidth <= 480 ? 12 : 14}
                  fontWeight="bold"
                  className="score-text"
                >
                  {item.score.toFixed(2)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };
  
  // 添加一个优雅的加载组件
  const FancyLoader: React.FC = () => {
    return (
      <div className="fancy-loader-container">
        <div className="fancy-loader-content">
          <div className="fancy-loader-hexagon">
            <div className="hexagon-outer"></div>
            <div className="hexagon-middle"></div>
            <div className="hexagon-inner"></div>
          </div>
          <div className="fancy-loader-text">
            <span>L</span>
            <span>o</span>
            <span>a</span>
            <span>d</span>
            <span>i</span>
            <span>n</span>
            <span>g</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      </div>
    );
  };

  export const MemoizedHexagonChart = React.memo(({ scores, labels, language, animationKey, selectedCharacter }: {
    scores: Record<string, number>,
    labels: Record<string, TagTranslations>,
    language: string,
    animationKey: number,
    selectedCharacter: CardData | null
  }) => (
    <HexagonChart 
      scores={scores} 
      labels={labels} 
      language={language} 
      animationKey={animationKey} 
      selectedCharacter={selectedCharacter}
    />
  ));