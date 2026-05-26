import React from 'react';

const Offers = () => {
  const offerList = [
    {
      id: 'gift',
      badge: 'SIGNATURE REWARD',
      title: 'Free Exquisite Gift',
      subtitle: 'On purchase of ₹1,00,000 (1 Lakh) or more',
      desc: 'Receive a complimentary signature handcrafted masterwork arrangement from our luxury collection as a token of our appreciation.',
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
      icon: '👕',
      bgGradient: 'linear-gradient(135deg, #ffffff 0%, #fffbf0 100%)',
      textColor: '#1a130d',
      badgeColor: '#b08d57',
      isPremium: false
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
      {/* CSS Styles */}
      <style>{`
        .offer-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(184, 134, 11, 0.15) !important;
        }
      `}</style>

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
        zIndex: 2,
        maxWidth: '1000px',
        margin: '0 auto'
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
                marginBottom: '0' 
              }}>{offer.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
