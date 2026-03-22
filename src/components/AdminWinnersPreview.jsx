import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, LogOut, Pencil } from "lucide-react";
import Winners from "./Winners";
import { AdminContext } from "../context/AdminContext";

const AdminWinnersPreview = () => {
  const navigate = useNavigate();
  const { isAdmin, logoutAdmin, adminLoading } = useContext(AdminContext);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [adminLoading, isAdmin, navigate]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/");
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-goku-dark text-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-goku-orange" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-goku-dark text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <Link
              to="/admin/gallery"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 transition"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold">
                Winners Preview
              </h1>
              <p className="text-xs sm:text-sm text-white/65">
                Preview winners here even when public view is OFF.
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/addwinners"
              className="px-4 py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 flex items-center gap-2 transition text-sm"
            >
              <Pencil size={15} />
              Edit Winners
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-goku-orange/20 hover:bg-goku-orange/30 border border-goku-orange/50 flex items-center gap-2 transition text-sm"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <Winners forceVisible />
    </div>
  );
};

export default AdminWinnersPreview;
