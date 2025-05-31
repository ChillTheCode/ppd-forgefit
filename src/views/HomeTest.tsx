import { useNavigate, useLocation } from "react-router-dom";
import {
  Dumbbell,
  Users,
  Calendar,
  Trophy,
  Heart,
  Zap,
  Target,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  LogIn, // Added for Login button
  UserPlus, // Added for Register button icon (optional)
} from "lucide-react";
import { useState, useEffect } from "react";

const GymLanding = () => {
  const [userType, setUserType] = useState<string>("member");
  const [membershipLevel, setMembershipLevel] = useState<string>("basic");

  useEffect(() => {
    // Simulate user data loading (this would be replaced by actual auth logic)
    const timer = setTimeout(() => {
      // This is more for a logged-in state, but keeping it for context
      // For a landing page, you might check if a token exists instead
      setUserType("premium-member");
      setMembershipLevel("premium");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();
  const location = useLocation(); // Keep if you need it for other logic

  // The routes array seems unused for navigation in the current setup,
  // but handleNavigation is used for button clicks.
  // We'll add new paths for login and register.

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // You would have actual components for these routes in your App.tsx or router setup
  // e.g., <Route path="/login" element={<LoginPage />} />
  // e.g., <Route path="/register" element={<RegistrationPage />} />

return (
    <div className="bg-gradient-to-br from-black via-gray-1000 to-gray-900 text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* ... (existing gradient overlay) ... */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20" style={{background: 'linear-gradient(to right, rgba(65,186,241,0.2), rgba(65,186,241,0.1))'}}></div>
        <div className="relative py-20 md:py-32">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-700">
                <img
                  src="/FLOGO-NEW.png"
                  alt="FORGEFIT Logo"
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextSibling instanceof HTMLElement) {
                      target.nextSibling.style.display = 'block';
                    }
                  }}
                />
                {/* <Dumbbell className="text-blue-400 hidden" size={48} style={{color: '#41baf1'}} /> */}
              </div>
            </div>
            {/* Fixed: Added proper line-height and padding for gradient text */}
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
                Transform Your Body, Forge Your Future
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Unlock your potential with FORGEFIT. Experience AI-powered workout tracking, personalized strength plans, gamified motivation, and holistic wellness guidance.
              Sign up to access your personalized dashboard and start your transformation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => handleNavigation('/register')} // Pastikan handleNavigation didefinisikan
                className="text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)'}}>
                {/* <UserPlus size={22} className="mr-2" /> */}
                Join Now & Get Started
              </button>
              <button
                onClick={() => handleNavigation('/login')} // Pastikan handleNavigation didefinisikan
                className="border-2 text-white px-8 py-4 rounded-full font-bold text-lg hover:text-black transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
                style={{borderColor: '#41baf1', color: '#41baf1'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#41baf1'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}
              >
                {/* <LogIn size={22} className="mr-2" /> */}
                Member Login
              </button>
            </div>
             <button
                onClick={() => document.getElementById('membership-plans-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-6 text-sm text-gray-400 hover:text-blue-400 transition-colors"
              >
                Or, View Membership Plans
              </button>
          </div>
        </div>
      </header>

      
      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Why Choose FORGEFIT?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our integrated platform provides everything you need: from AI-driven training to complete lifestyle support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Workout Tracking & Monitoring + Valid Technique Guide */}
            <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50" style={{'--hover-border': '#41baf1'} as React.CSSProperties}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)'}}>
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors" style={{ '--hover-color': '#41baf1' } as React.CSSProperties}>
                Smart Workout System
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Log workouts automatically with our high-tech equipment. Review detailed history, get monthly evaluations, and perfect your form with AI-powered video technique validation.
              </p>
            </div>

            {/* Feature 2: Strength Calculation & Load Recommendation */}
            <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-black" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-white transition-colors">
                AI-Powered Training
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Our system calculates your strength for chosen exercises and recommends optimal sets, reps, and weights (kg). Plan your routine and let our AI guide your progression.
              </p>
            </div>

            {/* Feature 3: Motivation & Consistency */}
            <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)'}}>
                <Trophy className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                Gamified Motivation
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Stay driven with our gamified system. Earn badges, conquer challenges, and climb leaderboards as you celebrate your consistent progress and achievements.
              </p>
            </div>

            {/* Feature 4: Flexible Classes (Existing) */}
             <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-2" style={{borderColor: '#41baf1'}}>
                <Calendar className="text-blue-400" size={28} style={{color: '#41baf1'}} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                Dynamic Group Classes
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                100+ weekly classes including HIIT, Yoga, Pilates, and specialized training, integrated with your personal progress tracking.
              </p>
            </div>

            {/* Feature 5: Healthy Lifestyle Generation */}
            <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="text-black" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-white transition-colors">
                Holistic Lifestyle Hub
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Access tools for daily calorie needs, personalized menu recommendations, and optimal sleep schedules to complement your fitness journey.
              </p>
            </div>

            {/* Feature 6: Goal-Oriented Training (Existing - adaptable) */}
            <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-2" style={{borderColor: '#41baf1'}}>
                <Target className="text-blue-400" size={28} style={{color: '#41baf1'}} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                Personalized Goal Setting
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Define your objectives – weight loss, strength gain, etc. – and our platform adapts to provide tailored plans and track milestones from day one after registration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Plans (Add id for scrolling) */}
      <section id="membership-plans-section" className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Flexible membership options. Unlock more AI features and personalized coaching with Premium and Elite.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-2xl border border-gray-600 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                <div className="text-4xl font-bold mb-2" style={{color: '#41baf1'}}>Rp499.00</div>
                <div className="text-gray-400">per month</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Access to gym equipment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Basic fitness assessment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Standard workout tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Mobile app access</span>
                </li>
              </ul>
              <button onClick={() => handleNavigation('/register?plan=basic')} className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-500 transition">
                Choose Basic
              </button>
            </div>

            {/* Premium Plan */}
            <div className="p-8 rounded-2xl border-2 transform scale-105 relative text-white" style={{background: 'linear-gradient(to bottom right, #41baf1, #60c5f7)', borderColor: '#41baf1'}}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold text-white mb-2">Rp899.000</div>
                <div className="text-blue-100">per month</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-300 mr-3" size={20} />
                  <span>Everything in Basic</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-300 mr-3" size={20} />
                  <span>Unlimited group classes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-300 mr-3" size={20} />
                  <span>AI Strength & Load Recommendation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-300 mr-3" size={20} />
                  <span>Advanced Workout Monitoring</span>
                </li>
                 <li className="flex items-center">
                  <CheckCircle className="text-green-300 mr-3" size={20} />
                  <span>AI Technique Validation (Beta)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-300 mr-3" size={20} />
                  <span>Nutrition & Sleep Guidance</span>
                </li>
              </ul>
              <button onClick={() => handleNavigation('/register?plan=premium')} className="w-full bg-white py-3 rounded-lg font-bold hover:bg-gray-100 transition" style={{color: '#41baf1'}}>
                Choose Premium
              </button>
            </div>

            {/* Elite Plan */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-2xl border border-gray-600 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Elite</h3>
                <div className="text-4xl font-bold text-white mb-2">Rp1.229.000</div>
                <div className="text-gray-400">per month</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Everything in Premium</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Unlimited personal training</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Full AI Suite Access (All Features)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Recovery & spa services</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>VIP member events</span>
                </li>
              </ul>
              <button onClick={() => handleNavigation('/register?plan=elite')} className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90 transition" style={{background: '#41baf1'}}>
                Choose Elite
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Can also hint at features) */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Success Stories
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real transformations from our FORGEFIT community, powered by smart tech and support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="fill-current" size={20} style={{color: '#41baf1'}} />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "FORGEFIT's AI workout planner and technique checker were game-changers. I finally broke my plateau and feel stronger than ever!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)'}}>
                  <span className="font-bold text-white">JA</span>
                </div>
                <div>
                  <div className="font-semibold">James Allen</div>
                  <div className="text-gray-400 text-sm">Hit new PRs consistently</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="fill-current" size={20} style={{color: '#41baf1'}} />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "The calorie tracking and meal suggestions made healthy eating so simple. Combined with the fun challenges, I stayed motivated and lost 20 lbs!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-black">LD</span>
                </div>
                <div>
                  <div className="font-semibold">Laura Davis</div>
                  <div className="text-gray-400 text-sm">Achieved weight loss goals</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="fill-current" size={20} style={{color: '#41baf1'}} />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "Monitoring my progress and seeing my history all in one place, plus the supportive community, made all the difference. FORGEFIT is more than a gym."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 border-2" style={{borderColor: '#41baf1'}}>
                  <span className="font-bold" style={{color: '#41baf1'}}>RC</span>
                </div>
                <div>
                  <div className="font-semibold">Robert Chen</div>
                  <div className="text-gray-400 text-sm">Premium Member for 1 year</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* ... (Footer remains largely the same, you can add links to /login or /register here too if desired) ... */}
      <footer className="bg-black/50 py-16 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <img
                  src="/FORGEFIT_CLEAN.png" // Ensure this path is correct
                  alt="FORGEFIT Logo"
                  className="w-8 h-8 mr-3 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextSibling instanceof HTMLElement) {
                      target.nextSibling.style.display = 'inline-block';
                    }
                  }}
                />
                <Dumbbell className="mr-3 hidden" size={32} style={{color: '#41baf1'}} />
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  FORGEFIT
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Your ultimate fitness destination. Sign up to access personalized plans, track progress, and achieve your goals with our AI-powered platform.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons */}
                 <a href="#" aria-label="Facebook" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                </a>
                <a href="#" aria-label="Twitter" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.422.724-.665 1.56-.665 2.454 0 1.473.746 2.731 1.887 3.476-.705-.022-1.33-.216-1.887-.517v.076c0 2.062 1.461 3.782 3.399 4.175-.355.096-.732.147-1.126.147-.272 0-.536-.026-.793-.076.546 1.69 2.132 2.921 4.012 2.955-1.452 1.138-3.282 1.814-5.279 1.814-.343 0-.682-.02-.1017-.06C3.04 20.533 5.154 21 7.408 21c7.779 0 12.038-6.418 12.038-12.039 0-.184-.004-.367-.012-.549A8.608 8.608 0 0024 4.557z"></path></svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#membership-plans-section" onClick={(e) => { e.preventDefault(); document.getElementById('membership-plans-section')?.scrollIntoView({ behavior: 'smooth' });}} className="text-gray-400 hover:text-blue-400 transition" >Membership</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Classes</a></li> {/* Assuming you have a classes section/page */}
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Personal Training</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">About Us</a></li>
                 <li><a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="text-gray-400 hover:text-blue-400 transition">Login</a></li>
                 <li><a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="text-gray-400 hover:text-blue-400 transition">Register</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Core Features</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">AI Workout Tracking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Strength Calculation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Gamified Motivation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Technique Validation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Lifestyle Planning</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-400">
                  <MapPin className="mr-3" style={{color: '#41baf1'}} size={18} />
                  CIBIS Nine, Lantai 15 Unit B Jl. TB Simatupang No. 2, Jakarta 12560
                </li>
                <li className="flex items-center text-gray-400">
                  <Phone className="mr-3" style={{color: '#41baf1'}} size={18} />
                  (555) 123-FORGEFIT
                </li>
                <li className="flex items-center text-gray-400">
                  <Mail className="mr-3" style={{color: '#41baf1'}} size={18} />
                  info@forgefit.com
                </li>
              </ul>
              <div className="mt-6 p-4 rounded-lg border" style={{background: 'rgba(65,186,241,0.2)', borderColor: 'rgba(65,186,241,0.3)'}}>
                <h4 className="font-semibold mb-2" style={{color: '#41baf1'}}>Gym Hours</h4>
                <p className="text-sm text-gray-300">Mon-Fri: 5:00 AM - 11:00 PM</p>
                <p className="text-sm text-gray-300">Sat-Sun: 6:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} FORGEFIT. All rights reserved. |
              <a href="#" className="hover:text-blue-400 transition-colors duration-200 mx-1">Privacy Policy</a> |
              <a href="#" className="hover:text-blue-400 transition-colors duration-200 mx-1">Terms of Service</a>
            </p>
             <p className="text-xs text-gray-500 mt-2">
               Registration involves providing gender, age, height, weight, and activity level for a personalized experience.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GymLanding;