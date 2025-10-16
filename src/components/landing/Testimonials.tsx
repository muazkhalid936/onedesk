export default function Testimonials() {
  const testimonials = [
    {
      quote: "OneDesk eliminated the chaos of switching between Jira, Slack, and our invoicing system. Our team's productivity increased by 40% in the first month.",
      author: "Sarah Chen",
      role: "Engineering Manager",
      company: "TechFlow Inc.",
      avatar: "SC",
      rating: 5
    },
    {
      quote: "The Git integration is a game-changer. Status updates happen automatically when we push code. No more manual updates in three different tools.",
      author: "Marcus Rodriguez", 
      role: "Senior Developer",
      company: "DevCorp",
      avatar: "MR",
      rating: 5
    },
    {
      quote: "Finally, a tool that understands developer workflows. OneDesk feels like it was built by people who actually write code for a living.",
      author: "Emily Watson",
      role: "CTO",
      company: "StartupLab",
      avatar: "EW",
      rating: 5
    }
  ]

  const stats = [
    { number: "10,000+", label: "Developers" },
    { number: "500+", label: "Teams" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "Rating" }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Built by Developers, for Developers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of development teams who've streamlined their workflow with OneDesk.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-200 max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Meet the Team Behind OneDesk
            </h3>
            <p className="text-gray-600 text-lg">
              We're a team of experienced developers and product managers who got tired of juggling multiple tools. So we built the solution we always wanted.
            </p>
          </div>

          {/* Team Avatars */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {['AK', 'JS', 'MK', 'LR', 'DT'].map((initials, index) => (
              <div key={index} className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {initials}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all">
              Join Our Community
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium transition-all">
              Read Our Story
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}