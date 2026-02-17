
export default function PaymentInfo() {
  const steps = [
    {
      number: 1,
      title: 'Choose Payment Method',
      description: 'Pay via USDT (Crypto) for fast international payments, or Nigerian Naira (Bank Transfer) for local convenience.'
    },
    {
      number: 2,
      title: 'Unique Reference Generated',
      description: 'Each purchase generates a unique payment reference to track your transaction and ensure proper credit assignment.'
    },
    {
      number: 3,
      title: 'Quick Activation',
      description: 'After payment confirmation, your credit token is sent to your email. USDT: 5-30 mins • Naira: 1-24 hours.'
    }
  ];

  return (
    <section id="payment-info" className="py-24 lg:py-32 px-6 lg:px-8 bg-dark-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Illustration */}
          <div className="relative order-2 lg:order-1">
            <div className="relative bg-dark border border-gray-800 rounded-card p-12 lg:p-16 flex items-center justify-center">
              <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center">
                <i className="ri-wallet-3-line text-6xl text-accent"></i>
              </div>
              
              {/* Floating Icons */}
              <div className="absolute top-6 right-6 w-14 h-14 bg-dark-light border border-gray-800 rounded-card flex items-center justify-center animate-bounce">
                <i className="ri-shield-check-line text-2xl text-accent"></i>
              </div>
              <div className="absolute bottom-6 left-6 w-14 h-14 bg-dark-light border border-gray-800 rounded-card flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                <i className="ri-flashlight-line text-2xl text-accent"></i>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent/5 rounded-full blur-3xl -z-10"></div>
          </div>

          {/* Right - Content */}
          <div className="space-y-10 order-1 lg:order-2">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
                <i className="ri-secure-payment-line text-accent text-sm"></i>
                <span className="text-xs font-medium tracking-wide text-accent uppercase">
                  Secure Payment
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                How Payment Works
              </h2>
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-5">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-accent text-dark rounded-full flex items-center justify-center font-heading font-bold">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="px-4 py-2 bg-dark border border-gray-800 rounded-card flex items-center gap-2">
                <i className="ri-shield-check-line text-accent"></i>
                <span className="text-xs font-medium text-gray-300 whitespace-nowrap">Secure Payment</span>
              </div>
              <div className="px-4 py-2 bg-dark border border-gray-800 rounded-card flex items-center gap-2">
                <i className="ri-flashlight-line text-accent"></i>
                <span className="text-xs font-medium text-gray-300 whitespace-nowrap">Instant Delivery</span>
              </div>
              <div className="px-4 py-2 bg-dark border border-gray-800 rounded-card flex items-center gap-2">
                <i className="ri-customer-service-2-line text-accent"></i>
                <span className="text-xs font-medium text-gray-300 whitespace-nowrap">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
