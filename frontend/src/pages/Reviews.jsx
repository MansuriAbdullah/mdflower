import React from 'react';

const Reviews = () => {
  const reviews = [
    { name: "Priyanka Sharma", city: "Mumbai", img: "/client1.png", text: "The flower wall for my wedding exceeded all expectations. It was the centerpiece.", stars: 5 },
    { name: "Rahul Mehta", city: "Delhi", img: "/client2.png", text: "Premium quality artificial flowers that look more real than nature itself. Simply breathtaking.", stars: 5 },
    { name: "Ananya Iyer", city: "Bangalore", img: "/client3.png", text: "MD Flowers has changed my home. Their LED hangings bring a magical aura.", stars: 5 },
    { name: "Vikram Singh", city: "Jaipur", img: "https://picsum.photos/seed/v/100/100", text: "Exceptional craftsmanship. The attention to detail is unparalleled.", stars: 5 },
    { name: "Sanya Kapoor", city: "Chandigarh", img: "https://picsum.photos/seed/s/100/100", text: "Ordered custom floral drapes for a gala. Flawless design.", stars: 5 },
    { name: "Meera Das", city: "Kolkata", img: "https://picsum.photos/seed/m/100/100", text: "The loose jasmine heads are so fresh-looking. Perfect for ceremonies.", stars: 5 },
    { name: "Karan Johar", city: "Mumbai", img: "https://picsum.photos/seed/k/100/100", text: "The best floral decor in India. Period.", stars: 5 },
    { name: "Deepika P.", city: "Bangalore", img: "https://picsum.photos/seed/d/100/100", text: "Elegant, luxury, and classy. Exactly what I wanted.", stars: 5 },
  ];

  return (
    <div style={{ 
      padding: '40px 8% 40px', 
      minHeight: '100vh', 
      background: '#fffdf0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{ position: 'absolute', top: '10%', right: '-5%', fontSize: '15rem', opacity: 0.05, transform: 'rotate(15deg)', pointerEvents: 'none' }}>🌸</div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', fontSize: '12rem', opacity: 0.05, transform: 'rotate(-20deg)', pointerEvents: 'none' }}>✨</div>

      <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
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
        }}>CLIENT VOICES</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '20px', fontFamily: 'Cinzel, serif' }}>What Our <span className="gold-gradient-text">Clients Say</span></h1>
        <p style={{ fontSize: '1.1rem', color: '#1a130d', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6', opacity: 0.8 }}>
          Discover why MD Flower is the preferred choice for India's most prestigious events and luxury spaces.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 30vw, 380px), 1fr))',
        gap: '20px',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {reviews.map((rev, i) => (
          <div 
            key={i} 
            className="reveal-anim" 
            style={{ 
              animationDelay: `${i * 0.1}s`,
              transition: '0.4s ease'
            }}
          >
            <div className="glass-card" style={{ 
              padding: '45px 30px', 
              textAlign: 'center', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #8a6d3b',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60px', height: '4px', background: '#d4af37', borderRadius: '0 0 10px 10px' }}></div>
              
              <div style={{
                width: '85px',
                height: '85px',
                borderRadius: '50%',
                margin: '15px auto 10px',
                padding: '5px',
                background: 'linear-gradient(45deg, #d4af37, #fdf08d)',
                boxShadow: '0 10px 25px rgba(212, 175, 55, 0.2)'
              }}>
                <img src={rev.img} alt={rev.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '2px solid white' }} />
              </div>

              <div style={{ color: '#d4af37', marginBottom: '10px', fontSize: '1rem', letterSpacing: '2px' }}>
                {"★".repeat(rev.stars)}
              </div>
              
              <p style={{ 
                fontStyle: 'italic', 
                color: '#2c241e', 
                marginBottom: '15px', 
                lineHeight: '1.6', 
                fontSize: '0.9rem',
                flexGrow: 1
              }}>
                "{rev.text}"
              </p>
              
              <div style={{ marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: '#1a130d', fontFamily: 'Montserrat, sans-serif', fontWeight: '900' }}>{rev.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div style={{ width: '15px', height: '1px', background: '#d4af37' }}></div>
                  <p style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{rev.city}</p>
                  <div style={{ width: '15px', height: '1px', background: '#d4af37' }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Submission Form Section */}
      <div id="submit-story" className="reveal-anim" style={{ marginTop: '60px', animationDelay: '0.4s' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '10px' }}>Share Your <span className="gold-gradient-text">Experience</span></h2>
          <p style={{ color: '#1a130d', opacity: 0.7 }}>Tell us your story and help us inspire others.</p>
        </div>

        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          background: '#fff', 
          padding: 'clamp(20px, 8vw, 40px)', 
          borderRadius: '30px',
          border: '1px solid #8a6d3b',
          boxShadow: '0 20px 40px rgba(138, 109, 59, 0.1)',
          position: 'relative'
        }}>
          <form style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#1a130d' }}>YOUR NAME</label>
              <input type="text" placeholder="Enter your full name" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#1a130d' }}>CITY</label>
              <input type="text" placeholder="e.g. Mumbai" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#1a130d' }}>RATING</label>
              <select style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', outline: 'none' }}>
                <option>★★★★★ (Excellent)</option>
                <option>★★★★☆ (Very Good)</option>
                <option>★★★☆☆ (Good)</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#1a130d' }}>YOUR REVIEW</label>
              <textarea placeholder="Tell us about your experience with MD Flowers..." rows="3" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', outline: 'none', resize: 'none' }}></textarea>
            </div>
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '5px' }}>
              <button className="btn-gold" style={{ padding: '15px 40px', borderRadius: '50px', width: '100%', maxWidth: '300px' }}>SUBMIT MY STORY</button>
            </div>
          </form>
        </div>
      </div>

      <div className="reveal-anim" style={{ marginTop: '60px', animationDelay: '0.6s' }}>
        <div style={{
          padding: '40px 30px',
          background: 'linear-gradient(135deg, #1a130d 0%, #2c241e 100%)',
          borderRadius: '40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
          color: '#fff'
        }}>
          <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', marginBottom: '15px', color: '#fff', fontFamily: 'Cinzel' }}>Be Part of Our <span className="gold-gradient-text">Legacy</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '25px', maxWidth: '600px', margin: '0 auto 25px', fontSize: '1rem' }}>
              We've helped thousands of clients bring their vision to life. Let us help you create something extraordinary.
            </p>
            <button className="btn-gold" style={{ padding: '15px 40px', fontSize: '0.9rem', borderRadius: '50px' }} onClick={() => document.getElementById('submit-story').scrollIntoView({ behavior: 'smooth' })}>SHARE YOUR EXPERIENCE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
