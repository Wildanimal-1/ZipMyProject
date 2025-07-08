import React from 'react';
import { Award, Target, Users, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About ProjectNest
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering students with high-quality, ready-to-use projects that bridge the gap 
            between theory and practical implementation.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At ProjectNest, we believe that learning by doing is the most effective way to master 
              new technologies. Our mission is to provide students with access to professionally 
              crafted projects that serve as learning tools and implementation guides.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We understand the challenges students face when trying to apply theoretical knowledge 
              to real-world projects. That's why we've created a platform that offers complete, 
              well-documented solutions that students can learn from, customize, and build upon.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Offer</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Complete source code with detailed documentation</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Step-by-step setup and installation guides</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Modern technologies and best practices</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Instant download access after purchase</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality</h3>
              <p className="text-gray-600">
                Every project is thoroughly tested and meets industry standards.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Focus</h3>
              <p className="text-gray-600">
                We focus on practical, real-world applications that matter.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                Building a supportive community of learners and creators.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                Staying ahead with the latest technologies and trends.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              ProjectNest was born from a simple observation: students often struggle to bridge 
              the gap between theoretical knowledge and practical implementation. As a B.Tech 
              student myself, I experienced firsthand the challenges of finding quality reference 
              projects that could serve as learning tools.
            </p>
            <p>
              The idea for ProjectNest emerged during my final year when I realized that many 
              of my peers were spending countless hours searching for good project examples, 
              often settling for incomplete or poorly documented solutions. I knew there had 
              to be a better way.
            </p>
            <p>
              Today, ProjectNest serves hundreds of students across various disciplines, 
              providing them with the tools they need to succeed in their academic and 
              professional journeys. Our growing collection of projects covers everything 
              from web development to data science, ensuring that there's something for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;