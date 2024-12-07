import React from 'react';
import { X, CheckCircle, Calendar, GraduationCap, Clock } from 'lucide-react';

const Apply = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">Start Your Journey</h2>
            
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Field of Interest
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="">Select your field</option>
                    <option value="cs">Computer Science</option>
                    <option value="physics">Physics</option>
                    <option value="biology">Biology</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="engineering">Engineering</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32"
                    placeholder="Tell us about your learning goals..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      <section className="bg-gray-900 py-24" id="apply">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Apply to Howkings
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Take the first step towards shaping your future in science.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="col-span-1 lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className="text-white font-semibold">Application Timeline</h3>
                      <p className="text-gray-400">Early Access: Q4 2024</p>
                      <p className="text-gray-400">Public Launch: 2025</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <GraduationCap className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className="text-white font-semibold">Requirements</h3>
                      <p className="text-gray-400">Passion for learning and dedication to personal growth</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Clock className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className="text-white font-semibold">Access</h3>
                      <p className="text-gray-400">Immediate access upon platform launch</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(true)}
                  className="mt-8 w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  Start Application
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">What You'll Get</h3>
              <div className="space-y-4">
                {[
                  'Access to premium learning modules',
                  'Direct connection with experts',
                  'Career opportunity matching',
                  'Personalized learning paths',
                  'Progress tracking tools',
                  'Community support'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Apply;