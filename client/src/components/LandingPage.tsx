import React, { useState, useEffect } from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onEnterBoardroom: () => void;
  onMeetTeam: () => void;
  isInTeamSection: boolean;
  onBackToHome: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterBoardroom, onMeetTeam, isInTeamSection, onBackToHome }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay for dramatic effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);



  return (
    <div className={`landing-page ${isLoaded ? 'loaded' : ''}`}>
      <div className="boardroom-background">
        <img 
          src="/Boardroom.png" 
          alt="Executive Boardroom" 
          className="boardroom-image"
          onLoad={() => {
            console.log('Boardroom image loaded successfully');
            console.log('Image dimensions:', document.querySelector('.boardroom-image')?.getBoundingClientRect());
          }}
          onError={(e) => {
            console.error('Failed to load boardroom image:', e);
            console.error('Image src:', e.currentTarget.src);
          }}
        />
        <div className="boardroom-overlay"></div>
      </div>

      <div className="landing-content">
        <div className="main-content">
          <div className="content-section">
            <div className="title-section">
              <div className="logo-card">
                              <img 
                src="/boardroom_logo.png" 
                alt="BoardRoom Startup Advisory Board" 
                className="logo-image"
                draggable="false"
                onLoad={() => console.log('PNG title loaded successfully')}
                onError={(e) => console.error('Failed to load PNG title:', e)}
              />
              </div>
            </div>

            <div className="buttons-container">
              <button 
                className="enter-boardroom-btn"
                onClick={onEnterBoardroom}
              >
                <span className="btn-text">Enter the Boardroom</span>
                <div className="btn-glow"></div>
                <div className="btn-particles">
                  <span className="particle"></span>
                  <span className="particle"></span>
                  <span className="particle"></span>
                  <span className="particle"></span>
                </div>
              </button>

              <button 
                className="speak-colleague-btn"
                onClick={() => {/* Add handler for colleague feature */}}
              >
                <span className="btn-text">Speak to a Colleague</span>
                <div className="btn-glow"></div>
                <div className="btn-particles">
                  <span className="particle"></span>
                  <span className="particle"></span>
                  <span className="particle"></span>
                  <span className="particle"></span>
                </div>
              </button>
            </div>




          </div>
        </div>
      </div>

      <div className="ambient-lights">
        <div className="light light-1"></div>
        <div className="light light-2"></div>
        <div className="light light-3"></div>
      </div>

      {/* Floating Help Button */}
      <button className="floating-help-btn" onClick={() => {/* Add help handler */}}>
        <span className="help-icon">?</span>
      </button>

      {/* Meet the Team / Back to Home Button */}
      <div className={`meet-team-section ${isInTeamSection ? 'team-mode' : ''}`}>
        <button 
          className="meet-team-btn" 
          onClick={isInTeamSection ? onBackToHome : onMeetTeam}
        >
          <span className="meet-team-text">
            {isInTeamSection ? 'Back to Homepage' : 'Meet the Team'}
          </span>
          <span className="meet-team-arrow">
            {isInTeamSection ? '▲' : '▼'}
          </span>
        </button>
      </div>


    </div>
  );
};

export default LandingPage;
