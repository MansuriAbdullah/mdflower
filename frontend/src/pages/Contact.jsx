import React from 'react';

const Contact = () => {
  return (
    <div style={{ 
      padding: 'clamp(100px, 12vw, 140px) 5% 40px', 
      minHeight: '100vh', 
      background: '#fffdf0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{ position: 'absolute', top: '15%', left: '-5%', fontSize: '12rem', opacity: 0.03, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>🌸</div>
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', fontSize: '10rem', opacity: 0.03, transform: 'rotate(20deg)', pointerEvents: 'none' }}>✨</div>

      <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '10px', fontFamily: 'Cinzel, serif' }}>Get In <span className="gold-gradient-text">Touch</span></h1>
        <p style={{ fontSize: '1rem', color: '#1a130d', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>Whether it's for a wedding, corporate event, or a personal gift, we're here to make it golden.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
        gap: '30px', 
        alignItems: 'start',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="glass-card" style={{ padding: 'clamp(15px, 4vw, 30px)', background: '#fff', border: '1px solid #8a6d3b' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '25px', color: '#1a130d', fontFamily: 'Cinzel' }}>Send a Message</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.8rem', color: '#1a130d' }}>YOUR NAME</label>
                <input type="text" placeholder="Enter your name" style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', width: '100%', outline: 'none', fontSize: '0.9rem' }} />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.8rem', color: '#1a130d' }}>EMAIL ADDRESS</label>
                <input type="email" placeholder="Enter your email" style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', width: '100%', outline: 'none', fontSize: '0.9rem' }} />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.8rem', color: '#1a130d' }}>MESSAGE</label>
                <textarea placeholder="How can we help you?" rows="4" style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', width: '100%', outline: 'none', resize: 'none', fontSize: '0.9rem' }}></textarea>
            </div>
            <button className="btn-gold" style={{ width: '100%', padding: '15px', borderRadius: '10px', marginTop: '10px' }}>SEND MESSAGE</button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { icon: '📍', title: 'Head Office', text: '4455/SF/1, Niraj House, Fuvara Gandhi Road, Ahmedabad 380001' },
            { icon: '📍', title: 'Showroom', text: 'HS Landmark-2, Aaree Denim, Narol, Ahmedabad-382405' },
            { icon: '📞', title: 'WhatsApp', text: '+91 90168 53590' },
            { icon: '✉️', title: 'Email', text: 'info@mdflowers.in' }
          ].map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: '#fff', border: '1px solid #8a6d3b' }}>
              <span style={{ fontSize: '1.5rem', background: 'rgba(212,175,55,0.1)', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>{item.icon}</span>
              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', color: '#1a130d', marginBottom: '2px', fontWeight: '900', textTransform: 'uppercase' }}>{item.title}</h3>
                <p style={{ color: '#5c4b22', fontSize: '0.8rem', lineHeight: '1.4' }}>{item.text}</p>
              </div>
            </div>
          ))}

          <div style={{ 
            marginTop: '10px', 
            padding: '20px', 
            background: 'linear-gradient(135deg, #1a130d 0%, #2c241e 100%)', 
            borderRadius: '20px', 
            boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
            textAlign: 'center',
            color: '#fff'
          }}>
            <h4 style={{ fontFamily: 'Cinzel', marginBottom: '8px', color: '#d4af37', fontSize: '1rem' }}>Studio Hours</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Mon - Sat: 9:00 AM - 7:00 PM</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Sunday: 10:00 AM - 4:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
