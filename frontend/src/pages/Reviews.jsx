import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || 
                  hostname === '127.0.0.1' || 
                  hostname.startsWith('192.168.') || 
                  hostname.startsWith('10.') || 
                  hostname.startsWith('172.');
  return isLocal ? `http://${hostname}:5000` : 'https://mdflower-qvjl.vercel.app';
};
const API_URL = getApiUrl();

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    stars: 5,
    text: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/reviews/approved`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 3) {
      tempErrors.name = "Name must be at least 3 characters.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      tempErrors.name = "Name must contain only alphabets.";
    }

    if (formData.city.trim() && !/^[A-Za-z\s]+$/.test(formData.city)) {
      tempErrors.city = "City must contain only alphabets.";
    } else if (formData.city.trim() && formData.city.trim().length < 2) {
      tempErrors.city = "City must be at least 2 characters.";
    }

    if (!formData.text.trim()) {
      tempErrors.text = "Review comment is required.";
    } else if (formData.text.trim().length < 10) {
      tempErrors.text = "Review comment must be at least 10 characters.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stars' ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      await axios.post(`${API_URL}/api/reviews`, formData);
      setFormData({
        name: '',
        city: '',
        stars: 5,
        text: ''
      });
      setErrors({});
      setShowModal(true);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Duplicate reviews for continuous scrolling marquee effect
  const displayReviews = reviews.length > 0
    ? (reviews.length < 5 ? [...reviews, ...reviews, ...reviews] : [...reviews, ...reviews])
    : [];

  return (
    <div style={{ 
      padding: 'clamp(100px, 12vw, 140px) 5% 40px', 
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

      <style>{`
        .reviews-slider-container {
          width: 100%;
          position: relative;
          overflow: hidden;
          padding: 20px 0;
          z-index: 1;
        }
        .reviews-track {
          display: flex;
          align-items: stretch;
          width: max-content;
          animation: scrollRightReviewsPage 55s linear infinite;
        }
        .reviews-slider-container:hover .reviews-track {
          animation-play-state: paused;
        }
        .reviews-card-wrapper {
          width: 400px;
          margin-right: 30px;
          flex-shrink: 0;
          display: flex;
          transition: transform 0.3s ease;
        }
        .reviews-card-wrapper:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .reviews-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 45px 30px;
          border-radius: 25px;
          border: 1.5px solid rgba(138, 109, 59, 0.35);
          box-shadow: 0 10px 25px rgba(0,0,0,0.03);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .reviews-card-wrapper:hover .reviews-card {
          border-color: #8a6d3b;
          box-shadow: 0 15px 30px rgba(138, 109, 59, 0.15);
        }
        @keyframes scrollRightReviewsPage {
          0% { transform: translateX(-33.3333%); }
          100% { transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .reviews-card-wrapper {
            width: 320px;
            margin-right: 15px;
          }
          .reviews-card {
            padding: 30px 20px;
          }
        }
      `}</style>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', zIndex: 1, position: 'relative' }}>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#8a6d3b', marginTop: '15px', fontWeight: '600' }}>Loading client stories...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : displayReviews.length > 0 ? (
        <div className="reviews-slider-container">
          <div className="reviews-track">
            {displayReviews.map((rev, i) => (
              <div key={i} className="reviews-card-wrapper">
                <div className="reviews-card">
                  {/* Top accent line */}
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60px', height: '4px', background: '#d4af37', borderRadius: '0 0 10px 10px' }}></div>
                  
                  <div style={{
                    width: '85px',
                    height: '85px',
                    borderRadius: '50%',
                    margin: '15px auto 10px',
                    padding: '5px',
                    background: 'linear-gradient(45deg, #d4af37, #fdf08d)',
                    boxShadow: '0 10px 25px rgba(212, 175, 55, 0.2)',
                    overflow: 'hidden'
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
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.2)', zIndex: 1, position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ fontSize: '2.5rem' }}>✨</span>
          <p style={{ color: '#8a6d3b', marginTop: '10px', fontWeight: 'bold' }}>Be the first to share your experience!</p>
        </div>
      )}

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
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '15px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#1a130d' }}>YOUR NAME *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: errors.name ? '1.5px solid #cc0000' : '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', outline: 'none' }} />
              {errors.name && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{errors.name}</span>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#1a130d' }}>CITY</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: errors.city ? '1.5px solid #cc0000' : '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', outline: 'none' }} />
              {errors.city && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{errors.city}</span>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#1a130d' }}>RATING *</label>
              <select name="stars" value={formData.stars} onChange={handleChange} style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', outline: 'none' }}>
                <option value={5}>★★★★★ (Excellent)</option>
                <option value={4}>★★★★☆ (Very Good)</option>
                <option value={3}>★★★☆☆ (Good)</option>
                <option value={2}>★★☆☆☆ (Fair)</option>
                <option value={1}>★☆☆☆☆ (Poor)</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#1a130d' }}>YOUR REVIEW *</label>
              <textarea name="text" value={formData.text} onChange={handleChange} placeholder="Tell us about your experience with MD Flowers..." rows="3" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: errors.text ? '1.5px solid #cc0000' : '1px solid rgba(138, 109, 59, 0.3)', background: '#fffdf0', outline: 'none', resize: 'none' }}></textarea>
              {errors.text && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{errors.text}</span>}
            </div>
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '5px' }}>
              <button type="submit" disabled={isSubmitting} className="btn-gold" style={{ padding: '15px 40px', borderRadius: '50px', width: '100%', maxWidth: '300px' }}>
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT MY STORY'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ background: '#fffdf0', border: '2px solid #d4af37', borderRadius: '25px', padding: '40px 30px', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '15px' }}>🌸</span>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.8rem', color: '#1a130d', marginBottom: '15px' }}>Thank You!</h3>
            <p style={{ color: '#5c4b22', lineHeight: '1.6', marginBottom: '25px', fontSize: '1rem' }}>
              Your story has been submitted successfully. It will be visible on our website as soon as it is approved by the admin.
            </p>
            <button className="btn-gold" style={{ padding: '12px 35px', borderRadius: '50px' }} onClick={() => setShowModal(false)}>
              CLOSE
            </button>
          </div>
        </div>
      )}

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
