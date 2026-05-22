import React from 'react';

const About = () => {
  return (
    <div style={{ background: '#fffdf0', minHeight: '100vh' }}>

      {/* SECTION 1: Heritage & Philosophy (Original Content) - Compact */}
      <div style={{ padding: 'clamp(100px, 12vw, 140px) 5% 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '15px' }}>Our <span className="gold-gradient-text">Heritage</span></h1>
          <p style={{ fontSize: '1.1rem', color: '#1a130d', maxWidth: '750px', margin: '0 auto' }}>
            Crafting moments of beauty since 1998. At MD Flower, we believe every bloom tells a story of elegance and luxury.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '50px', alignItems: 'center', marginBottom: '60px' }}>
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', height: 'clamp(250px, 40vw, 400px)' }}>
            <img src="/hero_banner.png" alt="Our Story" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '20px' }}>The Philosophy</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#2c241e', marginBottom: '15px' }}>
              Our journey began with a simple passion for the extraordinary. We don't just arrange flowers; we curate experiences that linger in the heart and mind.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#2c241e' }}>
              Each petal is hand-selected, each stem meticulously placed. Our signature gold-touched aesthetic reflects the preciousness of the occasions we celebrate with you.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '30px', marginTop: '60px' }}>
          {[
            { title: 'Quality', text: 'Sourcing only the rarest and freshest blooms from across the globe.' },
            { title: 'Artistry', text: 'Our floral designers are master artists with decades of experience.' },
            { title: 'Delivery', text: 'Premium white-glove delivery service across all major Indian cities.' },
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center', background: '#fff' }}>
              <h3 style={{ color: '#d4af37', marginBottom: '10px', fontSize: '1.1rem', fontFamily: 'Cinzel' }}>{item.title}</h3>
              <p style={{ color: '#1a130d', fontSize: '0.85rem' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Legacy & Artistry (New Content from Image) - Compact Version */}
      <div style={{ padding: '40px 5% 40px', background: '#fffdf0', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle floating petals background effect */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${8 + Math.random() * 12}px`,
              opacity: 0.2,
              filter: 'blur(1px)',
              animation: `floatPetal ${15 + Math.random() * 10}s linear infinite`
            }}>🌸</div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '60px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>

          {/* Left Side: Scaled Down Images & Badge */}
          <div style={{ position: 'relative', paddingBottom: '60px' }}>
            <div style={{
              width: '100%',
              height: 'clamp(300px, 50vw, 420px)',
              backgroundColor: '#eee',
              borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(184, 134, 11, 0.15)',
              border: '6px solid white'
            }}>
              <img
                src="/about_decor.png"
                alt="Floral Decor"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div className="about-decor-sub" style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: 'clamp(150px, 30vw, 240px)',
              height: 'clamp(150px, 30vw, 240px)',
              borderRadius: '50%',
              border: '6px solid white',
              overflow: 'hidden',
              boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
              zIndex: 2
            }}>
              <img
                src="/about_bouquet.png"
                alt="Vibrant Bouquet"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div className="about-badge" style={{
              position: 'absolute',
              top: '20%',
              right: '-10px',
              width: '70px',
              height: '70px',
              background: '#b08d57',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
              zIndex: 3
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: 1 }}>12+</span>
              <span style={{ fontSize: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Years of Artistry</span>
            </div>
          </div>

          {/* Right Side: Scaled down Content */}
          <div>
            <h4 style={{ color: '#b08d57', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.75rem', marginBottom: '15px', fontWeight: 'bold' }}>Our Legacy</h4>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', lineHeight: 1.2, marginBottom: '20px', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>Building a Legacy <br /> in Floral Artistry</h1>
            <p style={{ color: '#5c5c5c', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '30px', maxWidth: '480px' }}>At MD Flowers, we believe that beauty should be eternal. Our journey began with a passion for creating artificial flowers that rival the real ones in every detail.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '35px' }}>
              {[
                { icon: '🌿', text: 'Premium Silk, Velvet & Foam Materials' },
                { icon: '👨‍🎨', text: 'Handcrafted by Expert Artisans' },
                { icon: '🚚', text: 'Pan-India Delivery & Fast Logistics' },
                { icon: '✨', text: 'Bespoke Custom Event Design' },
                { icon: '🏆', text: 'ISO Quality Certified Products' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#b08d57', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem' }}>{item.icon}</div>
                  <span style={{ fontWeight: '600', color: '#1a130d', fontSize: '0.85rem' }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button className="btn-gold" style={{ background: '#b08d57', padding: '12px 25px', fontSize: '0.7rem' }}>Our Collections</button>
              <button className="btn-gold" style={{ background: 'transparent', border: '1px solid #b08d57', color: '#b08d57', padding: '12px 25px', fontSize: '0.7rem' }}>Contact Us</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatPetal {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.3; }
            90% { opacity: 0.3; }
            100% { transform: translate(100px, 1000px) rotate(360deg); opacity: 0; }
        }
        @media (max-width: 576px) {
          .about-decor-sub {
            width: 120px !important;
            height: 120px !important;
          }
          .about-badge {
            width: 50px !important;
            height: 50px !important;
            top: 10% !important;
          }
          .about-badge span:first-child {
            font-size: 0.9rem !important;
          }
          .about-badge span:last-child {
            font-size: 0.35rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
