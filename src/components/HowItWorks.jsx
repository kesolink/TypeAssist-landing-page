
export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Paste your text',
      description: 'Copy any text you want to automate and paste it into the TypeAssist application.',
      icon: 'ri-file-copy-line'
    },
    {
      number: 2,
      title: 'Click any input field',
      description: 'Navigate to the application where you want the text typed and click on the input field.',
      icon: 'ri-cursor-line'
    },
    {
      number: 3,
      title: 'Press the hotkey',
      description: 'Simply press F9 or your custom hotkey to activate the automatic typing.',
      icon: 'ri-keyboard-box-line'
    },
    {
      number: 4,
      title: 'Watch it type',
      description: 'Sit back and watch as TypeAssist types your text perfectly, character by character.',
      icon: 'ri-magic-line'
    }
  ];

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-dark-light">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <i className="ri-arrow-right-line text-accent text-sm"></i>
            <span className="text-xs font-medium tracking-wide text-accent uppercase">
              How It Works
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Get Started in 4 Simple Steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Step Card */}
              <div className="bg-dark border border-gray-800 rounded-card p-8 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5 h-full">
                {/* Number Badge */}
                <div className="w-12 h-12 bg-accent text-dark rounded-full flex items-center justify-center mb-6 font-heading font-bold text-lg relative z-10">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-full h-32 bg-dark-light border border-gray-800 rounded-card flex items-center justify-center mb-6 group-hover:border-accent/30 transition-colors">
                  <i className={`${step.icon} text-5xl text-accent/60 group-hover:text-accent transition-colors`}></i>
                </div>

                {/* Content */}
                <h3 className="font-heading text-lg font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
