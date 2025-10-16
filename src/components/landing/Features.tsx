export default function Features() {
  const features = [
    {
      icon: "✅",
      title: "Project & Task Management",
      description: "Kanban boards, sprint planning, and task tracking that actually works for developers",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: "💬",
      title: "Built-in Team Chat & File Sharing",
      description: "Context-aware conversations linked to projects, tasks, and code changes",
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      icon: "🔗",
      title: "Git-Linked Automation",
      description: "Commits automatically update task status, trigger notifications, and generate reports",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: "🧾",
      title: "Invoicing & Expense Tracking",
      description: "Time tracking, client billing, and expense management integrated with your workflow",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: "📅",
      title: "Meeting Scheduling",
      description: "Google Meet integration with automatic agenda generation from project context",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      icon: "📊",
      title: "Real-Time Analytics Dashboard",
      description: "Velocity tracking, burndown charts, and team performance insights",
      gradient: "from-pink-500 to-pink-600"
    }
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              One Platform
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stop juggling multiple tools. OneDesk brings together all the features modern development teams need to ship faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} text-white text-xl mb-6`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
          ))}
        </div>

        {/* Integration Badges */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-8 text-lg">Integrates seamlessly with your existing tools</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700">GitHub</div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700">GitLab</div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700">Google Meet</div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700">Slack</div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700">Discord</div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700">Figma</div>
          </div>
        </div>
      </div>
    </section>
  )
}