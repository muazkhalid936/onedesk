export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Project & Assign Roles",
      description: "Set up your project workspace, invite team members, and define roles and permissions in minutes.",
      icon: "🚀",
      color: "blue"
    },
    {
      number: "02", 
      title: "Connect GitHub and Start Working",
      description: "Link your repositories and start coding. OneDesk automatically tracks progress through your commits.",
      icon: "🔗",
      color: "indigo"
    },
    {
      number: "03",
      title: "Let Automation Handle the Rest",
      description: "Status updates, reminders, reports, and notifications happen automatically. Focus on what matters.",
      icon: "⚡",
      color: "purple"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your team up and running in under 10 minutes. No complex setup, no training required.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-6 z-0" />
                )}

                {/* Step Card */}
                <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow z-10">
                  {/* Step Number */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 text-white font-bold text-xl mb-6`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="text-4xl mb-4">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to streamline your workflow?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of developers who've already made the switch to OneDesk.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all">
                  Start Free Trial
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium transition-all">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}