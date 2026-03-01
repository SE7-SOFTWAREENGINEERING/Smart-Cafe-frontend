import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/auth.store";
import Button from "../../components/common/Button";
import { AlertCircle, Coffee, Eye, EyeOff } from "lucide-react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already authenticated (runs once on mount)
  const hasRedirected = React.useRef(false);
  React.useEffect(() => {
    if (isAuthenticated && user && user.role && !hasRedirected.current) {
      hasRedirected.current = true;
      const role = user.role.toLowerCase();
      if (role === "user") navigate("/user/dashboard");
      else if (role === "canteen_staff" || role === "canteenstaff")
        navigate("/canteen-staff/dashboard");
      else if (role === "manager") navigate("/manager/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const user = await login(email, password);

      if (user) {
        const role = user.role?.toLowerCase();
        switch (role) {
          case "user":
            navigate("/user/dashboard");
            break;
          case "canteen_staff":
          case "canteenstaff":
            navigate("/canteen-staff/dashboard");
            break;
          case "manager":
            navigate("/manager/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-brand-light p-3 rounded-full mb-4">
            <Coffee className="h-8 w-8 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to Smart Cafeteria
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 mb-6">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Email / Roll Number
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
              placeholder="e.g. 21CS001 or student@college.edu"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter your Roll Number or Official Email ID.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <Link
                to="/auth/forgot-password"
                className="text-xs text-brand hover:text-brand-hover hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-blue-600" />
            Testing Instructions
          </p>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-blue-900">Try logging in with:</span>
              <ul className="list-disc pl-5 mt-1 text-blue-700">
                <li>A <strong>Manager</strong> account <button type="button" onClick={() => {setEmail('manager@college.edu'); setPassword('password123')}} className="text-xs bg-blue-200 hover:bg-blue-300 px-2 py-0.5 rounded ml-2">Auto-fill</button></li>
                <li>OR A <strong>Staff</strong> account <button type="button" onClick={() => {setEmail('staff@college.edu'); setPassword('password123')}} className="text-xs bg-blue-200 hover:bg-blue-300 px-2 py-0.5 rounded ml-2">Auto-fill</button></li>
              </ul>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <span className="font-medium text-blue-900">Because:</span>
              <ul className="list-none space-y-1 mt-1 text-blue-700">
                <li><span className="font-medium">Walk-in Management</span> → Staff</li>
                <li><span className="font-medium">Slot Management</span> → Manager</li>
                <li><span className="font-medium">Food Waste Control</span> → Manager</li>
                <li><span className="font-medium">Queue Monitor</span> → Manager</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-brand font-medium hover:underline"
          >
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
