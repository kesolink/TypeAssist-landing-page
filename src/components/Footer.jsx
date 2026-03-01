
export default function Footer() {
  return (
    <footer id="footer" className="bg-dark border-t border-gray-800 py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left - Logo & Version */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-card flex items-center justify-center">
                <i className="ri-keyboard-box-line text-xl text-dark"></i>
              </div>
              <span className="text-xl font-heading font-bold text-white">TypeAssist</span>
            </div>
            <p className="text-sm text-gray-500">Version 2.1.0</p>
            <p className="text-sm text-gray-500">
              © 2026 TypeAssist. All rights reserved.
            </p>
          </div>

          {/* Center - Links */}
          <div className="flex flex-col items-start md:items-center space-y-4">
            <a href="#" className="text-gray-400 hover:text-accent transition-colors text-sm cursor-pointer">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-accent transition-colors text-sm cursor-pointer">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-accent transition-colors text-sm cursor-pointer">
              Refund Policy
            </a>
          </div>

          {/* Right - Contact */}
          <div className="space-y-4 md:text-right">
            <p className="text-xs font-medium tracking-widest text-gray-500 uppercase">
              Contact Support
            </p>
            <a 
              href="mailto:support@typeassist.com" 
              className="text-lg font-heading font-semibold text-white hover:text-accent transition-colors block cursor-pointer"
            >
              support@typeassist.com
            </a>
            
            {/* WhatsApp Support */}
            <div className="flex md:justify-end mt-4">
              <a
                href="https://wa.me/2349126375037?text=Hello%2C%20I%20need%20support%20with%20my%20account."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-card hover:bg-green-700 transition-colors text-sm font-semibold cursor-pointer"
              >
                <i className="ri-whatsapp-line text-lg"></i>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom - Quick Link */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <a 
            href="https://readdy.ai/?ref=logo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-accent transition-colors cursor-pointer"
          >
            Powered by Keso-Tech
          </a>
        </div>
      </div>
    </footer>
  );
}
