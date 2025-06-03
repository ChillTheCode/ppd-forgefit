import { useNavigate, useLocation } from "react-router-dom";
import {
  Dumbbell, // Generic fitness icon, placeholder for logo if image fails
  Users,    // For Community/Collaboration, B2B
  Calendar, // For FITMAP (Workout Tracking, Scheduling)
  Trophy,   // For MOTIV8 (Gamification)
  Heart,    // For LIFESYNC (Healthy Lifestyle)
  Zap,      // For AI features (STRONGLYTICS, FORMCHECK AI)
  Target,   // For Goals, FITMAP
  CheckCircle, // For feature lists, FORMCHECK AI
  Star,     // For ratings/testimonials
  MapPin,
  Phone,
  Mail,
  LogIn,
  UserPlus,
  ChevronDown, // For FAQ toggle
  ShieldCheck, // Icon for Valid Technique / Safety
  BarChart3, // Icon for Analytics/Progress
  DollarSign, // Icon for Monetization/Pricing
  Smartphone, // Icon for App
} from "lucide-react";
import { useState, useEffect } from "react";

// Simple FAQ Item component
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-xl font-semibold text-white">{question}</h3>
        <ChevronDown
          className={`text-blue-400 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={24} style={{color: '#41baf1'}}
        />
      </button>
      {isOpen && (
        <p className="text-gray-400 mt-4 pt-4 border-t border-gray-700">
          {answer}
        </p>
      )}
    </div>
  );
};

const GymLanding = () => {
  const navigate = useNavigate();
  // const location = useLocation(); // Not used in the current structure

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const faqData = [
    {
      question: "What is ForgeFit?",
      answer:
        "ForgeFit is an AI-powered application designed to support users in their weightlifting journey. It helps achieve training goals and maintain ideal fitness and body shape by providing AI-based posture checking, personalized workout schedules, daily consumption recommendations, and sleep reminders.",
    },
    {
      question: "How does the FORMCHECK AI (Valid Technique Guidance) work?",
      answer:
        "Our FORMCHECK AI uses your device's camera (with your permission) to analyze your exercise posture in real-time. It provides immediate feedback to help you improve technique, maximize effectiveness, and crucially, prevent injuries. You can also use it to validate recorded workout videos.",
    },
    {
      question: "Is there a free trial or a free version of ForgeFit?",
      answer:
        "Yes! ForgeFit offers a Basic (Free) version with core features like Workout Tracking & Monitoring (limited), Strength Calculation & Load Recommendation, and Motivation & Consistency. New users can also enjoy a 1-month free trial of our Premium features, which unlocks Valid Technique Guidance, full Healthy Lifestyle Integration, and monthly evaluations.",
    },
    {
      question: "What are the main differences between Basic and Premium plans?",
      answer:
        "The Basic plan offers essential workout tracking, strength calculation, and motivation tools. The Premium plan unlocks advanced AI features like Valid Technique Guidance (FORMCHECK AI), comprehensive Healthy Lifestyle Integration (meal planner, sleep schedule), and detailed monthly performance evaluations.",
    },
    {
        question: "How does ForgeFit help with motivation and consistency?",
        answer:
          "ForgeFit's MOTIV8 feature uses gamification (badges, streaks, weekly challenges) and custom notifications to keep you engaged and on track with your fitness goals every day."
    },
    {
        question: "Can ForgeFit integrate with other health apps?",
        answer:
          "We are actively working on it! Our roadmap includes integration with popular platforms like Google Fit, Apple Health, and Strava to provide a more holistic view of your health data."
    }
  ];

  const features = [
    {
      icon: <Calendar className="text-white" size={28} />,
      title: "Workout Tracking & Monitoring (FITMAP)",
      description:
        "Create and monitor training plans, get AI-recommended activities & reps, log progress, and receive monthly evaluations.",
      color: "blue",
    },
    {
      icon: <Zap className="text-white" size={28} />, // Or Dumbbell
      title: "Strength Calculation & Load (STRONGLYTICS)",
      description:
        "Automatically calculates your strength and recommends appropriate sets, weights, and repetitions tailored to your abilities.",
      color: "blue",
    },
    {
      icon: <Trophy className="text-white" size={28} />,
      title: "Motivation & Consistency (MOTIV8)",
      description:
        "Boosts your motivation and consistency through notifications and gamified progress, including badges and achievements.",
      color: "blue",
    },
    {
      icon: <ShieldCheck className="text-white" size={28} />, // Or CheckCircle
      title: "Valid Technique Guidance (FORMCHECK AI)",
      description:
        "Provides correct exercise technique video guides and automatic validation via your camera to prevent injuries.",
      color: "blue",
    },
    {
      icon: <Heart className="text-white" size={28} />,
      title: "Healthy Lifestyle Integration (LIFESYNC)",
      description:
        "Supports a healthy lifestyle with a calorie calculator, AI meal recommendations, and sleep schedules based on your activity.",
      color: "blue",
    },
    {
      icon: <BarChart3 className="text-white" size={28} />,
      title: "In-Depth Progress Analytics",
      description:
        "Visualize trends in your 1RM, training volume, and recovery metrics to understand your development and when to rest.",
      color: "blue",
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-1000 to-gray-900 text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20" style={{background: 'linear-gradient(to right, rgba(65,186,241,0.2), rgba(65,186,241,0.1))'}}></div>
        <div className="relative py-20 md:py-32">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-700">
                <img
                  src="/FLOGO-NEW.png" // Assuming this is your app logo
                  alt="ForgeFit Logo"
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <Dumbbell className="text-blue-400 hidden" size={48} style={{color: '#41baf1'}} />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-relaxed">
              <span
                className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent inline-block py-2"
                style={{
                  background: 'linear-gradient(to right, #41baf1, #60c5f7, #41baf1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1.2',
                  paddingTop: '0.25rem',
                  paddingBottom: '0.25rem'
                }}
              >
                ForgeFit — Your AI Personal Trainer
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
              For smarter, safer, and more exciting workouts. ForgeFit is an all-in-one platform offering AI-driven load recommendations, real-time movement validation, comprehensive workout & nutrition planning, plus gamification to keep you consistently motivated.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => handleNavigation('/register')} // Or a link to App/Play Store
                className="text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)'}}>
                <UserPlus size={22} className="mr-2" />
                Get Started Free
              </button>
              <button
                onClick={() => document.getElementById('membership-plans-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 text-white px-8 py-4 rounded-full font-bold text-lg hover:text-black transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
                style={{borderColor: '#41baf1', color: '#41baf1'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#41baf1'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}
              >
                View Plans
              </button>
            </div>
             <button
                onClick={() => handleNavigation('/login')}
                className="mt-6 text-sm text-gray-400 hover:text-blue-400 transition-colors"
              >
                Already have an account? Login
              </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Why Choose ForgeFit?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI-powered app provides everything you need for a smarter and safer weightlifting journey, integrated into one seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50" style={{'--hover-border': '#41baf1'} as React.CSSProperties}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`} style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)'}}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors" style={{ '--hover-color': '#41baf1' } as React.CSSProperties}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section id="membership-plans-section" className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start free or unlock powerful AI features with Premium to accelerate your fitness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch"> {/* Changed to 2 cols for app plans */}
            {/* Basic Plan (Free) */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-2xl border border-gray-600 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 flex flex-col justify-between">
              <div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Basic (Free)</h3>
                  <div className="text-4xl font-bold mb-2" style={{color: '#41baf1'}}>FREE</div>
                  <div className="text-gray-400">Get Started</div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-400 mr-3" size={20} />
                    <span>Workout Tracking & Monitoring (FITMAP - Limited)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-400 mr-3" size={20} />
                    <span>Strength Calculation & Load (STRONGLYTICS)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-400 mr-3" size={20} />
                    <span>Motivation & Consistency (MOTIV8 - Basic Gamification)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-400 mr-3" size={20} />
                    <span>Healthy Lifestyle Integration (LIFESYNC - Calorie Calculator)</span>
                  </li>
                </ul>
              </div>
              <button onClick={() => handleNavigation('/register?plan=free')} className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-500 transition mt-auto">
                Sign Up for Free
              </button>
            </div>

            {/* Premium Plan */}
            <div className="p-8 rounded-2xl border-2 transform lg:scale-105 relative text-white flex flex-col justify-between" style={{background: 'linear-gradient(to bottom right, #41baf1, #60c5f7)', borderColor: '#41baf1'}}>
              <div>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-white">Premium</h3>
                  <div className="text-4xl font-bold text-white mb-1">Rp45.000<span className="text-xl">/month</span></div>
                  <div className="text-blue-100 text-sm">or Rp450.000/year (Save 2 Months!)</div>
                  <div className="text-blue-100 mt-1">1-Month Free Trial Available!</div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-300 mr-3" size={20} />
                    <span>All Basic Features, PLUS:</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-300 mr-3" size={20} />
                    <span>Valid Technique Guidance (FORMCHECK AI)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-300 mr-3" size={20} />
                    <span>LIFESYNC (AI Meal Planner & Sleep Schedule)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-300 mr-3" size={20} />
                    <span>FITMAP (Advanced Tracking & Monthly Evaluation)</span>
                  </li>
                   <li className="flex items-center">
                    <CheckCircle className="text-green-300 mr-3" size={20} />
                    <span>MOTIV8 (Full Gamification & Challenges)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-300 mr-3" size={20} />
                    <span>In-Depth Progress Analytics</span>
                  </li>
                </ul>
              </div>
              <button onClick={() => handleNavigation('/register?plan=premium')} className="w-full bg-white py-3 rounded-lg font-bold hover:bg-gray-100 transition mt-auto" style={{color: '#41baf1'}}>
                Start Free Trial
              </button>
            </div>
          </div>
           <div className="text-center mt-12">
                <h3 className="text-2xl font-semibold mb-3 text-white">Are you a Gym Owner or Coach?</h3>
                <p className="text-gray-400 mb-4 max-w-xl mx-auto">
                    Empower your clients and streamline your services with our Club License. Offer ForgeFit Premium to your members and manage their progress efficiently.
                </p>
                <button
                    onClick={() => handleNavigation('/contact?for=b2b')} // Or a dedicated B2B page
                    className="text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                    style={{background: 'linear-gradient(to right, #3b82f6, #1e40af)'}} // Different color for B2B
                >
                    <Users size={20} className="mr-2 inline-block" />
                    Learn About Club Licenses
                </button>
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Success Stories
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Hear from users who transformed their workouts with ForgeFit's AI guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="fill-current" size={20} style={{color: '#41baf1'}} />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "ForgeFit's FORMCHECK AI was a game-changer for my squats. The AI strength recommendations helped me break my plateau safely. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)'}}>
                  <span className="font-bold text-white">DN</span>
                </div>
                <div>
                  <div className="font-semibold">Dian S.</div>
                  <div className="text-gray-400 text-sm">Achieved new PR with confidence</div>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="fill-current" size={20} style={{color: '#41baf1'}} />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "The gamification and daily reminders in MOTIV8 kept me consistent. LIFESYNC's meal ideas and sleep tracking made a huge difference to my overall energy."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-black">AG</span>
                </div>
                <div>
                  <div className="font-semibold">Agus P.</div>
                  <div className="text-gray-400 text-sm">Built a consistent workout habit</div>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="fill-current" size={20} style={{color: '#41baf1'}} />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "As a beginner, FITMAP's workout plans and STRONGLYTICS' load recommendations were perfect. I feel much more confident and see real progress!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 border-2" style={{borderColor: '#41baf1'}}>
                  <span className="font-bold" style={{color: '#41baf1'}}>RI</span>
                </div>
                <div>
                  <div className="font-semibold">Rina K.</div>
                  <div className="text-gray-400 text-sm">Premium User since launch</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Find answers to common questions about the ForgeFit app, its features, and subscriptions.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqData.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            Download the ForgeFit App
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Take your fitness journey anywhere. Track workouts, view personalized plans, and stay connected with the ForgeFit community, all from your mobile device. Launching June 4, 2025!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity">
              <img src="/googleplay.svg" alt="Get it on Google Play" className="h-14 sm:h-16" /> {/* Placeholder - ensure you have this image */}
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity">
              <img src="/appstore.svg" alt="Download on the App Store" className="h-14 sm:h-16" /> {/* Placeholder - ensure you have this image */}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-16 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <img
                  src="/FORGEFIT_CLEAN.png" // Assuming this is your app logo
                  alt="ForgeFit Logo"
                  className="w-8 h-8 mr-3 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                     const fallback = target.nextSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'inline-block';
                  }}
                />
                 <Dumbbell className="mr-3 hidden" size={32} style={{color: '#41baf1'}} />
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  FORGEFIT
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Your AI personal trainer for smarter, safer, and more exciting workouts. Achieve your fitness goals with ForgeFit.
              </p>
              <div className="flex space-x-4">
                {/* Replace # with actual social media links */}
                <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </a>
                <a href="https://tiktok.com" aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-black transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.47.03-4.8-.73-6.66-2.48-1.85-1.75-2.83-4.1-2.83-6.5.01-1.45.35-2.82 1.02-4.11.63-1.22 1.52-2.31 2.65-3.14.6-.43 1.28-.78 1.96-1.06.02-1.51.02-3.01-.01-4.52.01-.12.01-.23.02-.35.28-1.09.98-2.01 2.06-2.62.97-.54 2.12-.86 3.31-.87Zm-.11 7.05c-.51-.02-1.01-.07-1.52-.11S9.9 6.91 9.42 6.87c-.47-.03-.95-.03-1.42-.02-.1.53-.18 1.06-.28 1.59-.29 1.55-.25 3.14.04 4.71.28 1.57.8 3.08 1.54 4.46.71 1.32 1.66 2.49 2.81 3.45.79.65 1.71 1.17 2.71 1.52.97.33 2 .45 3.03.37.99-.08 1.97-.34 2.88-.77.87-.41 1.66-.98 2.35-1.67.68-.68 1.25-1.48 1.69-2.37.41-.84.68-1.76.81-2.71.09-.74.12-1.48.11-2.23-.03-1.44-.3-2.87-.85-4.2-.52-1.26-1.27-2.41-2.22-3.38-.93-.95-2.05-1.7-3.31-2.22-.62-.25-1.27-.42-1.93-.53-.48-.08-.96-.12-1.44-.14-.02-.84.02-1.68-.04-2.52Z"/></svg>
                </a>
                 <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.411 0 5.825 0 12s.488 8.589 4.385 8.816c3.6.245 11.626.246 15.23 0C23.512 20.589 24 18.175 24 12s-.488-8.589-4.385-8.816zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#features-section" onClick={(e) => { e.preventDefault(); document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });}} className="text-gray-400 hover:text-blue-400 transition" >Features</a></li>
                <li><a href="#membership-plans-section" onClick={(e) => { e.preventDefault(); document.getElementById('membership-plans-section')?.scrollIntoView({ behavior: 'smooth' });}} className="text-gray-400 hover:text-blue-400 transition" >Pricing</a></li>
                <li><a href="#faq-section" onClick={(e) => { e.preventDefault(); document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });}} className="text-gray-400 hover:text-blue-400 transition">FAQ</a></li>
                <li><a href="/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }} className="text-gray-400 hover:text-blue-400 transition">Blog</a></li>
                <li><a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="text-gray-400 hover:text-blue-400 transition">Login</a></li>
                <li><a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="text-gray-400 hover:text-blue-400 transition">Register</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Core Features</h3>
              <ul className="space-y-3">
                <li><a href="#features-section" onClick={(e) => { e.preventDefault(); document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });}} className="text-gray-400 hover:text-blue-400 transition">FITMAP: Workout Tracking</a></li>
                <li><a href="#features-section" onClick={(e) => { e.preventDefault(); document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });}} className="text-gray-400 hover:text-blue-400 transition">STRONGLYTICS: AI Strength Calc</a></li>
                <li><a href="#features-section" onClick={(e) => { e.preventDefault(); document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });}} className="text-gray-400 hover:text-blue-400 transition">MOTIV8: Gamified Motivation</a></li>
                <li><a href="#features-section" onClick={(e) => { e.preventDefault(); document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });}} className="text-gray-400 hover:text-blue-400 transition">FORMCHECK AI: Technique Validation</a></li>
                <li><a href="#features-section" onClick={(e) => { e.preventDefault(); document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });}} className="text-gray-400 hover:text-blue-400 transition">LIFESYNC: Lifestyle Integration</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-400">
                  <MapPin className="mr-3 flex-shrink-0" style={{color: '#41baf1'}} size={18} />
                  <span>CIBIS Nine, Lantai 15 Unit B<br/>Jl. TB Simatupang No. 2, Jakarta 12560</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <Mail className="mr-3 flex-shrink-0" style={{color: '#41baf1'}} size={18} />
                  <a href="mailto:info@forgefit.com" className="hover:text-blue-400">info@forgefit.com</a>
                </li>
                 <li className="flex items-center text-gray-400">
                  <Phone className="mr-3 flex-shrink-0" style={{color: '#41baf1'}} size={18} />
                  <span>+6287780842345</span>
                </li>
              </ul>
                 <div className="mt-6 p-4 rounded-lg border" style={{background: 'rgba(65,186,241,0.1)', borderColor: 'rgba(65,186,241,0.3)'}}>
                    <h4 className="font-semibold mb-2" style={{color: '#41baf1'}}>Data for Research</h4>
                    <p className="text-sm text-gray-300">
                        ForgeFit provides anonymized datasets for research institutions and universities.
                        <a href="/contact?for=research" className="text-blue-400 hover:underline ml-1">Learn More</a>
                    </p>
                </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} ForgeFit. All rights reserved. |
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/privacy-policy');}} className="hover:text-blue-400 transition-colors duration-200 mx-1">Privacy Policy</a> |
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/terms-of-service');}} className="hover:text-blue-400 transition-colors duration-200 mx-1">Terms of Service</a>
            </p>
             <p className="text-xs text-gray-500 mt-2">
              To provide a personalized experience, registration involves providing information like gender, age, height, weight, and activity level.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GymLanding;