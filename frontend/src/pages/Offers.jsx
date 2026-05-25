import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '' });

  const copyToClipboard = (text, code) => {
    navigator.clipboard.writeText(code).then(() => {
      setToast({ show: true, message: `Promo Code "${code}" copied to clipboard!` });
      setTimeout(() => setToast({ show: false, message: '' }), 2500);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const offerList = [
    {
      id: 'gift',
      badge: 'SIGNATURE REWARD',
      title: 'Free Exquisite Gift',
      subtitle: 'On purchase of ₹1,00,000 (1 Lakh) or more',
      desc: 'Receive a complimentary signature handcrafted masterwork arrangement from our luxury collection as a token of our appreciation.',
      code: 'LUXURYGIFT',
      actionText: 'Copy Code',
      icon: '🎁',
      bgGradient: 'linear-gradient(135deg, #1a130d 0%, #3a2e24 100%)',
      textColor: '#fffdf0',
      badgeColor: '#d4af37',
      isPremium: true
    },
    {
      id: 'tshirt',
      badge: 'FIRST CUSTOMER SPECIAL',
      title: 'MDFlower Collector\'s T-Shirt',
      subtitle: 'Complimentary on your first order',
      desc: 'Celebrate your first step with us. Get a premium crafted, 100% organic cotton MDFlowers insignia T-shirt with your package.',
      code: 'FIRSTCHIC',
      actionText: 'Copy Code',
      icon: '👕',
      bgGradient: 'linear-gradient(135deg, #ffffff 0%, #fffbf0 100%)',
      textColor: '#1a130d',
      badgeColor: '#b08d57',
      isPremium: false
    },
    {
      id: 'discount',
      badge: 'FESTIVAL SPECIAL',
      title: 'Vasant Blossoms Bonus',
      subtitle: 'Flat 15% OFF + Free India Delivery',
      desc: 'Elevate your summer space design. Get 15% discount and complimentary white-glove logistics across India on orders above ₹25,000.',
      code: 'BLOOM15',
      actionText: 'Copy Code',
      icon: '🌸',
      bgGradient: 'linear-gradient(135deg, #ffffff 0%, #fffdf0 100%)',
      textColor: '#1a130d',
      badgeColor: '#d4af37',
      isPremium: false
    },
    {
      id: 'consult',
      badge: 'BUSINESS & EVENTS',
      title: 'Bespoke Décor Mockups',
      subtitle: 'Free Corporate Consultation & Styling Samples',
      desc: 'Interested in outfitting hotels, corporate offices, or large banquets? Our senior designer will visit your site and provide samples.',
      code: 'CONTACT_US',
      actionText: 'Inquire Now',
      icon: '🏢',
      bgGradient: 'linear-gradient(135deg, #1a130d 0%, #2a2016 100%)',
      textColor: '#fffdf0',
      badgeColor: '#f3e19c',
      isPremium: true
    }
  ];

  return (
    <div style={{ 
      padding: 'clamp(100px, 12vw, 140px) 8% 60px', 
      minHeight: '100vh', 
      background: '#fffdf0',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      {/* Background Ornaments */}
      <div style={{ position: 'absolute', top: '15%', left: '-5%', fontSize: '12rem', opacity: 0.03, transform: 'rotate(-25deg)', pointerEvents: 'none' }}>🌸</div>
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', fontSize: '15rem', opacity: 0.04, transform: 'rotate(15deg)', pointerEvents: 'none' }}>✨</div>

      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative', zIndex: 2 }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '8px 20px', 
          background: 'rgba(212, 175, 55, 0.1)', 
          borderRadius: '50px', 
          color: '#d4af37',
          fontSize: '0.75rem',
          fontWeight: '900',
          letterSpacing: '3px',
          marginBottom: '20px'
        }}>EXQUISITE PRIVILEGES</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '15px', fontFamily: 'Cinzel, serif' }}>
          Exclusive <span className="gold-gradient-text">Offers</span>
        </h1>
        <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', margin: '0 auto 20px' }}></div>
        <p style={{ fontSize: '1rem', color: '#5c4b22', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6', opacity: 0.9 }}>
          Curated rewards and bespoke promotions tailored for our distinguished clients. Discover options to enhance your luxury floral experience.
        </p>
      </div>

      {/* Offers Layout Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', 
        gap: '40px',
        position: 'relative',
        zIndex: 2
      }}>
        {offerList.map((offer) => (
          <div 
            key={offer.id}
            className="offer-card"
            style={{
              background: offer.bgGradient,
              color: offer.textColor,
              borderRadius: '25px',
              padding: '40px 30px',
              border: offer.isPremium ? '1.5px solid #d4af37' : '1px solid rgba(138, 109, 59, 0.3)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Elegant Floating Icon Accent */}
            <div style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '25px', 
              fontSize: '3rem', 
              opacity: offer.isPremium ? 0.15 : 0.08,
              pointerEvents: 'none'
            }}>{offer.icon}</div>

            {/* Content Details */}
            <div>
              <span style={{ 
                fontSize: '0.7rem', 
                fontWeight: '900', 
                letterSpacing: '2.5px', 
                color: offer.badgeColor,
                display: 'block',
                marginBottom: '15px',
                textTransform: 'uppercase'
              }}>{offer.badge}</span>

              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                fontSize: '1.6rem', 
                marginBottom: '10px', 
                color: offer.textColor === '#fffdf0' ? '#fff' : '#1a130d',
                lineHeight: '1.3'
              }}>{offer.title}</h2>

              <p style={{ 
                fontSize: '0.9rem', 
                fontWeight: 'bold', 
                color: offer.badgeColor, 
                marginBottom: '20px',
                letterSpacing: '0.5px'
              }}>{offer.subtitle}</p>

              <p style={{ 
                fontSize: '0.85rem', 
                lineHeight: '1.7', 
                opacity: 0.85, 
                marginBottom: '30px' 
              }}>{offer.desc}</p>
            </div>

            {/* Actions Box */}
            <div style={{ borderTop: `1px solid ${offer.textColor === '#fffdf0' ? 'rgba(255,255,255,0.1)' : 'rgba(26,19,13,0.1)'}`, paddingTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap' }}>
              {offer.code !== 'CONTACT_US' ? (
                <>
                  <div>
                    <span style={{ fontSize: '0.65rem', display: 'block', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>PROMO CODE</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1.5px', color: '#d4af37' }}>{offer.code}</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(offer.title, offer.code)}
                    className="btn-gold"
                    style={{ 
                      background: offer.isPremium ? '#d4af37' : '#1a130d',
                      color: offer.isPremium ? '#1a130d' : '#fffdf0',
                      padding: '12px 25px',
                      fontSize: '0.75rem',
                      borderRadius: '8px'
                    }}
                  >
                    {offer.actionText}
                  </button>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Terms & Conditions Apply</span>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="btn-gold"
                    style={{ 
                      background: '#d4af37',
                      color: '#1a130d',
                      padding: '12px 30px',
                      fontSize: '0.75rem',
                      borderRadius: '8px'
                    }}
                  >
                    {offer.actionText}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Clipboard Notification Toast */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(26, 19, 13, 0.95)',
          color: '#fffdf0',
          border: '1.5px solid #d4af37',
          padding: '15px 30px',
          borderRadius: '50px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 100000,
          animation: 'slideUp 0.3s ease-out forwards'
        }}>
          <span style={{ color: '#d4af37', fontSize: '1.2rem' }}>✨</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>{toast.message}</span>
          
          <style>{`
            @keyframes slideUp {
              from { transform: translate(-50%, 50px); opacity: 0; }
              to { transform: translate(-50%, 0); opacity: 1; }
            }
            .offer-card:hover {
              transform: translateY(-10px);
              box-shadow: 0 25px 50px rgba(184, 134, 11, 0.15) !important;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Offers;
