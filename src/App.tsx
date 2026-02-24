import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; // <-- NEW IMPORT
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  CreditCard, Wallet, Smartphone, Lock, User, 
  TrendingUp, Users, Activity, DollarSign, ArrowRight, CheckCircle2, Star, Heart, Loader2
} from 'lucide-react';

// --- Mock Data ---
const revenueData = [ { month: 'Jan', revenue: 1200 }, { month: 'Feb', revenue: 1900 }, { month: 'Mar', revenue: 2400 }, { month: 'Apr', revenue: 2100 }, { month: 'May', revenue: 3200 }, { month: 'Jun', revenue: 4500 } ];
const subscriberData = [ { month: 'Jan', subscribers: 150 }, { month: 'Feb', subscribers: 230 }, { month: 'Mar', subscribers: 310 }, { month: 'Apr', subscribers: 290 }, { month: 'May', subscribers: 420 }, { month: 'Jun', subscribers: 580 } ];
const tierData = [ { name: 'Basic ($5)', value: 400 }, { name: 'Pro ($15)', value: 150 }, { name: 'VIP ($50)', value: 30 } ];
const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b'];

// --- Components ---

const AuthView = ({ onNavigate, setGoogleData }: { onNavigate: (view: string) => void, setGoogleData: any }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false); // <-- NEW LOADING STATE

  // --- UPGRADED: Handle Google Login ---
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsAuthenticating(true); // Start loading spinner
    
    try {
      const googleToken = credentialResponse.credential;
      
      // 1. Decode the token to get the user's real info!
      const decodedToken: any = jwtDecode(googleToken);
      console.log("Welcome,", decodedToken.name);
      
      // 2. Save this data so the Complete Signup page can use it
      setGoogleData({
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        token: googleToken
      });

      // 3. Simulate backend verification delay (Replace with real fetch later)
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const isNewUser = true; // Set to false to test existing user login

      if (isNewUser) {
        onNavigate('complete-signup'); 
      } else {
        localStorage.setItem('authToken', 'fake_session_token_123');
        onNavigate('analytics'); 
      }
    } catch (error) {
      console.error("Authentication failed", error);
      alert("Something went wrong with Google Login. Please try again.");
    } finally {
      setIsAuthenticating(false); // Stop loading spinner
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FFDD00] font-sans">
      {/* Left Panel - Branding (Kept Exactly as yours) */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative">
        <div>
          <div className="mb-12">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border-2 border-black">
              <Heart className="w-6 h-6 text-black fill-black" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-black mb-12 tracking-tight">Welcome to CreatorHub</h1>
          <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] max-w-sm relative z-10 border-2 border-transparent">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">Subscriptions</h2>
            <p className="text-gray-500 text-center text-sm mb-8 px-4 leading-relaxed">A reliable way to earn recurring income from your biggest fans.</p>
            <div className="bg-[#F8F9FA] rounded-3xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="block font-bold text-gray-900 mb-1">Pro Supporter</span>
                  <span className="text-xs font-bold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">$15 / month</span>
                </div>
                <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex space-x-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-600 mb-5 font-medium">
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-gray-900"/> Exclusive weekly content</li>
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-gray-900"/> Private Discord access</li>
              </ul>
              <button className="w-full bg-[#FFDD00] text-black font-bold py-3 rounded-2xl text-sm shadow-sm hover:bg-[#F6D300] transition-colors">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] bg-white lg:rounded-l-[3rem] shadow-[-20px_0_40px_rgba(0,0,0,0.04)] flex flex-col relative z-10 min-h-screen lg:min-h-0">
        <div className="p-8 flex justify-end items-center">
          <span className="text-gray-600 text-sm mr-2 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button onClick={() => setIsLogin(!isLogin)} className="text-black font-bold text-sm hover:underline underline-offset-4">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-8 max-w-lg mx-auto w-full">
          <h2 className="text-[2.5rem] leading-tight font-bold text-gray-900 mb-3 text-center tracking-tight">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-gray-500 text-center mb-10 text-lg">
            {isLogin ? "Enter your details to access your dashboard." : "Sign up to start monetizing your content."}
          </p>

          {/* If Authenticating, show spinner. Otherwise show Google Button */}
          {isAuthenticating ? (
            <div className="w-full flex flex-col items-center justify-center mb-6 py-2">
              <Loader2 className="w-8 h-8 text-violet-600 animate-spin mb-2" />
              <p className="text-sm font-medium text-gray-600">Verifying with Google...</p>
            </div>
          ) : (
            <div className="w-full flex justify-center mb-6">
              <GoogleLogin 
                onSuccess={handleGoogleSuccess} 
                onError={() => console.log('Login Failed')} 
                theme="outline"
                size="large"
                width="100%"
              />
            </div>
          )}

          <div className="w-full flex items-center mb-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-400 font-medium">or continue with email</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form className="w-full space-y-4" onSubmit={(e) => { e.preventDefault(); onNavigate('analytics'); }}>
             {/* Note: I removed the standard email inputs to save space in this block, but you can leave yours exactly as they were! */}
             <button type="submit" className="w-full bg-[#FFDD00] hover:bg-[#F6D300] text-black font-bold py-4 px-12 rounded-full transition-transform active:scale-95 text-lg shadow-sm mt-4">
              {isLogin ? "Log in with Email" : "Sign up with Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- UPGRADED: Complete Sign Up View ---
const CompleteSignupView = ({ onNavigate, googleData }: { onNavigate: (view: string) => void, googleData: any }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Dynamic Greeting using Google Data */}
        {googleData?.picture && (
          <img 
            src={googleData.picture} 
            alt="Profile" 
            className="mx-auto h-16 w-16 rounded-full border-4 border-white shadow-md mb-4"
            referrerPolicy="no-referrer"
          />
        )}
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Hi, {googleData?.name?.split(' ')[0] || 'there'}! 👋
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 px-4">
          You successfully authenticated with Google. Just choose your Creator handle to finish setting up.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-8 shadow-sm sm:rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNavigate('analytics'); }}>
            
            {/* Disabled Email Field (Pre-filled from Google) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connected Email
              </label>
              <input
                type="email"
                disabled
                value={googleData?.email || ''}
                className="block w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 sm:text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Choose your Creator handle
              </label>
              <div className="flex rounded-xl shadow-sm overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 transition-all">
                <span className="inline-flex items-center px-4 bg-gray-50 text-gray-500 sm:text-sm border-r border-gray-300 font-medium">
                  creatorhub.com/
                </span>
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  className="flex-1 min-w-0 block w-full px-4 py-3 focus:outline-none sm:text-sm"
                  placeholder="yourname"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input id="age-verification-google" type="checkbox" required className="h-5 w-5 text-violet-600 focus:ring-violet-500 border-gray-300 rounded cursor-pointer" />
              <label htmlFor="age-verification-google" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                I confirm that I am at least 18 years old.
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
              >
                Create my account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ... (Keep your existing CheckoutView and AnalyticsView here exactly as they were) ...

// --- App Main Component ---
export default function App() {
  const [currentView, setCurrentView] = useState('auth');
  
  // --- NEW: State to pass Google data between views ---
  const [googleData, setGoogleData] = useState<any>(null);

  return (
    <>
      {currentView === 'auth' && (
        <AuthView onNavigate={setCurrentView} setGoogleData={setGoogleData} />
      )}
      
      {currentView === 'complete-signup' && (
        <CompleteSignupView onNavigate={setCurrentView} googleData={googleData} />
      )}
      
      {/* Make sure your Checkout and Analytics components are pasted below here */}
      {currentView === 'checkout' && <CheckoutView onNavigate={setCurrentView} />}
      {currentView === 'analytics' && <AnalyticsView onNavigate={setCurrentView} />}
    </>
  );
}