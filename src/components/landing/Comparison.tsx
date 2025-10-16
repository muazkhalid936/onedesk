export default function Comparison() {
  const features = [
    "Project Management",
    "Task Tracking", 
    "Team Communication",
    "Git Integration",
    "Automated Status Updates",
    "Time Tracking",
    "Invoicing & Billing",
    "Meeting Scheduling",
    "Analytics Dashboard",
    "File Sharing",
    "Custom Workflows",
    "Mobile App"
  ]

  const tools = [
    { name: "OneDesk", color: "blue", values: Array(12).fill(true) },
    { name: "Jira + Slack + Trello", color: "gray", values: [true, true, true, true, false, false, false, false, true, true, true, true] },
    { name: "ClickUp", color: "gray", values: [true, true, false, false, false, true, false, false, true, true, true, true] },
    { name: "Notion", color: "gray", values: [true, true, false, false, false, false, false, false, false, true, true, true] },
    { name: "Linear", color: "gray", values: [true, true, false, true, true, false, false, false, true, false, true, true] }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose OneDesk?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how OneDesk compares to the tools you're probably using right now.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[200px]">
                      Features
                    </th>
                    {tools.map((tool, index) => (
                      <th key={index} className={`text-center py-4 px-4 font-semibold min-w-[140px] ${
                        tool.color === 'blue' ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {tool.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, featureIndex) => (
                    <tr key={featureIndex} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {feature}
                      </td>
                      {tools.map((tool, toolIndex) => (
                        <td key={toolIndex} className="py-4 px-4 text-center">
                          {tool.values[featureIndex] ? (
                            <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                              tool.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                            }`}>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Replace 5+ Tools with One Platform
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Stop paying for multiple subscriptions and dealing with integration headaches. OneDesk gives you everything in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all">
                Start Free Trial
              </button>
              <button className="border border-gray-300 hover:bg-white text-gray-700 px-8 py-3 rounded-lg font-medium transition-all">
                Calculate Savings
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}