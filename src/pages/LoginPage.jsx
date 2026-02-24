import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    
    // Send this token to your backend to verify
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: googleToken }),
    });

    const data = await response.json();

    if (data.isNewUser) {
      // Logic for new users: Redirect to the completion form
      // You can pass the email/name from Google so the form is pre-filled
      navigate('/complete-signup', { state: { email: data.email, name: data.name } });
    } else {
      // Logic for existing users: Save token and log them in
      localStorage.setItem('authToken', data.appToken);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Log in to Creator Hub</h1>
        
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log('Login Failed')}
        />
      </div>
    </div>
  );
}