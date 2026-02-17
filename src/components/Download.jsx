import { DOWNLOAD_URLS } from '../config/downloads';

export default function Download() {
  return (
    <section id="download" className="py-24 lg:py-32 px-6 lg:px-8 bg-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 border border-accent/10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-accent/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-accent/10 rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
          <i className="ri-download-line text-accent text-sm"></i>
          <span className="text-xs font-medium tracking-wide text-accent uppercase">
            Download Now
          </span>
        </div>
        
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Boost Your Productivity?
        </h2>
        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          Download TypeAssist now and start automating your typing workflow.
        </p>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href={DOWNLOAD_URLS.windows.url}
            download
            className="group px-8 py-4 bg-accent text-dark rounded-card font-semibold hover:bg-accent-light transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-windows-fill text-2xl group-hover:scale-110 transition-transform"></i>
            Download for Windows
          </a>
          <a
            href={DOWNLOAD_URLS.mac.url}
            download
            className="group px-8 py-4 bg-dark-light border border-gray-700 text-white rounded-card font-semibold hover:border-accent hover:text-accent transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-apple-fill text-2xl group-hover:scale-110 transition-transform"></i>
            Download for Mac
          </a>
        </div>

        {/* System Requirements */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500">
          <div className="flex items-center gap-2">
            <i className="ri-windows-line text-lg"></i>
            <span className="text-sm">Windows 10+</span>
          </div>
          <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
          <div className="flex items-center gap-2">
            <i className="ri-apple-line text-lg"></i>
            <span className="text-sm">macOS 11+</span>
          </div>
        </div>
      </div>
    </section>
  );
}
