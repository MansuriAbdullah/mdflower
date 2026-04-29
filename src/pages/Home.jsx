import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';

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
    image: '/hero_banner.png',
    badge: 'By MD FLOWER • Est. 1998',
    heading: 'Luxury',
    headingGold: 'Floristry',
    sub: "Experience the world's most exquisite floral artistry. Each design is a masterpiece of nature, curated for your most precious moments.",
  },
  {
    id: 'hero2',
    image: '/summer_banner.png',
    badge: 'Summer Collection 2024',
    heading: 'Blooming',
    headingGold: 'Summer',
    sub: 'Discover vibrant summer arrangements that bring the warmth of the season into every celebration and space.',
  },
  {
    id: 'hero3',
    image: '/product1.png',
    badge: 'Signature Pieces',
    heading: 'Crafted',
    headingGold: 'With Love',
    sub: 'Every petal, every stem — handpicked and designed to create unforgettable floral masterpieces just for you.',
  },
  {
    id: 'hero4',
    image: '/product2.png',
    badge: 'Premium Decor',
    heading: 'Timeless',
    headingGold: 'Elegance',
    sub: 'Transform any event into a breathtaking floral experience with our premium, bespoke arrangements.',
  },
];

const Hero = () => {
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
        background: 'linear-gradient(to right, rgba(10,6,3,0.78) 0%, rgba(10,6,3,0.45) 55%, rgba(10,6,3,0.10) 100%)',
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
          <button className="btn-gold" onClick={() => window.location.href = '#collection'}>
            The Collection
          </button>
          <button style={{
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
          }}>
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

const SummerBanner = () => (
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
      <button className="btn-gold" style={{ background: '#1a130d', color: '#fff', padding: '12px 40px', fontSize: '0.8rem' }}>Explore Collection</button>
    </div>
  </section>
);

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
    <section style={{ padding: '80px 0', textAlign: 'center', overflow: 'hidden', background: '#fff' }}>
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
      `}</style>
    </section>
  );
};

const ShopByCategory = () => {
  const categories = [
    { name: 'FLOOR PLANTS', img: '/cat_floor.png' },
    { name: 'PLANTERS & VASES', img: '/cat_planters.png' },
    { name: 'HANGING PLANTS', img: '/cat_hanging.png' },
    { name: 'TABLE DÉCOR', img: '/cat_table.png' },
    { name: 'WALL DÉCOR', img: '/cat_wall.png' }
  ];

  return (
    <section style={{ padding: '60px 8%', background: '#fff', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        {categories.map((cat, i) => (
          <div key={i} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => window.location.href = '/top-selling'}>
            <div style={{ 
              width: '180px', 
              height: '180px', 
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

const TopSelling = () => {
  const categories = [
    'LED Items', 'Bunches', 'Flower Sticks',
    'Hanging', 'Loose Flower', 'Candles', 'Decorative Items'
  ];

  const [activeTab, setActiveTab] = useState('LED Items');

  const products = {
    'LED Items': [
      { id: 'led1', name: "Crystal LED Base", price: "$85", image: "/led_stands.png" },
      { id: 'led2', name: "Golden Pillar Stand", price: "$120", image: "/led_stands.png" }
    ],
    'Bunches': [
      { id: 'bunch1', name: "Velvet Rose Bunch", price: "$45", image: "/bunches.png" },
      { id: 'bunch2', name: "Spring Tulip Mix", price: "$55", image: "/bunches.png" }
    ],
    'Flower Sticks': [
      { id: 'stick1', name: "Golden Willow", price: "$30", image: "/sticks.png" },
      { id: 'stick2', name: "Silver Birch Rod", price: "$35", image: "/sticks.png" }
    ],
    'Hanging': [
      { id: 'hang1', name: "Wisteria Drape", price: "$75", image: "/hangings.png" },
      { id: 'hang2', name: "Ivy Wall Decor", price: "$65", image: "/hangings.png" }
    ],
    'Loose Flower': [
      { id: 'loose1', name: "Premium Jasmine Head", price: "$20", image: "/loose_flowers.png" },
      { id: 'loose2', name: "Royal Marigold", price: "$15", image: "/loose_flowers.png" }
    ],
    'Candles': [
      { id: 'candle1', name: "Scented Gold Wax", price: "$40", image: "/candles.png" },
      { id: 'candle2', name: "Vanilla Bloom Pillar", price: "$38", image: "/candles.png" }
    ],
    'Decorative Items': [
      { id: 'decor1', name: "Abstract Petal Vase", price: "$200", image: "/showpiece.png" },
      { id: 'decor2', name: "Swan Floral Statue", price: "$350", image: "/showpiece.png" }
    ]
  };

  return (
    <section style={{ padding: '60px 8%', background: '#fffdf0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: '10px' }}>Top Selling <span className="gold-gradient-text">Product</span></h2>
        <div style={{ width: '60px', height: '3px', background: '#d4af37', margin: '0 auto 30px' }}></div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '35px'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                padding: '10px 20px',
                borderRadius: '50px',
                border: activeTab === cat ? 'none' : '1px solid rgba(212, 175, 55, 0.4)',
                background: activeTab === cat ? '#d4af37' : 'transparent',
                color: activeTab === cat ? '#1a130d' : '#1a130d',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.75rem',
                letterSpacing: '1px',
                transition: 'all 0.4s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '30px'
      }}>
        {(products[activeTab] || []).map((p, i) => (
          <ProductCard key={i} {...p} />
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

  return (
    <section id="delivery" style={{ padding: '30px 8%' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: '#1a130d' }}>All Over India Delivery</h2>
        <p style={{ color: '#1a130d', fontSize: '1rem' }}>Across 500+ Cities & Towns</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
        gap: '20px'
      }}>
        {locations.map((loc, i) => (
          <div key={loc.name} className="glass-card" style={{
            animationDelay: `${i * 0.05}s`,
            background: '#fff',
            padding: '10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '15px', overflow: 'hidden', marginBottom: '10px' }}>
                <img src={loc.img} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <p style={{ fontWeight: '900', fontSize: '0.7rem', letterSpacing: '1px', color: '#1a130d' }}>{loc.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ContactSection = () => (
  <section id="contact" style={{ padding: '80px 8%', background: '#fffdf0' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>
      <div>
        <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '20px', lineHeight: '1' }}>Get In <span className="gold-gradient-text">Touch</span></h2>
        <p style={{ fontSize: '1.1rem', color: '#5c4b22', marginBottom: '40px' }}>Whether it's for a wedding, corporate event, or a personal gift, we're here to make it golden.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { icon: '📍', title: 'Head Office', text: '4455/SF/1, Niraj House, Fuvara Gandhi Road, Ahmedabad, Gujarat 380001' },
            { icon: '📍', title: 'Showroom', text: 'HS Landmark-2, Aaree Denim, Narol, Ahmedabad, Gujarat-382405' },
            { icon: '✉️', title: 'Email Us', text: 'info@mdflowers.in' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <span style={{ fontSize: '1.2rem', background: '#fcf9e1', padding: '10px', borderRadius: '12px' }}>{item.icon}</span>
              <div>
                <p style={{ fontWeight: 'bold', color: '#1a130d', fontSize: '0.9rem' }}>{item.title}</p>
                <p style={{ color: '#1a130d', fontSize: '0.85rem' }}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card" style={{ padding: 'clamp(25px, 5vw, 50px)' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input type="text" placeholder="Your Name" style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid #d4af37', background: 'transparent', width: '100%', outline: 'none' }} />
          <input type="email" placeholder="Your Email" style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid #d4af37', background: 'transparent', width: '100%', outline: 'none' }} />
          <textarea placeholder="Your Message" rows="4" style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid #d4af37', background: 'transparent', width: '100%', outline: 'none' }}></textarea>
          <button className="btn-gold" style={{ width: '100%' }}>Send Message</button>
        </form>
      </div>
    </div>
  </section>
);

const MagicalTreeSection = () => (
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

        <button className="btn-gold" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 30px',
          background: '#1a130d',
          color: '#fff',
          fontSize: '0.85rem'
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
  const reviews = [
    { name: "Priyanka Sharma", city: "Mumbai", img: "/client1.png", text: "Exceeded all expectations. Truly luxury at its best! The floral wall was the highlight of our event.", stars: 5 },
    { name: "Rahul Mehta", city: "Delhi", img: "/client2.png", text: "Artificial flowers that look more real than nature. Stunning quality and breathtaking detail.", stars: 5 },
    { name: "Ananya Iyer", city: "Bangalore", img: "/client3.png", text: "Changed my home. Magical aura every evening. The LED hangings are simply divine.", stars: 5 }
  ];

  return (
    <section style={{ padding: '30px 8%', background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h4 style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '15px', fontWeight: 'bold', fontSize: '0.8rem' }}>
          Customer Stories
        </h4>
        <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '15px', fontFamily: 'Playfair Display, serif' }}>What Our <span className="gold-gradient-text">Clients Say</span></h2>
        <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', margin: '0 auto' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', justifyContent: 'center' }}>
        {reviews.map((rev, i) => (
          <div key={i} className="glass-card" style={{ padding: '40px 25px', textAlign: 'center', background: '#fff', boxShadow: '0 15px 35px rgba(0,0,0,0.05)' }}>
              <div style={{
                width: '75px',
                height: '75px',
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
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <button className="btn-gold" style={{ padding: '12px 35px' }} onClick={() => window.location.href = '/reviews'}>View All Stories</button>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <section id="collection" style={{ padding: '80px 8%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', marginBottom: '15px' }}>Signature <span className="gold-gradient-text">Masterpieces</span></h2>
          <div style={{ width: '80px', height: '3px', background: '#d4af37', margin: '0 auto' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
          <ProductCard id="p1" name="Warm Bloomscape" price="$145.00" image="/warm_bloomscape.png" />
          <ProductCard id="p2" name="Grand Amour" price="$280.00" image="/grand_amour.png" />
          <ProductCard id="p3" name="Golden Aura" price="$195.00" image="/golden_aura.png" />
          <ProductCard id="p4" name="Sun Kissed" price="$110.00" image="/sun_kissed.png" />
          <ProductCard id="p5" name="Royal Blush" price="$210.00" image="/royal_blush.png" />
          <ProductCard id="p6" name="Pure Ivory" price="$165.00" image="/pure_ivory.png" />
          <ProductCard id="p7" name="Midnight Velvet" price="$185.00" image="/midnight_velvet.png" />
          <ProductCard id="p8" name="Aurora Orchids" price="$225.00" image="/aurora_orchids.png" />
          <ProductCard id="p9" name="Champagne Peonies" price="$155.00" image="/champagne_peonies.png" />
          <ProductCard id="p10" name="Enchanted Lilies" price="$140.00" image="/enchanted_lilies.png" />
        </div>
      </section>
      <SummerBanner />
      <ShopByCategory />
      <TopSelling />
      <TrustedClients />
      <IndiaDelivery />
      <Testimonials />
      <MagicalTreeSection />
      <ContactSection />
    </>
  );
};

export default Home;
