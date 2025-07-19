import { useState } from 'react';
import useAuthStore from '../Store/useAuthStore';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react'; // Only lucide-react icons used

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();

  const validateForm = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!inputs.email) {
      toast.error('Email Required');
      isValid = false;
    } else if (!emailRegex.test(inputs.email)) {
      toast.error('Invalid Email Format');
      isValid = false;
    }

    if (!inputs.password) {
      toast.error('Password Required');
      isValid = false;
    } else if (inputs.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const res = validateForm();
    if (res) {
      login(inputs);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputs({
      ...inputs,
      [id]: value
    });
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-900 min-h-screen">
      
      {/* Form Section */}
      <div className="flex justify-center items-center flex-1 p-20">
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Login</h2>

          <form noValidate className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
                value={inputs.email}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Password Field with Eye Icon */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                onChange={handleChange}
                value={inputs.password}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
              />
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-1 hidden lg:flex justify-center items-center p-10">
        <img
          src=""
          alt="Event Management"
          className="max-w-md rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
        />
      </div>

    </div>
  );
};

export default Login;
