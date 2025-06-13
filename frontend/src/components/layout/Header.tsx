import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

const Header: React.FC<HeaderProps> = ({
  onSearchChange,
  searchValue = "",
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-light-foreground/80 dark:bg-dark-foreground/80 backdrop-blur-md shadow-sm sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-primary group-hover:text-primary-dark dark:group-hover:text-primary-light transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="ml-2 text-lg font-semibold text-light-text dark:text-dark-text group-hover:text-primary-dark dark:group-hover:text-primary-light transition-colors">
                Управление задачами
              </span>
            </Link>
          </div>

          {onSearchChange && (
            <div className="flex-1 max-w-md mx-auto flex items-center px-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md 
                           bg-light-muted dark:bg-dark-muted 
                           text-sm text-light-text dark:text-dark-text 
                           placeholder-light-text-secondary dark:placeholder-dark-text-secondary 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                           dark:focus:border-primary transition-all duration-200"
                  placeholder="Поиск задач..."
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchValue && (
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-light-text-secondary hover:text-light-text dark:text-dark-text-secondary dark:hover:text-dark-text"
                    onClick={() => onSearchChange("")}
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-light-text-secondary hover:text-primary dark:text-dark-text-secondary dark:hover:text-primary-light hover:bg-primary/10 dark:hover:bg-primary/20 focusable transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>
            {user && (
              <div className="flex items-center">
                <span className="hidden sm:inline text-sm font-medium text-light-text dark:text-dark-text mr-3">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 border border-light-border dark:border-dark-border rounded-md text-sm font-medium 
                           text-light-text-secondary dark:text-dark-text-secondary 
                           hover:bg-light-muted dark:hover:bg-dark-muted hover:border-primary/50 dark:hover:border-primary/50
                           focusable transition-colors"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
