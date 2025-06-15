import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import "../index.css"; 

const BeerGlass: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <svg
    width="120"
    height="180"
    viewBox="0 0 120 180"
    className="cursor-pointer"
    onClick={onClick}
  >
    <path
      d="M30 20 Q25 20 25 40 V140 Q25 160 30 160 H90 Q95 160 95 140 V40 Q95 20 90 20 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      className="text-gray-400 dark:text-gray-500"
    />
    <rect
      x="28"
      y="140"
      width="64"
      height="116"
      fill="url(#beerGradient)"
      className="animate-fillBeer"
    />
    <circle cx="40" cy="130" r="3" fill="white" className="animate-bubble1" />
    <circle cx="60" cy="100" r="2" fill="white" className="animate-bubble2" />
    <circle cx="80" cy="120" r="4" fill="white" className="animate-bubble3" />
    <path
      d="M28 24 Q60 15 92 24"
      fill="white"
      className="text-white dark:text-gray-100 animate-foam"
    />
    <defs>
      <linearGradient id="beerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FFA500", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
  </svg>
);

const NotFoundPage: React.FC = () => {
  const handleBeerClick = () => {
    toast.success("За 404! 🍺", {
      style: {
        background: "#1f2937",
        color: "#fff",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background flex flex-col justify-center items-center px-4 text-center transition-colors duration-300">
      <motion.h1
        className="text-9xl font-bold text-primary dark:text-dark-primary"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>
      <motion.h2
        className="text-3xl font-semibold mt-4 mb-2 text-text dark:text-dark-text"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Страница не найдена
      </motion.h2>
      <motion.p
        className="text-gray-600 dark:text-gray-400 mb-4 max-w-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Страница, которую вы ищете, не существует или была перемещена.
      </motion.p>
      <motion.p
        className="text-lg font-medium text-text dark:text-dark-text mb-6 flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Можешь остаться тут и выпить пива! 🍺
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <BeerGlass onClick={handleBeerClick} />
      </motion.div>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link to="/">
          <Button>Вернуться на главную</Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;