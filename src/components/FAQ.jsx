
import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Is TypeAssist safe?',
      answer: 'Yes. TypeAssist operates entirely on your local machine. It doesn\'t store or transmit your text anywhere, ensuring your data remains private.'
    },
    {
      question: 'Does it store my text?',
      answer: 'No. TypeAssist does not store any of your preloaded text. Everything is processed locally, and no data is saved after the typing session is complete.'
    },
    {
      question: 'What happens when my credits are finished?',
      answer: 'Once your credits are used up, you\'ll need to purchase another credit package. You can easily buy more credits from the landing page.'
    },
    {
      question: 'Does it work in all applications?',
      answer: 'TypeAssist works in virtually any application that accepts keyboard input. However, some highly secure environments might still block simulated keystrokes.'
    },
    {
      question: 'Can I cancel typing in the middle?',
      answer: 'Yes. You can press the ESC key at any time to stop the typing process immediately.'
    },
    {
      question: 'Is there a delay before typing starts?',
      answer: 'Yes. There\'s a customizable countdown timer (default: 3 seconds) to give you time to switch to your target application.'
    },
    {
      question: 'What if I face issues with installation?',
      answer: 'Check the troubleshooting section for platform-specific installation tips. For further help, contact our support team.'
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach our support team via email at support@typeassist.com. We typically respond within 24 hours.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 lg:py-32 px-6 lg:px-8 bg-dark-light">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <i className="ri-question-line text-accent text-sm"></i>
            <span className="text-xs font-medium tracking-wide text-accent uppercase">
              FAQ
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Everything You Need to Know
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-dark border rounded-card transition-all duration-300 ${
                openIndex === index ? 'border-accent/50' : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
              >
                <span className="font-heading text-base font-semibold text-white pr-8">
                  {faq.question}
                </span>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 flex-shrink-0 ${
                  openIndex === index ? 'bg-accent text-dark rotate-180' : 'bg-dark-light text-accent'
                }`}>
                  <i className={`text-lg ${openIndex === index ? 'ri-subtract-line' : 'ri-add-line'}`}></i>
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
