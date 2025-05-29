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
} from "lucide-react";
import { useState, useEffect } from "react";


const GymLanding = () => {
  const [userType, setUserType] = useState<string>("member");
  const [membershipLevel, setMembershipLevel] = useState<string>("basic");

  useEffect(() => {
    // Simulate user data loading
    const timer = setTimeout(() => {
      setUserType("premium-member");
      setMembershipLevel("premium");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { path: "/", label: "Home" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

   return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
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
                <Dumbbell className="text-blue-400 hidden" size={48} style={{color: '#41baf1'}} />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent inline-block" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7, #41baf1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                Transform Your Body, Transform Your Life
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Join FORGEFIT and discover the ultimate fitness experience with state-of-the-art equipment, expert trainers, and a community that motivates you to achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-2xl" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)'}}>
                Start Your Journey
              </button>
              <button
                className="border-2 text-white px-8 py-4 rounded-full font-bold text-lg hover:text-black transition-all duration-300 backdrop-blur-sm"
                style={{borderColor: '#41baf1', color: '#41baf1'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#41baf1'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}
              >
                View Membership Plans
              </button>
            </div>
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
              Experience fitness like never before with our premium facilities and cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50" style={{'--hover-border': '#41baf1'} as React.CSSProperties}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)'}}>
                <Zap className="text-white" size={28} />
              </div>
              <h3
                    className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors"
                    style={{ '--hover-color': '#41baf1' } as React.CSSProperties}
                  >
                High-Tech Equipment
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                State-of-the-art machines with smart tracking technology to monitor your progress in real-time.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-black" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-white transition-colors">
                Expert Trainers
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Certified personal trainers who create customized workout plans tailored to your fitness goals.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-2" style={{borderColor: '#41baf1'}}>
                <Calendar className="text-blue-400" size={28} style={{color: '#41baf1'}} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                Flexible Classes
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                100+ group classes weekly including HIIT, Yoga, Pilates, and specialized training programs.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="text-black" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-white transition-colors">
                Wellness Programs
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Comprehensive wellness approach including nutrition counseling, recovery therapy, and mental health support.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)'}}>
                <Trophy className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                Achievement Tracking
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Advanced progress tracking with badges, challenges, and community leaderboards to keep you motivated.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-2" style={{borderColor: '#41baf1'}}>
                <Target className="text-blue-400" size={28} style={{color: '#41baf1'}} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                Goal-Oriented Training
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Personalized training programs designed to help you achieve specific goals, from weight loss to strength building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Flexible membership options designed to fit your lifestyle and budget
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-2xl border border-gray-600 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                <div className="text-4xl font-bold mb-2" style={{color: '#41baf1'}}>$29</div>
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
                  <span>Access to locker rooms</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Mobile app access</span>
                </li>
              </ul>
              <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-500 transition">
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
                <div className="text-4xl font-bold text-white mb-2">$59</div>
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
                  <span>Personal trainer sessions (2/month)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-300 mr-3" size={20} />
                  <span>Nutrition consultation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-300 mr-3" size={20} />
                  <span>Priority booking</span>
                </li>
              </ul>
              <button className="w-full bg-white py-3 rounded-lg font-bold hover:bg-gray-100 transition" style={{color: '#41baf1'}}>
                Choose Premium
              </button>
            </div>

            {/* Elite Plan */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-2xl border border-gray-600 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Elite</h3>
                <div className="text-4xl font-bold text-white mb-2">$99</div>
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
                  <span>Advanced body composition analysis</span>
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
              <button className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90 transition" style={{background: '#41baf1'}}>
                Choose Elite
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Success Stories
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real transformations from our FORGEFIT community
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
                "FORGEFIT transformed not just my body, but my entire mindset. The trainers are incredible and the community is so supportive!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{background: 'linear-gradient(to right, #41baf1, #60c5f7)'}}>
                  <span className="font-bold text-white">SA</span>
                </div>
                <div>
                  <div className="font-semibold">Sarah Anderson</div>
                  <div className="text-gray-400 text-sm">Lost 30 lbs in 4 months</div>
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
                "The high-tech equipment and personalized training programs helped me achieve strength goals I never thought possible."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-black">MJ</span>
                </div>
                <div>
                  <div className="font-semibold">Mike Johnson</div>
                  <div className="text-gray-400 text-sm">Increased bench press by 50%</div>
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
                "The variety of classes and flexible scheduling makes it easy to stay consistent. Best investment I've made for my health!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 border-2" style={{borderColor: '#41baf1'}}>
                  <span className="font-bold" style={{color: '#41baf1'}}>EC</span>
                </div>
                <div>
                  <div className="font-semibold">Emily Chen</div>
                  <div className="text-gray-400 text-sm">Member for 2 years</div>
                </div>
              </div>
            </div>
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
                  src="/FORGEFIT_CLEAN.png"
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
                Your ultimate fitness destination with state-of-the-art facilities and expert guidance to help you achieve your goals.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:transition cursor-pointer" style={{'--hover-bg': '#41baf1'} as React.CSSProperties} onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#41baf1' }>
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:transition cursor-pointer" onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#41baf1' }>
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:transition cursor-pointer" onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#41baf1' }>
                  <span className="text-sm font-bold">i</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:transition" style={{'--hover-color': '#41baf1'} as React.CSSProperties} onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'inherit'}>Membership</a></li>
                <li><a href="#" className="text-gray-400 hover:transition" onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'inherit'}>Classes</a></li>
                <li><a href="#" className="text-gray-400 hover:transition" onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'inherit'}>Personal Training</a></li>
                <li><a href="#" className="text-gray-400 hover:transition" onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'inherit'}>Nutrition</a></li>
                <li><a href="#" className="text-gray-400 hover:transition" onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'inherit'}>About Us</a></li>
              </ul>
            </div>

                     <div>
              <h3 className="font-bold text-lg mb-6 text-white">Programs</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:transition" onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'inherit'}>Strength Training</a></li>
                <li><a href="#" className="text-gray-400 hover:transition" onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'inherit'}>Cardio Classes</a></li>
                <li><a href="#" className="text-gray-400 hover:transition" onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'inherit'}>Yoga & Pilates</a></li>
                <li><a href="#" className="text-gray-400 hover:transition" onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'inherit'}>HIIT Workouts</a></li>
                <li><a href="#" className="text-gray-400 hover:transition" onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = '#41baf1'} onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'inherit'}>Recovery Programs</a></li>
              </ul>
            </div>

        <div>
              <h3 className="font-bold text-lg mb-6 text-white">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-400">
                  <MapPin className="mr-3" style={{color: '#41baf1'}} size={18} />
                  123 Fitness Street, Gym District
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

              {/* Gym Hours */}
              <div className="mt-6 p-4 rounded-lg border" style={{background: 'rgba(65,186,241,0.2)', borderColor: 'rgba(65,186,241,0.3)'}}>
                <h4 className="font-semibold mb-2" style={{color: '#41baf1'}}>Gym Hours</h4>
                <p className="text-sm text-gray-300">Mon-Fri: 5:00 AM - 11:00 PM</p>
                <p className="text-sm text-gray-300">Sat-Sun: 6:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} FORGEFIT. All rights reserved. |
              <a href="#" className="hover:text-blue-400 transition-colors duration-200 mx-1">Privacy Policy</a> |
              <a href="#" className="hover:text-blue-400 transition-colors duration-200 mx-1">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GymLanding;