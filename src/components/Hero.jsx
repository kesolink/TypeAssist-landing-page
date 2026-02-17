
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-light/20 to-dark"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl"></div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-card flex items-center justify-center">
              <i className="ri-keyboard-box-line text-xl text-dark"></i>
            </div>
            <span className="text-xl font-heading font-bold text-white">TypeAssist</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('benefits')} className="text-gray-400 hover:text-accent transition-colors font-medium text-sm cursor-pointer">
              Features
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-accent transition-colors font-medium text-sm cursor-pointer">
              Pricing
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-400 hover:text-accent transition-colors font-medium text-sm cursor-pointer">
              FAQ
            </button>
            <button onClick={() => scrollToSection('footer')} className="px-5 py-2 border border-gray-700 rounded-card border-accent text-accent transition-all font-medium text-sm whitespace-nowrap cursor-pointer">
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 lg:pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span className="text-xs font-medium tracking-wide text-accent uppercase">
                Productivity Reimagined
              </span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Automate Your Typing.
              <br />
              <span className="text-accent">Save Your Time.</span>
            </h1>
            
            <p className="text-base lg:text-lg text-gray-400 leading-relaxed max-w-xl">
              TypeAssist automatically types your text into any application, even where pasting is blocked. Press a hotkey and watch it type for you!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
              <Link
                to="/payment"
                className="px-8 py-4 bg-accent text-dark rounded-card font-semibold hover:bg-accent-light transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-bank-card-line text-xl"></i>
                Buy Credits
              </Link>
              <button 
                onClick={() => scrollToSection('download')}
                className="px-8 py-4 bg-dark-light border border-gray-700 text-white rounded-card font-semibold hover:border-accent hover:text-accent transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-windows-fill text-xl"></i>
                Windows
              </button>
              <button 
                onClick={() => scrollToSection('download')}
                className="px-8 py-4 bg-dark-light border border-gray-700 text-white rounded-card font-semibold hover:border-accent hover:text-accent transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-apple-fill text-xl"></i>
                Mac
              </button>
            </div>
          </div>

          {/* Right Content - App Mockup */}
          <div className="relative">
            <div className="relative bg-dark-light border border-gray-800 rounded-card p-6 lg:p-8 transform hover:scale-[1.02] transition-transform duration-300 shadow-2xl shadow-black/40">
              <div className="space-y-6">
                {/* App Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-sm font-heading font-medium text-gray-500">TypeAssist</span>
                </div>

                {/* Text Input Area */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400">Your Text</label>
                  <div className="bg-dark rounded-card p-4 min-h-[180px] border border-gray-800">
                    <p className="text-gray-400 font-heading text-sm leading-relaxed">
                      Hello! This is a sample text that TypeAssist will automatically type for you. Just press F9 and watch the magic happen...
                      <span className="inline-block w-2 h-5 bg-accent ml-1 animate-pulse"></span>
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Hotkey:</span>
                    <span className="px-4 py-2 bg-dark border border-gray-700 text-accent rounded-lg font-heading font-bold text-sm">F9</span>
                  </div>
                  <button className="px-6 py-2 bg-accent text-dark rounded-card font-semibold text-sm hover:bg-accent-light transition-colors whitespace-nowrap cursor-pointer">
                    Start Typing
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
