
export default function Benefits() {
  const benefits = [
    {
      icon: 'ri-window-line',
      title: 'Works in Any App',
      description: 'TypeAssist works seamlessly in browsers, forms, chat apps, and more. No limitations on where you can use it.'
    },
    {
      icon: 'ri-time-line',
      title: 'Saves Time Instantly',
      description: 'No need to retype the same text repeatedly. Automate your workflow and focus on what matters.'
    },
    {
      icon: 'ri-lock-unlock-line',
      title: 'Bypasses Paste Restrictions',
      description: 'Works even where Ctrl+V is blocked. TypeAssist simulates real keyboard input.'
    },
    {
      icon: 'ri-speed-line',
      title: 'Adjustable Typing Speed',
      description: 'Choose how fast you want it to type. From lightning-fast to natural human speed.'
    },
    {
      icon: 'ri-keyboard-line',
      title: 'One-Button Activation',
      description: 'Activate with a single hotkey. Simple, fast, and efficient workflow.'
    },
    {
      icon: 'ri-dashboard-line',
      title: 'Runs in Background',
      description: 'Minimal footprint, runs quietly in the system tray. Always ready when you need it.'
    }
  ];

  return (
    <section id="benefits" className="py-24 lg:py-32 px-6 lg:px-8 bg-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <i className="ri-star-line text-accent text-sm"></i>
            <span className="text-xs font-medium tracking-wide text-accent uppercase">
              Why TypeAssist
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Built for Modern Productivity
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to automate your typing workflow
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-dark-light border border-gray-800 rounded-card p-8 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-card flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <i className={`${benefit.icon} text-2xl text-accent`}></i>
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-bold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
