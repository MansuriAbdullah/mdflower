import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { DataContext } from '../DataContext';

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

const ColorfulGlow = () => {
  const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: 20 + Math.random() * 60,
    top: 20 + Math.random() * 60,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    color: `hsl(${Math.random() * 360}, 80%, 60%)`,
    size: 5 + Math.random() * 15,
  })), []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: '50%',
            filter: 'blur(5px)',
            opacity: 0.6,
            animation: `floatGlow ${p.duration}s infinite alternate ease-in-out`,
            transition: 'all 0.5s ease',
            animationDelay: `${p.delay}s`,
          }}
        ></div>
      ))}
      <style>{`
        @keyframes floatGlow {
          from { transform: translateY(0) translateX(0); opacity: 0.4; }
          to { transform: translateY(-30px) translateX(20px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

const heroSlides = [
  {
    id: 'hero1',
    image: '/hero_flowers.png',
    badge: 'By MD FLOWER • Est. 1998',
    heading: 'Luxury',
    headingGold: 'Floristry',
    sub: "Experience the world's most exquisite floral artistry. Each design is a masterpiece of nature, curated for your most precious moments.",
  },
  {
    id: 'hero2',
    image: '/hero_led_lights.png',
    badge: 'Glow Collection',
    heading: 'Luminous',
    headingGold: 'LED Decor',
    sub: 'Brighten your special events with our premium, warm-glowing LED installations and luxury light displays.',
  },
  {
    id: 'hero3',
    image: '/hero_hanging.png',
    badge: 'Hanging Installations',
    heading: 'Enchanted',
    headingGold: 'Hangings',
    sub: 'Drape your ceilings and walls with exquisite hanging florals and lush green creepers that capture attention.',
  },
  {
    id: 'hero4',
    image: '/hero_candles.png',
    badge: 'Candlelight Luxury',
    heading: 'Timeless',
    headingGold: 'Candlelight',
    sub: 'Set the perfect mood with elegant taper candles and bespoke luxury table decor designed for intimacy.',
  },
];

const Hero = ({ onOpenVideo }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 600);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [current]);

  const slide = heroSlides[current];

  return (
    <section id="home" style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>

      {heroSlides.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${s.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: current === i ? 1 : 0,
          transform: current === i ? 'scale(1.04)' : 'scale(1)',
          transition: 'opacity 1.2s ease-in-out, transform 6s ease-in-out',
          zIndex: 0,
        }} />
      ))}

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(26,19,13,0.7) 0%, rgba(26,19,13,0.4) 55%, rgba(26,19,13,0.05) 100%)',
        zIndex: 1,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '0 8%',
        width: '100%',
        maxWidth: '700px',
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(30px)' : 'translateY(0)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>

        <div style={{
          display: 'inline-block',
          padding: '8px 22px',
          background: 'rgba(212, 175, 55, 0.18)',
          borderRadius: '50px',
          border: '1px solid rgba(212, 175, 55, 0.5)',
          marginBottom: '28px',
        }}>
          <p style={{
            fontSize: 'clamp(0.6rem, 2vw, 0.78rem)',
            textTransform: 'uppercase',
            letterSpacing: '5px',
            color: '#f0d77a',
            fontWeight: '800',
            margin: 0,
          }}>{slide.badge}</p>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 10vw, 7rem)',
          color: '#fff',
          fontWeight: '900',
          lineHeight: 0.95,
          marginBottom: '24px',
          fontFamily: 'Playfair Display, serif',
          textShadow: '0 4px 30px rgba(0,0,0,0.4)',
        }}>
          {slide.heading} <br />
          <span style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #f5e27a 50%, #c89b2a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontStyle: 'italic',
          }}>{slide.headingGold}</span>
        </h1>

        <p style={{
          fontSize: 'clamp(0.9rem, 3vw, 1.15rem)',
          color: 'rgba(255,255,255,0.85)',
          maxWidth: '520px',
          fontWeight: '400',
          lineHeight: '1.8',
          marginBottom: '44px',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}>{slide.sub}</p>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button className="btn-gold" onClick={() => {
            const el = document.getElementById('collection');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            The Collection
          </button>
          <button 
            onClick={onOpenVideo}
            style={{
              padding: '14px 30px',
              fontSize: '0.8rem',
              background: 'transparent',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.7)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
            }}
          >
            Studio Tour
          </button>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '8%',
        display: 'flex',
        gap: '12px',
        zIndex: 3,
      }}>
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: current === i ? '36px' : '10px',
              height: '10px',
              borderRadius: '6px',
              background: current === i ? '#d4af37' : 'rgba(255,255,255,0.45)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #home { padding: 0 5% !important; justify-content: center; text-align: center; }
          #home h1 { line-height: 1.1; }
          #home p { margin-left: auto; margin-right: auto; }
        }
      `}</style>
    </section>
  );
};

const SummerBanner = () => {
  const navigate = useNavigate();
  return (
    <section id="summer" style={{ padding: '60px 8%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.6rem', color: '#1a130d' }}>Summer Blooms</h3>
        <p style={{ color: '#1a130d' }}>Where summer unfolds in exquisite florals</p>
      </div>
      <div style={{
        minHeight: '320px',
        width: '100%',
        backgroundImage: `linear-gradient(rgba(255,253,240,0.1), rgba(255,253,240,0.1)), url('/summer_banner.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '25px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 8vw, 5rem)',
          color: '#1a130d',
          fontFamily: 'Playfair Display',
          letterSpacing: 'clamp(4px, 2vw, 8px)',
          marginBottom: '20px',
          textAlign: 'center',
          textShadow: '0 5px 12px rgba(255,255,255,0.5)'
        }}>
          SUMMER BLOOMS
        </h2>
        <button className="btn-gold" onClick={() => navigate('/collection')} style={{ background: '#1a130d', color: '#fff', padding: '12px 40px', fontSize: '0.8rem' }}>Explore Collection</button>
      </div>
    </section>
  );
};

const TrustedClients = () => {
  const clients = [
    { name: 'TANISHQ', img: '/trust_tanishq.png' },
    { name: 'ADANI', img: '/trust_adani.png' },
    { name: 'RELIANCE', img: '/trust_reliance.png' },
    { name: 'TATA', img: '/trust_tata.png' },
    { name: 'RAFFLES', img: '/trust_raffles.png' }
  ];

  const displayClients = [...clients, ...clients, ...clients];

  return (
    <section style={{ padding: '80px 0', textAlign: 'center', overflow: 'hidden', background: '#fffdf0' }}>
      <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', color: '#1a130d', marginBottom: '50px', fontWeight: 'bold' }}>Our Trusted Clients</h2>

      <div className="client-slider-container" style={{
        width: '100%',
        padding: '20px 0',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          animation: 'scrollLeft 25s linear infinite',
        }}>
          {displayClients.map((client, idx) => (
            <div
              key={idx}
              className="client-logo-wrapper"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '120px',
                height: '180px', /* Huge height for logos */
                minWidth: '300px', /* Huge width for logos */
                transition: 'transform 0.3s ease',
              }}
            >
              <img 
                src={client.img} 
                alt={client.name} 
                style={{ 
                  maxHeight: '130%', /* Allows image to grow larger than container slightly if needed */
                  maxWidth: '130%',
                  objectFit: 'contain',
                  transform: 'scale(1.2)', /* Scales up the image inside the container to reduce white space */
                }} 
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .client-logo-wrapper:hover {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .client-logo-wrapper {
            margin-right: 60px !important;
            height: 100px !important;
            min-width: 180px !important;
          }
        }
        @media (max-width: 480px) {
          .client-logo-wrapper {
            margin-right: 40px !important;
            height: 80px !important;
            min-width: 140px !important;
          }
        }
      `}</style>
    </section>
  );
};

const ShopByCategory = () => {
  const navigate = useNavigate();
  const categories = [
    { name: 'FLOOR PLANTS', img: '/cat_floor.png' },
    { name: 'PLANTERS & VASES', img: '/cat_planters.png' },
    { name: 'HANGING PLANTS', img: '/cat_hanging.png' },
    { name: 'TABLE DÉCOR', img: '/cat_table.png' },
    { name: 'WALL DÉCOR', img: '/cat_wall.png' },
    { name: 'HANGING FLOWERS', img: '/cat_hanging_flowers.png' },
    { name: 'LED LIGHTS', img: '/cat_led_lights.png' }
  ];

  return (
    <section style={{ padding: '60px 8%', background: '#fffdf0', textAlign: 'center' }}>
      <style>{`
        .categories-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .categories-scroll::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 1024px) {
          .categories-scroll {
            justify-content: flex-start !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: '10px' }}>Top Selling <span className="gold-gradient-text">Product</span></h2>
        <div style={{ width: '60px', height: '3px', background: '#d4af37', margin: '0 auto' }}></div>
      </div>
      <div className="categories-scroll" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(15px, 2vw, 30px)', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '20px' }}>
        {categories.map((cat, i) => (
          <div key={i} style={{ textAlign: 'center', cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/top-selling')}>
            <div style={{ 
              width: 'clamp(120px, 10vw, 160px)', 
              height: 'clamp(120px, 10vw, 160px)', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              marginBottom: '20px',
              border: '2px solid rgba(212, 175, 55, 0.2)',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: '900', 
              letterSpacing: '1px', 
              color: '#1a130d',
              borderBottom: '2px solid #1a130d',
              display: 'inline-block',
              paddingBottom: '5px'
            }}>{cat.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};


const IndiaDelivery = () => {
  const locations = [
    { name: 'MUMBAI', img: 'https://picsum.photos/seed/mumbai/400/400' },
    { name: 'DELHI', img: 'https://picsum.photos/seed/indiagate/400/400' },
    { name: 'BANGALORE', img: 'https://picsum.photos/seed/bangalore/400/400' },
    { name: 'KOLKATA', img: 'https://picsum.photos/seed/kolkata/400/400' },
    { name: 'HYDERABAD', img: 'https://picsum.photos/seed/hyderabad/400/400' },
    { name: 'JAIPUR', img: 'https://picsum.photos/seed/jaipur/400/400' },
    { name: 'AHMEDABAD', img: 'https://picsum.photos/seed/ahmedabad/400/400' },
    { name: 'CHENNAI', img: 'https://picsum.photos/seed/chennai/400/400' },
    { name: 'PUNE', img: 'https://picsum.photos/seed/pune/400/400' },
    { name: 'SURAT', img: 'https://picsum.photos/seed/surat/400/400' },
    { name: 'LUCKNOW', img: 'https://picsum.photos/seed/lucknow/400/400' },
    { name: 'AMRITSAR', img: 'https://picsum.photos/seed/amritsar/400/400' },
    { name: 'VARANASI', img: 'https://picsum.photos/seed/varanasi/400/400' },
    { name: 'KOCHI', img: 'https://picsum.photos/seed/kochi/400/400' },
    { name: 'BHOPAL', img: 'https://picsum.photos/seed/bhopal/400/400' },
    { name: 'PATNA', img: 'https://picsum.photos/seed/patna/400/400' },
  ];

  const displayLocations = [...locations, ...locations, ...locations];

  return (
    <section id="delivery" style={{ padding: '60px 0', overflow: 'hidden', background: '#fffdf0' }}>
      <style>{`
        .delivery-slider-container {
          width: 100%;
          position: relative;
          overflow: hidden;
          padding: 20px 0;
        }
        .delivery-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: scrollRight 40s linear infinite;
        }
        .delivery-slider-container:hover .delivery-track {
          animation-play-state: paused;
        }
        .delivery-card-wrapper {
          width: 250px;
          margin-right: 30px;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .delivery-card-wrapper:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .delivery-card {
          background: #fff;
          padding: 15px;
          border-radius: 25px;
          border: 1.5px solid rgba(138, 109, 59, 0.35);
          box-shadow: 0 10px 25px rgba(0,0,0,0.03);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
        }
        .delivery-card-wrapper:hover .delivery-card {
          border-color: #8a6d3b;
          box-shadow: 0 15px 30px rgba(138, 109, 59, 0.15);
        }
        @keyframes scrollRight {
          0% { transform: translateX(-33.3333%); }
          100% { transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .delivery-card-wrapper {
            width: 180px;
            margin-right: 15px;
          }
        }
      `}</style>
      <div style={{ marginBottom: '30px', textAlign: 'center', padding: '0 8%' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#1a130d', fontFamily: 'Cinzel, serif', marginBottom: '10px' }}>All Over India Delivery</h2>
        <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', margin: '0 auto 15px' }}></div>
        <p style={{ color: '#5c4b22', fontSize: '1.05rem', fontWeight: '500' }}>Across 500+ Cities & Towns</p>
      </div>
      <div className="delivery-slider-container">
        <div className="delivery-track">
          {displayLocations.map((loc, i) => (
            <div key={i} className="delivery-card-wrapper">
              <div className="delivery-card">
                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '18px', overflow: 'hidden', marginBottom: '15px' }}>
                  <img src={loc.img} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p style={{ fontWeight: '900', fontSize: '0.85rem', letterSpacing: '2px', color: '#1a130d', margin: 0, textTransform: 'uppercase' }}>{loc.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
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
    <section id="contact" style={{ 
      padding: '60px 8%', 
      background: '#fffdf0', 
      position: 'relative', 
      overflow: 'hidden',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '50px', alignItems: 'center', width: '100%', position: 'relative', zIndex: 2 }}>
        <div>
          <h4 style={{ color: '#d4af37', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '10px', fontWeight: 'bold' }}>Contact Us</h4>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', marginBottom: '15px', lineHeight: '1', color: '#1a130d', fontFamily: 'Playfair Display, serif' }}>
            Get In <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Touch</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#5c4b22', marginBottom: '30px', lineHeight: '1.6', maxWidth: '500px' }}>
            Whether it's for a wedding, corporate event, or a personal gift, we're here to make your vision golden.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: '📍', title: 'Head Office', text: '4455/SF/1, Niraj House, Fuvara Gandhi Road, Ahmedabad, Gujarat 380001' },
              { icon: '📍', title: 'Showroom', text: 'HS Landmark-2, Aaree Denim, Narol, Ahmedabad, Gujarat-382405' },
              { icon: '✉️', title: 'Email Us', text: 'info@mdflowers.in' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ 
                  fontSize: '1.2rem', 
                  background: '#fff', 
                  border: '1px solid rgba(212,175,55,0.3)',
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  color: '#d4af37',
                  boxShadow: '0 5px 15px rgba(212,175,55,0.1)'
                }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#1a130d', fontSize: '0.95rem', marginBottom: '3px' }}>{item.title}</p>
                  <p style={{ color: '#5c4b22', fontSize: '0.85rem', lineHeight: '1.4', maxWidth: '280px' }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ 
          padding: '30px 40px', 
          background: '#fff', 
          borderRadius: '15px', 
          border: '1px solid rgba(212,175,55,0.2)',
          boxShadow: '0 15px 40px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '1.5rem', color: '#1a130d', marginBottom: '25px', fontFamily: 'Playfair Display, serif' }}>Send a Message</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name" 
                style={{ 
                  padding: '12px 15px', borderRadius: '8px', border: errors.name ? '1.5px solid #cc0000' : '1px solid #e0e0e0', 
                  background: '#fcfcfc', width: '100%', outline: 'none', color: '#1a130d', fontSize: '0.95rem',
                  transition: 'border 0.3s ease'
                }} 
                onFocus={(e) => { if (!errors.name) e.target.style.border = '1px solid #d4af37'; }} 
                onBlur={(e) => { if (!errors.name) e.target.style.border = '1px solid #e0e0e0'; }}
              />
              {errors.name && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{errors.name}</span>}
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email" 
                style={{ 
                  padding: '12px 15px', borderRadius: '8px', border: errors.email ? '1.5px solid #cc0000' : '1px solid #e0e0e0', 
                  background: '#fcfcfc', width: '100%', outline: 'none', color: '#1a130d', fontSize: '0.95rem',
                  transition: 'border 0.3s ease'
                }} 
                onFocus={(e) => { if (!errors.email) e.target.style.border = '1px solid #d4af37'; }} 
                onBlur={(e) => { if (!errors.email) e.target.style.border = '1px solid #e0e0e0'; }}
              />
              {errors.email && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{errors.email}</span>}
            </div>
            <div style={{ position: 'relative' }}>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message" 
                rows="4" 
                style={{ 
                  padding: '12px 15px', borderRadius: '8px', border: errors.message ? '1.5px solid #cc0000' : '1px solid #e0e0e0', 
                  background: '#fcfcfc', width: '100%', outline: 'none', color: '#1a130d', fontSize: '0.95rem',
                  resize: 'none', transition: 'border 0.3s ease'
                }} 
                onFocus={(e) => { if (!errors.message) e.target.style.border = '1px solid #d4af37'; }} 
                onBlur={(e) => { if (!errors.message) e.target.style.border = '1px solid #e0e0e0'; }}
              ></textarea>
              {errors.message && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{errors.message}</span>}
            </div>
            <button 
              type="submit"
              style={{ 
                width: '100%', padding: '15px', background: '#d4af37', color: '#fff', 
                border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', 
                cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.3s ease',
                boxShadow: '0 8px 15px rgba(212,175,55,0.3)'
              }} 
              onMouseEnter={(e) => {e.target.style.background = '#1a130d'; e.target.style.boxShadow = '0 8px 15px rgba(26,19,13,0.3)';}} 
              onMouseLeave={(e) => {e.target.style.background = '#d4af37'; e.target.style.boxShadow = '0 8px 15px rgba(212,175,55,0.3)';}}
            >
              Send Request
            </button>
          </form>
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
    </section>
  );
};

const MagicalTreeSection = ({ onOpenVideo }) => (
  <section id="why-choose" style={{ padding: '80px 8%', background: 'linear-gradient(to bottom, #fffdf0, #fcf9e1)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>
      <div style={{ textAlign: 'left' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '20px', lineHeight: '1.2' }}>
          Why Choose <span className="gold-gradient-text">MD Flowers?</span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#1a130d', marginBottom: '30px', lineHeight: '1.6' }}>
          We’re Dedicated to Delivering Only the Best, with Unmatched Quality and a Wide Variety of Décor Solutions for Every Occasion
        </p>

        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '35px' }}>
          {[
            'High-Quality Products',
            'Worldwide Reach',
            'Diverse Collection',
            'Industry Expertise',
            'Reliable Service'
          ].map((feature, idx) => (
            <li key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1rem',
              color: '#1a130d',
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              <span style={{ color: '#d4af37', fontSize: '1.2rem' }}>✦</span>
              {feature}
            </li>
          ))}
        </ul>

        <button className="btn-gold" onClick={onOpenVideo} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 30px',
          background: '#1a130d',
          color: '#fff',
          fontSize: '0.85rem',
          cursor: 'pointer'
        }}>
          Play Video
        </button>
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <ColorfulGlow />
        <img
          src="/magical_tree.png"
          alt="Magical Tree"
          style={{
            width: '100%',
            maxWidth: '500px',
            position: 'relative',
            zIndex: 2,
            animation: 'leafColor 12s infinite ease-in-out'
          }}
        />
      </div>
    </div>
  </section>
);

const Testimonials = () => {
  const navigate = useNavigate();
  const reviews = [
    { name: "Priyanka Sharma", city: "Mumbai", img: "/client1.png", text: "Exceeded all expectations. Truly luxury at its best! The floral wall was the highlight of our event.", stars: 5 },
    { name: "Rahul Mehta", city: "Delhi", img: "/client2.png", text: "Artificial flowers that look more real than nature. Stunning quality and breathtaking detail.", stars: 5 },
    { name: "Ananya Iyer", city: "Bangalore", img: "/client3.png", text: "Changed my home. Magical aura every evening. The LED hangings are simply divine.", stars: 5 }
  ];

  const displayReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <section style={{ padding: '60px 0', background: '#fffdf0', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .testimonial-slider-container {
          width: 100%;
          position: relative;
          overflow: hidden;
          padding: 20px 0;
        }
        .testimonial-track {
          display: flex;
          align-items: stretch;
          width: max-content;
          animation: scrollRightReviews 55s linear infinite;
        }
        .testimonial-slider-container:hover .testimonial-track {
          animation-play-state: paused;
        }
        .testimonial-card-wrapper {
          width: 400px;
          margin-right: 30px;
          flex-shrink: 0;
          display: flex;
          transition: transform 0.3s ease;
        }
        .testimonial-card-wrapper:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .testimonial-card {
          background: #fff;
          padding: 40px 30px;
          border-radius: 25px;
          border: 1.5px solid rgba(138, 109, 59, 0.35);
          box-shadow: 0 10px 25px rgba(0,0,0,0.03);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .testimonial-card-wrapper:hover .testimonial-card {
          border-color: #8a6d3b;
          box-shadow: 0 15px 30px rgba(138, 109, 59, 0.15);
        }
        @keyframes scrollRightReviews {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .testimonial-card-wrapper {
            width: 320px;
            margin-right: 15px;
          }
          .testimonial-card {
            padding: 30px 20px;
          }
        }
      `}</style>
      <div style={{ textAlign: 'center', marginBottom: '40px', padding: '0 8%' }}>
        <h4 style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '15px', fontWeight: 'bold', fontSize: '0.8rem' }}>
          Customer Stories
        </h4>
        <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '15px', fontFamily: 'Playfair Display, serif' }}>What Our <span className="gold-gradient-text">Clients Say</span></h2>
        <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', margin: '0 auto' }}></div>
      </div>

      <div className="testimonial-slider-container">
        <div className="testimonial-track">
          {displayReviews.map((rev, i) => (
            <div key={i} className="testimonial-card-wrapper">
              <div className="testimonial-card">
                <div style={{
                  width: '85px',
                  height: '85px',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  overflow: 'hidden',
                  border: '3px solid #d4af37',
                  boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)'
                }}>
                  <img src={rev.img} alt={rev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ color: '#d4af37', marginBottom: '15px', fontSize: '1rem' }}>{"★".repeat(rev.stars)}</div>
                <p style={{ fontStyle: 'italic', color: '#1a130d', marginBottom: '20px', lineHeight: '1.6', fontSize: '0.9rem' }}>"{rev.text}"</p>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: '#1a130d' }}>{rev.name}</h3>
                <p style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{rev.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button className="btn-gold" style={{ padding: '12px 35px' }} onClick={() => navigate('/reviews')}>View All Stories</button>
      </div>
    </section>
  );
};

const Home = () => {
  const { signatureMasterpieces, loading } = useContext(DataContext);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', number: '', category: 'Table Décor' });
  const [inquiryErrors, setInquiryErrors] = useState({});
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  useEffect(() => {
    const hasFilled = localStorage.getItem('hasFilledInquiry');
    if (!hasFilled) {
      const timer = setTimeout(() => {
        setShowInquiryModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const validateInquiry = () => {
    const errors = {};
    if (!inquiryForm.name.trim()) {
      errors.name = "Name is required.";
    } else if (inquiryForm.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters.";
    } else if (!/^[A-Za-z\s]+$/.test(inquiryForm.name)) {
      errors.name = "Name must contain only alphabets.";
    }

    if (!inquiryForm.number.trim()) {
      errors.number = "Phone number is required.";
    } else if (!/^\d{10}$/.test(inquiryForm.number.trim())) {
      errors.number = "Please enter a valid 10-digit phone number.";
    }

    if (!inquiryForm.category) {
      errors.category = "Please select a category.";
    }

    setInquiryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({ ...prev, [name]: value }));
    if (inquiryErrors[name]) {
      setInquiryErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (validateInquiry()) {
      try {
        await axios.post(`${API_URL}/api/leads`, {
          name: inquiryForm.name,
          number: inquiryForm.number,
          category: inquiryForm.category
        });
        setInquirySubmitted(true);
        localStorage.setItem('hasFilledInquiry', 'true');
      } catch (err) {
        console.error('Error submitting inquiry lead:', err);
        setInquiryErrors(prev => ({
          ...prev,
          submit: 'Failed to submit inquiry. Please try again later.'
        }));
      }
    }
  };

  const closeInquiryModal = () => {
    setShowInquiryModal(false);
    setInquiryForm({ name: '', number: '', category: 'Table Décor' });
    setInquiryErrors({});
    setInquirySubmitted(false);
  };

  return (
    <>
      {/* Styles for Animations & Pulse effect */}
      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleUpCheck {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(212,175,55,0.7); }
          70% { box-shadow: 0 0 0 15px rgba(212,175,55,0); }
          100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); }
        }
      `}</style>

      <Hero onOpenVideo={() => setShowVideoModal(true)} />
      <section id="collection" style={{ padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <style>{`
          .masterpieces-slider-container {
            width: 100%;
            position: relative;
            overflow: hidden;
            padding: 20px 0;
          }
          .masterpieces-track {
            display: flex;
            align-items: stretch;
            width: max-content;
            animation: scrollRightMasterpieces 45s linear infinite;
          }
          .masterpieces-slider-container:hover .masterpieces-track {
            animation-play-state: paused;
          }
          .masterpieces-card-wrapper {
            width: 250px;
            margin-right: 30px;
            flex-shrink: 0;
            display: flex;
            transition: transform 0.3s ease;
          }
          .masterpieces-card-wrapper:hover {
            transform: translateY(-8px) scale(1.02);
          }
          @keyframes scrollRightMasterpieces {
            0% { transform: translateX(-25%); }
            100% { transform: translateX(0); }
          }
          @media (max-width: 768px) {
            .masterpieces-card-wrapper {
              width: 190px;
              margin-right: 15px;
            }
          }
        `}</style>
        <div style={{ textAlign: 'center', marginBottom: '40px', padding: '0 8%' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', marginBottom: '15px' }}>Signature <span className="gold-gradient-text">Masterpieces</span></h2>
          <div style={{ width: '80px', height: '3px', background: '#d4af37', margin: '0 auto' }}></div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#1a130d', fontFamily: 'Cinzel, serif', fontSize: '1.2rem', letterSpacing: '1px' }}>
            LOADING MASTERPIECES...
          </div>
        ) : signatureMasterpieces && signatureMasterpieces.length > 0 ? (
          <div className="masterpieces-slider-container">
            <div className="masterpieces-track">
              {[...signatureMasterpieces, ...signatureMasterpieces, ...signatureMasterpieces, ...signatureMasterpieces].map((item, index) => (
                <div key={`${item._id}-${index}`} className="masterpieces-card-wrapper">
                  <ProductCard 
                    id={item._id} 
                    name={item.name} 
                    price={item.price} 
                    image={item.image} 
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#1a130d', fontFamily: 'Cinzel, serif', fontSize: '1.1rem', letterSpacing: '1px' }}>
            NO SIGNATURE PIECES CONFIGURED
          </div>
        )}
      </section>
      <SummerBanner />
      <ShopByCategory />
      <TrustedClients />
      <IndiaDelivery />
      <Testimonials />
      <MagicalTreeSection onOpenVideo={() => setShowVideoModal(true)} />
      <ContactSection />


      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeInModal 0.3s ease'
        }}>
          <div style={{
            background: '#fffdf0',
            border: '2.5px solid #d4af37',
            borderRadius: '25px',
            padding: '40px 30px',
            maxWidth: '450px',
            width: '90%',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
            animation: 'slideUpModal 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            textAlign: 'center'
          }}>
            <button 
              onClick={closeInquiryModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '1.8rem',
                cursor: 'pointer',
                color: '#1a130d',
                transition: 'color 0.3s ease',
                lineHeight: 1
              }}
              onMouseEnter={(e) => e.target.style.color = '#d4af37'}
              onMouseLeave={(e) => e.target.style.color = '#1a130d'}
            >
              ×
            </button>

            {!inquirySubmitted ? (
              <>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🌸</span>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.8rem', color: '#1a130d', marginBottom: '10px' }}>Quick Inquiry</h3>
                <p style={{ color: '#5c4b22', fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' }}>
                  Please share your details to inquire about our premium collections.
                </p>

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                  {/* Name Input */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1a130d', marginBottom: '6px', display: 'block', letterSpacing: '0.5px' }}>NAME</label>
                    <input 
                      type="text" 
                      name="name"
                      value={inquiryForm.name}
                      onChange={handleInquiryChange}
                      placeholder="Enter your name" 
                      style={{ 
                        padding: '12px 15px', 
                        borderRadius: '8px', 
                        border: inquiryErrors.name ? '1.5px solid #cc0000' : '1px solid #e0e0e0', 
                        background: '#fcfcfc', 
                        width: '100%', 
                        outline: 'none', 
                        color: '#1a130d', 
                        fontSize: '0.95rem',
                        transition: 'border 0.3s ease'
                      }} 
                      onFocus={(e) => { if (!inquiryErrors.name) e.target.style.border = '1px solid #d4af37'; }} 
                      onBlur={(e) => { if (!inquiryErrors.name) e.target.style.border = '1px solid #e0e0e0'; }}
                    />
                    {inquiryErrors.name && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{inquiryErrors.name}</span>}
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1a130d', marginBottom: '6px', display: 'block', letterSpacing: '0.5px' }}>PHONE NUMBER</label>
                    <input 
                      type="tel" 
                      name="number"
                      value={inquiryForm.number}
                      onChange={handleInquiryChange}
                      placeholder="Enter 10-digit mobile number" 
                      style={{ 
                        padding: '12px 15px', 
                        borderRadius: '8px', 
                        border: inquiryErrors.number ? '1.5px solid #cc0000' : '1px solid #e0e0e0', 
                        background: '#fcfcfc', 
                        width: '100%', 
                        outline: 'none', 
                        color: '#1a130d', 
                        fontSize: '0.95rem',
                        transition: 'border 0.3s ease'
                      }} 
                      onFocus={(e) => { if (!inquiryErrors.number) e.target.style.border = '1px solid #d4af37'; }} 
                      onBlur={(e) => { if (!inquiryErrors.number) e.target.style.border = '1px solid #e0e0e0'; }}
                    />
                    {inquiryErrors.number && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{inquiryErrors.number}</span>}
                  </div>

                  {/* Category Selection Dropdown */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1a130d', marginBottom: '6px', display: 'block', letterSpacing: '0.5px' }}>INQUIRY CATEGORY</label>
                    <select 
                      name="category"
                      value={inquiryForm.category}
                      onChange={handleInquiryChange}
                      style={{ 
                        padding: '12px 15px', 
                        borderRadius: '8px', 
                        border: inquiryErrors.category ? '1.5px solid #cc0000' : '1px solid #e0e0e0', 
                        background: '#fcfcfc', 
                        width: '100%', 
                        outline: 'none', 
                        color: '#1a130d', 
                        fontSize: '0.95rem',
                        transition: 'border 0.3s ease'
                      }}
                      onFocus={(e) => { if (!inquiryErrors.category) e.target.style.border = '1px solid #d4af37'; }} 
                      onBlur={(e) => { if (!inquiryErrors.category) e.target.style.border = '1px solid #e0e0e0'; }}
                    >
                      <option value="Table Décor">Table Décor</option>
                      <option value="Floor Plants">Floor Plants</option>
                      <option value="Planters & Vases">Planters & Vases</option>
                      <option value="Hanging Plants">Hanging Plants</option>
                      <option value="Wall Décor">Wall Décor</option>
                      <option value="Hanging Flowers">Hanging Flowers</option>
                      <option value="LED Lights">LED Lights</option>
                      <option value="Wedding / Event Flowers">Wedding / Event Flowers</option>
                      <option value="Other / Custom Inquiry">Other / Custom Inquiry</option>
                    </select>
                    {inquiryErrors.category && <span style={{ color: '#cc0000', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>{inquiryErrors.category}</span>}
                  </div>

                  {inquiryErrors.submit && (
                    <span style={{ color: '#cc0000', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', margin: '10px 0', textAlign: 'center' }}>
                      {inquiryErrors.submit}
                    </span>
                  )}

                  <button 
                    type="submit"
                    style={{ 
                      width: '100%', 
                      padding: '15px', 
                      background: '#d4af37', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontSize: '1rem', 
                      fontWeight: 'bold', 
                      cursor: 'pointer', 
                      letterSpacing: '1px', 
                      textTransform: 'uppercase', 
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 15px rgba(212,175,55,0.3)',
                      marginTop: '10px'
                    }} 
                    onMouseEnter={(e) => {e.target.style.background = '#1a130d'; e.target.style.boxShadow = '0 8px 15px rgba(26,19,13,0.3)';}} 
                    onMouseLeave={(e) => {e.target.style.background = '#d4af37'; e.target.style.boxShadow = '0 8px 15px rgba(212,175,55,0.3)';}}
                  >
                    Submit Inquiry
                  </button>
                </form>
              </>
            ) : (
              <div style={{ padding: '20px 0' }}>
                <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '20px', animation: 'scaleUpCheck 0.4s ease' }}>✅</span>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.8rem', color: '#1a130d', marginBottom: '15px' }}>Inquiry Submitted!</h3>
                <p style={{ color: '#5c4b22', lineHeight: '1.6', marginBottom: '30px', fontSize: '0.95rem' }}>
                  Thank you, <strong>{inquiryForm.name}</strong>! We have received your inquiry regarding <strong>{inquiryForm.category}</strong>. Our expert styling team will contact you shortly at <strong>{inquiryForm.number}</strong>.
                </p>
                <button className="btn-gold" style={{ padding: '12px 40px', borderRadius: '50px' }} onClick={closeInquiryModal}>
                  CLOSE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showVideoModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: '#1a130d',
            border: '2px solid #d4af37',
            borderRadius: '25px',
            padding: '20px',
            maxWidth: '850px',
            width: '90%',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            textAlign: 'center'
          }}>
            <button 
              onClick={() => setShowVideoModal(false)}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                background: '#d4af37',
                color: '#1a130d',
                border: 'none',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#fff'}
              onMouseLeave={(e) => e.target.style.background = '#d4af37'}
            >
              ×
            </button>
            <h3 style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', marginBottom: '15px', fontSize: '1.5rem', letterSpacing: '2px' }}>STUDIO TOUR & ARTISTRY</h3>
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.3)' }}>
              <video 
                src="https://assets.mixkit.co/videos/preview/mixkit-flowers-in-a-vase-41662-large.mp4" 
                controls 
                autoPlay 
                loop 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
