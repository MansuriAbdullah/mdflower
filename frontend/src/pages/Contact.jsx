import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const validate = () => {
    const tempErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      tempErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 3) {
      tempErrors.name = "Name must be at least 3 characters.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      tempErrors.name = "Name must contain only alphabets.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      tempErrors.email = "Please enter a valid email address.";
    }

    // Message validation
    if (!formData.message.trim()) {
      tempErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for that field on change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simulate submission
      setShowModal(true);
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setErrors({});
    }
  };

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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.8rem', color: '#1a130d' }}>YOUR NAME *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name" 
                  style={{ padding: '12px 15px', borderRadius: '10px', border: errors.name ? '1.5px solid #cc0000' : '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', width: '100%', outline: 'none', fontSize: '0.9rem' }} 
                />
                {errors.name && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{errors.name}</span>}
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.8rem', color: '#1a130d' }}>EMAIL ADDRESS *</label>
                <input 
                  type="text" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email" 
                  style={{ padding: '12px 15px', borderRadius: '10px', border: errors.email ? '1.5px solid #cc0000' : '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', width: '100%', outline: 'none', fontSize: '0.9rem' }} 
                />
                {errors.email && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{errors.email}</span>}
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.8rem', color: '#1a130d' }}>MESSAGE *</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?" 
                  rows="4" 
                  style={{ padding: '12px 15px', borderRadius: '10px', border: errors.message ? '1.5px solid #cc0000' : '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', width: '100%', outline: 'none', resize: 'none', fontSize: '0.9rem' }}
                ></textarea>
                {errors.message && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{errors.message}</span>}
            </div>
            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '15px', borderRadius: '10px', marginTop: '10px' }}>SEND MESSAGE</button>
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

      {/* Success Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ background: '#fffdf0', border: '2px solid #d4af37', borderRadius: '25px', padding: '40px 30px', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '15px' }}>✉️</span>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.8rem', color: '#1a130d', marginBottom: '15px' }}>Message Sent!</h3>
            <p style={{ color: '#5c4b22', lineHeight: '1.6', marginBottom: '25px', fontSize: '1rem' }}>
              Thank you, your message has been received! Our support team will review your message and get back to you shortly.
            </p>
            <button className="btn-gold" style={{ padding: '12px 35px', borderRadius: '50px' }} onClick={() => setShowModal(false)}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
