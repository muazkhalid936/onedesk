export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Replace{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              5 Tools
            </span>{' '}
            with One?
          </h2>

          {/* Subtext */}
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of developers who&apos;ve streamlined their workflow and boosted productivity with OneDesk.
          </p>

          {/* Benefits List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center justify-center space-x-3 text-white">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Free 14-day trial</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Setup in 5 minutes</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-white hover:bg-gray-50 text-blue-600 px-10 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
              Start Free Trial
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all">
              Book a Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="border-t border-blue-400 pt-8">
            <p className="text-blue-200 mb-6">
              Trusted by development teams at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              {/* Company Logos Placeholder */}
              <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-white font-semibold">
                TechCorp
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-white font-semibold">
                DevFlow
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-white font-semibold">
                StartupLab
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-white font-semibold">
                CodeBase
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-white font-semibold">
                BuildTech
              </div>
            </div>
          </div>

          {/* Urgency Element */}
          <div className="mt-12 bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-2 text-yellow-300 mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Limited Time Offer</span>
            </div>
            <p className="text-white text-lg">
              Get 50% off your first 3 months when you sign up this week
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}