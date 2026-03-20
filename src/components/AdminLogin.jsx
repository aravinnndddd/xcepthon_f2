import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";
import { AdminContext } from "../context/AdminContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginAdmin(email, password);
    if (result.success) {
      navigate("/admin/gallery");
    } else {
      setError(result.message || "Admin login failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-goku-dark text-white relative overflow-hidden flex items-center justify-center pt-28 pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-8 w-80 h-80 rounded-full bg-goku-orange/25 blur-3xl" />
        <div className="absolute top-1/3 -right-8 w-72 h-72 rounded-full bg-goku-yellow/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/20 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-xl bg-goku-orange/20 border border-goku-orange/50">
              <Lock className="w-6 h-6 text-goku-orange" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-center text-white/60 text-sm mb-6">
            Manage gallery and moderate images
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-white/60 mb-1.5 block">
                Admin Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full px-4 py-3 rounded-xl bg-goku-dark/60 border border-white/25 focus:outline-none focus:ring-2 focus:ring-goku-orange text-white placeholder-white/40"
                disabled={loading}
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-white/60 mb-1.5 block">
                Admin Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl bg-goku-dark/60 border border-white/25 focus:outline-none focus:ring-2 focus:ring-goku-orange text-white placeholder-white/40"
                disabled={loading}
                autoComplete="current-password"
              />
            </label>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-200"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-goku-orange to-goku-navy hover:shadow-[0_0_30px_rgba(209,66,6,0.6)] disabled:opacity-60 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Login"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 font-medium transition-all"
            >
              Back to Home
            </button>
          </form>

          <p className="text-xs text-white/40 text-center mt-6">
            Protected area. Authorization required.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
