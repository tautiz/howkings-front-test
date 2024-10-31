import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Programs from './components/Programs';
import About from './components/About';
import RequestPool from './components/RequestPool';
import Research from './components/Research';
import Apply from './components/Apply';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Programs />
      <About />
      <RequestPool />
      <Research />
      <Apply />
    </div>
  );
}

export default App;