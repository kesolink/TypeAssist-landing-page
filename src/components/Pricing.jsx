import { Link } from 'react-router-dom';
import { formatNaira, formatUSDT } from '../utils/currency';

export default function Pricing() {
  const packages = [
    {
      credits: 50,
      usdtPrice: 70,
      nairaPrice: 100000,
      features: [
        'Perfect for trying out',
        'One-time payment',
        'Instant activation',
        'Email support'
      ],
      popular: false
    },
    {
      credits: 100,
      usdtPrice: 140,
      nairaPrice: 200000,
      features: [
        'Great for regular users',
        'One-time payment',
        'Instant activation',
        'Priority email support'
      ],
      popular: false
    },
    {
      credits: 500,
      usdtPrice: 180,
      nairaPrice: 250000,
      features: [
        'Best value for money',
        'One-time payment',
        'Instant activation',
        'Priority support',
        'Bulk discount included'
      ],
      popular: true
    },
    {
      credits: 1000,
      usdtPrice: 250,
      nairaPrice: 350000,
      features: [
        'For power users',
        'One-time payment',
        'Instant activation',
        'VIP support',
        'Maximum savings'
      ],
      popular: false
    }
  ];


  return (
    <section id="pricing" className="py-24 lg:py-32 px-6 lg:px-8 bg-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <i className="ri-price-tag-3-line text-accent text-sm"></i>
            <span className="text-xs font-medium tracking-wide text-accent uppercase">
              Flexible Pricing
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your Credit Package
          </h2>
          <p className="text-gray-400">
            Pay once, use anytime. No subscriptions.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-dark-light border rounded-card p-8 transition-all duration-300 hover:-translate-y-1 ${
                pkg.popular
                  ? 'border-accent shadow-lg shadow-accent/10 lg:-translate-y-2'
                  : 'border-gray-800 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5'
              }`}
            >
              {/* Best Value Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-dark px-4 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap">
                    Best Value
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="text-center mb-8">
                <h3 className="font-heading text-2xl font-bold text-white mb-2">
                  {pkg.credits} Credits
                </h3>
                <div className="mb-3">
                  <div className="font-heading text-4xl font-bold text-white mb-1">
                    {formatUSDT(pkg.usdtPrice)}
                  </div>
                  <div className="text-lg text-accent font-semibold">
                    {formatNaira(pkg.nairaPrice)}
                  </div>
                </div>
                <p className="text-xs text-gray-500">One-time payment</p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-800 mb-6"></div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <i className="ri-check-line text-lg text-accent flex-shrink-0 mt-0.5"></i>
                    <span className="text-sm text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Buy Button */}
              <Link
                to={`/payment?credits=${pkg.credits}&usdtPrice=${pkg.usdtPrice}&nairaPrice=${pkg.nairaPrice}`}
                className={`w-full py-3 rounded-card font-semibold text-sm transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center justify-center ${
                  pkg.popular
                    ? 'bg-accent text-dark hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20'
                    : 'bg-dark border border-gray-700 text-white hover:border-accent hover:text-accent'
                }`}
              >
                Buy Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
