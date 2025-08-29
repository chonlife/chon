import { Routes, Route, useLocation } from 'react-router-dom'
import Navigation from './components/Navigation/Navigation.tsx'
import LanguageSelector from './components/LanguageSelector/LanguageSelector.tsx'
import Home from './pages/Home/Home.tsx'
import PersonalityTest from './pages/PersonalityTest/PersonalityTest.tsx'
import Contact from './pages/Contact/Contact.tsx'
import Login from './pages/Login/Login.tsx'
import NotFound from './pages/NotFound/NotFound.tsx'
import { useLanguage } from './contexts/LanguageContext.tsx'
import { useEffect, useState } from 'react'
import './App.css'
import Profile from './pages/Profile/Profile.tsx'
import { useViewportControl } from './hooks/useViewportControl'

function App() {
  const { language } = useLanguage();
  const [whiteTheme, setWhiteTheme] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const [restrictViewport, setRestrictViewport] = useState(false);
  const location = useLocation();
  const isPersonalityTest = location.pathname.includes('/personality-test');

  // Use viewport control hook to manage mobile viewport restrictions
  useViewportControl(restrictViewport, {
    userScalable: false,
    maximumScale: 1.0,
    minimumScale: 1.0,
    initialScale: 1.0
  });

  // 当语言变化时，更新HTML根元素的lang属性
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // 监听路由变化，当不在personality-test页面时重置为黑色主题
  useEffect(() => {
    if (!isPersonalityTest) {
      setWhiteTheme(false);
      setHideUI(false);
      setRestrictViewport(false);
    }
  }, [location.pathname, isPersonalityTest]);

  // Handler for setting white theme
  const handleWhiteThemeChange = (isWhite: boolean) => {
    setWhiteTheme(isWhite);
  };
  
  // Handler for hiding UI elements
  const handleHideUIChange = (shouldHide: boolean) => {
    setHideUI(shouldHide);
  };

  // Handler for viewport restrictions
  const handleViewportRestrictionChange = (shouldRestrict: boolean) => {
    setRestrictViewport(shouldRestrict);
  };

  // 只有在PersonalityTest页面且hideUI为true时才隐藏导航栏和语言选择器
  const shouldHideNavigation = isPersonalityTest && hideUI;

  return (
    <div className={`app-container ${whiteTheme ? 'white-theme' : ''}`} lang={language}>
      {!shouldHideNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/personality-test" 
          element={
            <PersonalityTest 
              onWhiteThemeChange={handleWhiteThemeChange} 
              onHideUIChange={handleHideUIChange}
              onViewportRestrictionChange={handleViewportRestrictionChange}
            />
          } 
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!shouldHideNavigation && (
        <div style={{ position: 'relative', zIndex: 100 }}>
          <LanguageSelector />
        </div>
      )}
    </div>
  )
}

export default App
