import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { register as registerUser } from "@/services/authService";

interface IconProps {
  className?: string;
}

const EyeIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={`h-5 w-5 ${className}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeSlashIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={`h-5 w-5 ${className}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

type FormData = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: { username: "", password: "" },
  });

  useEffect(() => {
    setServerError(null);
    clearErrors(["username", "password"]);
  }, [isLogin, clearErrors]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      if (isLogin) {
        await login(data.username, data.password);
        toast.success("Вход выполнен успешно!");
        navigate("/dashboard");
      } else {
        await registerUser(data);
        toast.success("Регистрация успешна! Теперь вы можете войти.");
        setIsLogin(true);
        reset({ username: "", password: "" });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Произошла ошибка. Попробуйте снова.";
      if (isLogin) {
        toast.error(errorMessage);
      } else {
        if (
          errorMessage.toLowerCase().includes("username") &&
          (errorMessage.toLowerCase().includes("taken") ||
            errorMessage.toLowerCase().includes("exists"))
        ) {
          setError("username", { type: "server", message: errorMessage });
        } else {
          toast.error(errorMessage);
        }
      }
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const usernameValidationRules = {
    required: "Имя пользователя обязательно",
    ...(!isLogin && {
      minLength: {
        value: 5,
        message: "Имя пользователя должно содержать минимум 5 символов",
      },
    }),
  };

  const passwordValidationRules = {
    required: "Пароль обязателен",
    ...(!isLogin && {
      minLength: {
        value: 6,
        message: "Пароль должен содержать минимум 6 символов",
      },
      pattern: {
        value: /^(?=.*[A-Z])(?=.*\d).{6,}$/,
        message:
          "Пароль должен содержать минимум 6 символов, одну заглавную букву и одну цифру",
      },
    }),
  };

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const isMobile = window.innerWidth < 640;

  return (
    <div className="min-h-screen animated-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative isolate overflow-hidden">
      {!isMobile && (
        <Particles
          init={particlesInit}
          options={{
            particles: {
              number: { value: 30 },
              move: { enable: true, speed: 1 },
              size: { value: { min: 1, max: 3 } },
              opacity: { value: 0.3 },
              color: { value: "#ffffff" },
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
              },
            },
            background: {
              color: "transparent",
            },
          }}
          className="absolute inset-0 z-0 pointer-events-none"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sm:mx-auto sm:w-full sm:max-w-md z-10 relative"
      >
        <TypeAnimation
          sequence={["Управление задачами", 2000, "Организуй работу", 2000, "Достигай целей", 2000, "Повысь продуктивность", 2000]}
          wrapper="h1"
          cursor={false}
          repeat={Infinity}
          speed={50}
          className="text-center text-3xl font-bold text-white dark:text-dark-text-DEFAULT min-h-[3rem] flex items-center justify-center"
          style={{ minHeight: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-2 text-center text-xl text-white dark:text-dark-text-secondary"
        >
          {isLogin
            ? "Войдите в свою учетную запись"
            : "Создайте новую учетную запись"}
        </motion.h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 relative"
      >
        <div className="card glassmorphism py-8 px-4 sm:rounded-lg sm:px-10" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md text-sm"
                role="alert"
                aria-live="assertive"
              >
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Input
                label="Имя пользователя"
                fullWidth
                error={errors.username?.message}
                aria-describedby={
                  errors.username ? "username-error" : undefined
                }
                {...register("username", usernameValidationRules)}
              />
            </motion.div>

             <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Input
                label="Пароль"
                type={showPassword ? "text" : "password"}
                fullWidth
                error={errors.password?.message}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                rightIcon={
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-light-text-secondary hover:text-light-text dark:text-dark-text-secondary dark:hover:text-dark-text-DEFAULT focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-50 rounded p-1"
                    aria-label={
                      showPassword ? "Скрыть пароль" : "Показать пароль"
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ background: 'transparent' }}
                  >
                    {showPassword ? (
                      <EyeIcon className="text-current" />
                    ) : (
                      <EyeSlashIcon className="text-current" />
                    )}
                  </motion.button>
                }
                {...register("password", passwordValidationRules)}
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={isLoading ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: isLoading ? Infinity : 0, duration: 0.8 }}
            >
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                variant="primary"
                size="md"
              >
                {isLogin ? "Войти" : "Зарегистрироваться"}
              </Button>
            </motion.div>
          </form>

          <div className="mt-6">
            <motion.button
              type="button"
              className="w-full text-center text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-50 rounded p-2"
              onClick={() => {
                const newIsLogin = !isLogin;
                setIsLogin(newIsLogin);
                clearErrors(["username", "password"]);
                reset({ username: "", password: "" });
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isLogin ? "Перейти к регистрации" : "Перейти к входу"}
              style={{ background: 'transparent' }}
            >
              {isLogin
                ? "Нет аккаунта? Зарегистрироваться"
                : "Уже есть аккаунт? Войти"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(LoginPage);
