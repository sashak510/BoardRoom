import React, { useState, useEffect } from 'react';
import './LandingPage.css';

// Persona descriptions for each agent
const AGENT_PERSONAS = {
  realist: {
    id: 'realist',
    name: 'Marcus Sterling',
    title: 'Cynical Business Advisor',
    avatar: '/avatars/Cynic.png',
    description: `I'm Marcus Sterling, the voice of reason in your boardroom - the one who asks the tough questions others won't. While everyone else gets excited about the next big idea, I'm here to ground you in reality as your cynical business advisor.

I've seen countless startups fail because they ignored the fundamentals. Market validation? Cash flow projections? Competitive analysis? These aren't just buzzwords to me - they're survival essentials.

My expertise lies in risk assessment, feasibility analysis, and identifying potential pitfalls before they become expensive mistakes. I'll challenge your assumptions, stress-test your business model, and ensure you're building something sustainable, not just trendy.

Don't mistake my skepticism for negativity. I want you to succeed, which is why I'll push you to think critically about every decision. Better to face harsh truths now than pleasant surprises later.`,
    specialties: ['Risk Assessment', 'Market Reality Checks', 'Financial Feasibility', 'Competitive Analysis', 'Sustainability Planning']
  },
  creative: {
    id: 'creative',
    name: 'Maya Patel',
    title: 'Creative Visionary',
    avatar: '/avatars/Creative.png',
    description: `I'm Maya Patel, your creative visionary who's here to shatter conventional thinking and unlock possibilities you never imagined. While others see obstacles, I see opportunities for revolutionary solutions.

My mind operates in the realm of "what if" and "why not." I believe every industry is ripe for disruption, every problem has an elegant solution waiting to be discovered, and every limitation is just a creative challenge in disguise.

I specialize in blue-sky thinking, unconventional business models, and breakthrough innovations. I'll help you see beyond traditional approaches and discover unique value propositions that set you apart from the competition.

My ideas might seem wild at first, but history's greatest successes started as someone's "crazy" idea. I'm here to help you think bigger, dream bolder, and create something truly extraordinary.`,
    specialties: ['Innovation Strategy', 'Disruptive Business Models', 'Creative Problem Solving', 'Unique Value Propositions', 'Blue-Sky Thinking']
  },
  entrepreneur: {
    id: 'entrepreneur',
    name: 'Daniel Rodriguez',
    title: 'Serial Entrepreneur',
    avatar: '/avatars/Entrepreneurial.png',
    description: `I'm Daniel Rodriguez, a serial entrepreneur who's been in the trenches of startup life - from garage beginnings to IPO celebrations. I understand the entrepreneurial journey because I've lived it multiple times.

My focus is on scalable growth, market penetration, and building sustainable competitive advantages. I know how to identify market opportunities, validate business models, and execute strategies that drive real results.

I've navigated the challenges of customer acquisition, team building, fundraising, and scaling operations. I understand the delicate balance between growth and sustainability, innovation and execution.

My approach is practical yet ambitious. I'll help you think strategically about market positioning, growth tactics, and long-term vision while keeping you grounded in actionable next steps. Success isn't just about having a great idea - it's about executing it brilliantly.`,
    specialties: ['Growth Strategy', 'Market Penetration', 'Business Model Validation', 'Customer Acquisition', 'Scaling Operations']
  },

  tech: {
    id: 'tech',
    name: 'Alex Thompson',
    title: 'Technology & AI Expert',
    avatar: '/avatars/Coder.png',
    description: `I'm Alex Thompson, your technology and AI expert who lives at the intersection of cutting-edge technology and business innovation. In today's digital-first world, your technology choices can make or break your competitive advantage.

I specialize in scalable architectures, AI implementation, and technology strategies that drive business value. I understand how to leverage emerging technologies like machine learning, blockchain, and cloud computing to create sustainable competitive moats.

My focus isn't just on building great software - it's on building technology that scales with your business, reduces operational costs, and creates new revenue opportunities. I think about technical debt, security, and long-term maintainability from day one.

I'll help you navigate the complex landscape of technology decisions, from choosing the right tech stack to implementing AI solutions that actually solve real problems. Technology should be your business accelerator, not your bottleneck.`,
    specialties: ['AI & Machine Learning', 'Scalable Architecture', 'Technology Strategy', 'Product Development', 'Technical Innovation']
  },
  lisa: {
    id: 'lisa',
    name: 'Lisa Moreau',
    title: 'Strategic Marketing Expert',
    avatar: '/avatars/Lisa.png',
    description: `I'm Lisa Moreau, your strategic marketing expert who transforms brilliant ideas into market-winning brands. While others focus on building products, I focus on building the stories, relationships, and strategies that make customers fall in love with what you create.

My expertise spans from startup brand development to global marketing campaigns. I understand how to identify your target audience, craft compelling value propositions, and create marketing funnels that turn prospects into loyal customers and advocates.

I think strategically about customer psychology, brand positioning, content marketing, social media strategy, and omnichannel experiences. I know how to stretch limited startup budgets to achieve maximum impact through creative, data-driven marketing approaches.

Whether you're launching your first product or scaling to new markets, I'll help you cut through the noise, connect with your ideal customers, and build a brand that drives sustainable growth and premium pricing.`,
    specialties: ['Brand Strategy', 'Customer Acquisition', 'Digital Marketing', 'Content Strategy', 'Market Positioning']
  },
  finance: {
    id: 'finance',
    name: 'Victoria Chen',
    title: 'Finance Expert',
    avatar: '/avatars/Finance Expert.png',
    description: `I'm Victoria Chen, your finance expert who turns numbers into strategic insights and financial chaos into sustainable growth. While others focus on ideas and execution, I focus on the financial foundation that makes everything possible.

My expertise covers financial modeling, fundraising strategies, cash flow management, and investor relations. I understand how to structure deals, optimize capital allocation, and build financial systems that scale with your business growth.

I think strategically about unit economics, burn rates, runway extension, and the metrics that matter to investors. I know how to prepare compelling pitch decks, navigate due diligence processes, and negotiate terms that protect your interests while securing the capital you need.

Whether you're bootstrapping your first venture or preparing for Series A, I'll help you build a solid financial foundation, attract the right investors, and make data-driven decisions that drive sustainable profitability.`,
    specialties: ['Financial Modeling', 'Fundraising Strategy', 'Cash Flow Management', 'Investor Relations', 'Unit Economics']
  }
};

interface LandingPageProps {
  onEnterBoardroom: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterBoardroom }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Add a small delay for dramatic effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (expandedPersona && AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS]) {
      const persona = AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS];
      const fullText = persona.description;
      setTypingText('');
      setIsTyping(true);
      
      let currentIndex = 0;
      const typingSpeed = 15; // milliseconds per character - faster typing
      
      const typeText = () => {
        if (currentIndex < fullText.length) {
          setTypingText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeText, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };
      
      // Start typing after a brief delay
      setTimeout(typeText, 500);
    }
  }, [expandedPersona]);

  const handlePersonaClick = (personaId: string) => {
    setExpandedPersona(personaId);
    // Smooth scroll to expanded view
    setTimeout(() => {
      const expandedElement = document.querySelector('.persona-expanded');
      if (expandedElement) {
        expandedElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleClosePersona = () => {
    setExpandedPersona(null);
    setTypingText('');
    setIsTyping(false);
  };

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
        <div className="top-content">
        </div>

        <div className="bottom-content">
          <div className="bottom-section">
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

            <div className="features-list">
              <div className="feature">
                <span className="feature-icon">🎙️</span>
                <span>Live AI Conversations</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>Custom Topics</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💬</span>
                <span>Interactive Discussions</span>
              </div>
            </div>

            <div className="advisors-preview">
              <div className="advisor-card" onClick={() => handlePersonaClick('realist')}>
                <img src="/avatars/Cynic.png" alt="Realist Agent" className="advisor-avatar" draggable="false" />
                <span>Realist</span>
              </div>
              <div className="advisor-card" onClick={() => handlePersonaClick('creative')}>
                <img src="/avatars/Creative.png" alt="Creative Agent" className="advisor-avatar" draggable="false" />
                <span>Creative</span>
              </div>
              <div className="advisor-card" onClick={() => handlePersonaClick('entrepreneur')}>
                <img src="/avatars/Entrepreneurial.png" alt="Entrepreneurial Agent" className="advisor-avatar" draggable="false" />
                <span>Entrepreneur</span>
              </div>

              <div className="advisor-card" onClick={() => handlePersonaClick('tech')}>
                <img src="/avatars/Coder.png" alt="Tech Expert Agent" className="advisor-avatar" draggable="false" />
                <span>Tech Expert</span>
              </div>
              <div className="advisor-card" onClick={() => handlePersonaClick('lisa')}>
                <img src="/avatars/Lisa.png" alt="Marketing Expert" className="advisor-avatar" draggable="false" />
                <span>Marketing Expert</span>
              </div>
              <div className="advisor-card" onClick={() => handlePersonaClick('finance')}>
                <img src="/avatars/Finance Expert.png" alt="Finance Expert" className="advisor-avatar" draggable="false" />
                <span>Finance Expert</span>
              </div>
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

      {/* Expanded Persona View */}
      {expandedPersona && (
        <div className="persona-expanded">
          <div className="persona-content">
            <button className="close-persona-btn" onClick={handleClosePersona}>
              ✕
            </button>
            
            <div className="persona-header">
              <img 
                src={AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].avatar} 
                alt={AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].name}
                className="persona-large-avatar"
                draggable="false"
              />
              <div className="persona-info">
                <h2 className="persona-name">
                  {AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].name}
                </h2>
                <h3 className="persona-title">
                  {AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].title}
                </h3>
              </div>
            </div>

            <div className="persona-description">
              <div className="typing-text">
                {typingText}
                {isTyping && <span className="typing-cursor">|</span>}
              </div>
            </div>

            <div className="persona-specialties">
              <h4>Specialties:</h4>
              <div className="specialties-list">
                {AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].specialties.map((specialty, index) => (
                  <span key={index} className="specialty-tag">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
