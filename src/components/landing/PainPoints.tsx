export default function PainPoints() {
  const painPoints = [
    {
      icon: "🔄",
      title: "Switching between Jira, Slack, Trello & Spreadsheets",
      description: "Context switching kills productivity and creates information silos"
    },
    {
      icon: "✋",
      title: "Manual task status updates",
      description: "Developers waste time updating tickets instead of writing code"
    },
    {
      icon: "🔗",
      title: "No link between Git commits & project progress",
      description: "Project managers have no visibility into actual development progress"
    },
    {
      icon: "⏰",
      title: "Missed deadlines due to lack of automation",
      description: "Important updates and reminders get lost in the noise"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Fragmented Tools Are{" "}
            <span className="text-red-600">Slowing Teams Down</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Development teams are drowning in tool complexity. The average team uses 5+ different platforms just to ship a single feature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {painPoints.map((point, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl mb-4 flex-shrink-0">
                  {point.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">23%</div>
              <div className="text-gray-600">Time lost to context switching</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">5.2</div>
              <div className="text-gray-600">Average tools per development team</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">40min</div>
              <div className="text-gray-600">Daily time spent on status updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}