import React from 'react';
import BackgroundVideo from '../components/BackgroundVideo';

const AboutUs = () => {
  return (
    <>
      <BackgroundVideo />
      <div className="container-fluid p-0">
        <div className="background-overlay"></div>
        <div className="container text-dark bg-light bg-opacity-75 my-5 p-5 rounded-3" style={{ position: "relative", zIndex: "2" }}>
          <h1 className="text-center mb-4">About Us</h1>
          
          <section className="mb-4">
            <h2>Our Colourful Story</h2>
            <p>
              Imagine this: There I was, on holiday, surrounded by breathtaking views and inspired to capture the moment. So, I picked up a paintbrush, ready to create my masterpiece... and quickly discovered that my enthusiasm far exceeded my artistic skills. My attempt was, let's say, abstract at best and comically terrible at worst.
            </p>
            <p>
              That's when the lightbulb moment happened! Why should the joy of painting be limited to the naturally gifted? And just like that, Paint by Numbers was born out of a spectacularly failed painting attempt on a sunny beachside afternoon.
            </p>
          </section>

          <section className="mb-4">
            <h2>Our Mission: Unleash the Artist in Everyone</h2>
            <p>
              Our mission is simple but ambitious: to give everyone the chance to create something beautiful, regardless of their artistic background. We believe there's an artist in all of us, waiting for the right moment and the right tools to come to life. With Paint by Numbers, you can transform your enthusiasm into stunning pieces of art, one number at a time. It's relaxing, it's rewarding, and best of all, it's a whole lot of fun.
            </p>
          </section>

          <section className="mb-4">
            <h2>Our Values</h2>
            <ul>
              <li><strong>Laughter and Learning:</strong> We believe in laughing at our mistakes and learning from them. Every misstroke is a step towards mastery, and every giggle is a reminder not to take ourselves too seriously.</li>
              <li><strong>Community and Connection:</strong> Our community of painters is the heartbeat of our business. We share triumphs, hilarious fails, and everything in between. This isn't just about painting; it's about connecting with others on this journey.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2>Come Paint with Us!</h2>
            <p>
              Whether you're looking to unwind, spend some quality time with family, or just explore your creative side, Paint by Numbers is here to turn your painting dreams into realities. Join us, and let's create something beautiful together—one number at time.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
