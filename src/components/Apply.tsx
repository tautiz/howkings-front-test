import React, { useState } from 'react';
import { CheckCircle, Calendar, GraduationCap, Clock } from 'lucide-react';

const Apply = () => {
  const [selectedProgram, setSelectedProgram] = useState('undergraduate');

  return (
    <section className="bg-gray-900 py-24" id="apply">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Apply to Howkings
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Take the first step towards shaping the future. Join our community of innovators and explorers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="flex space-x-4 mb-8">
                {['undergraduate', 'graduate', 'doctorate'].map((program) => (
                  <button
                    key={program}
                    onClick={() => setSelectedProgram(program)}
                    className={`px-4 py-2 rounded-full capitalize ${
                      selectedProgram === program
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    } transition-colors duration-300`}
                  >
                    {program}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="text-white font-semibold">Application Deadlines</h3>
                    <p className="text-gray-400">Early Decision: October 15, 2024</p>
                    <p className="text-gray-400">Regular Decision: January 15, 2025</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <GraduationCap className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="text-white font-semibold">Requirements</h3>
                    <p className="text-gray-400">Academic transcripts, letters of recommendation, and portfolio</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Clock className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="text-white font-semibold">Processing Time</h3>
                    <p className="text-gray-400">4-6 weeks after submission</p>
                  </div>
                </div>
              </div>

              <button className="mt-8 w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                Start Application
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Application Checklist</h3>
            <div className="space-y-4">
              {[
                'Complete online application form',
                'Submit academic transcripts',
                'Provide letters of recommendation',
                'Submit standardized test scores',
                'Complete virtual interview',
                'Pay application fee'
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
  );
};

export default Apply;