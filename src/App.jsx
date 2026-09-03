import React, { useState, useEffect } from 'react';
import { ThreeBackground } from './components/ThreeBackground';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ToolsHub } from './components/ToolsHub';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesSection } from './components/FeaturesSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

// Dedicated Tool Pages & Studio Header
import { ToolStudioHeader } from './components/ToolStudioHeader';
import { ImageEditor } from './components/ImageEditor';
import { BackgroundRemoval } from './components/BackgroundRemoval';
import { ImageEnhancement } from './components/ImageEnhancement';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  // Routing State: 'home' | 'object-remover' | 'bg-remover' | 'image-enhancer'
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (['object-remover', 'bg-remover', 'image-enhancer'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  // Sync hash URL changes with React route state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['object-remover', 'bg-remover', 'image-enhancer'].includes(hash)) {
        setCurrentRoute(hash);
      } else {
        setCurrentRoute('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToTool = (toolId) => {
    setCurrentRoute(toolId);
    window.location.hash = toolId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentRoute('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStudioPage = ['object-remover', 'bg-remover', 'image-enhancer'].includes(currentRoute);

  return (
    <div className="relative min-h-screen bg-[#0d0a14] text-[#f3f4f6] selection:bg-[#A855F7]/30 selection:text-white">
      {/* WebGL Canvas Background */}
      <ThreeBackground />

      {/* Conditionally Render Landing Header OR Tool Studio Header */}
      {!isStudioPage ? (
        <Header
          onSelectTool={navigateToTool}
          onNavigateHome={navigateToHome}
          currentRoute={currentRoute}
        />
      ) : (
        <ToolStudioHeader
          activeTool={currentRoute}
          onSelectTool={navigateToTool}
          onBackHome={navigateToHome}
        />
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col">
        {!isStudioPage ? (
          /* ─── HOMEPAGE LANDING ─── */
          <>
            {/* Hero Banner with WebGL Waves */}
            <HeroSection onSelectTool={navigateToTool} />

            {/* 3 AI Tools Showcase Bento Grid */}
            <ToolsHub onSelectTool={navigateToTool} />

            {/* How It Works (4 Simple Steps) */}
            <HowItWorks />

            {/* Built For Perfectionists Bento Features */}
            <FeaturesSection />

            {/* FAQ Accordion */}
            <FAQSection />
          </>
        ) : (
          /* ─── DEDICATED TOOL STUDIO WORKSTATION ─── */
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {currentRoute === 'object-remover' && (
              <ImageEditor
                initialImage={selectedImage}
                initialFileName={selectedFileName}
              />
            )}

            {currentRoute === 'bg-remover' && (
              <BackgroundRemoval />
            )}

            {currentRoute === 'image-enhancer' && (
              <ImageEnhancement />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTool={navigateToTool} />
    </div>
  );
}

export default App;
