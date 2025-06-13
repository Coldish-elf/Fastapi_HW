import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
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
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    trigger,
    clearErrors,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

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
      if (isLogin) {
        const loginErrorMessage =
          error.response?.data?.detail ||
          "Неверный логин или пароль. Попробуйте ещё раз.";
        toast.error(loginErrorMessage);
      } else {
        const detailMessage = error.response?.data?.detail;
        const isUsernameTakenError =
          detailMessage &&
          (detailMessage.toLowerCase().includes("username") ||
            detailMessage.toLowerCase().includes("имя пользователя")) &&
          (detailMessage.toLowerCase().includes("taken") ||
            detailMessage.toLowerCase().includes("exists") ||
            detailMessage.toLowerCase().includes("занято"));

        if (isUsernameTakenError) {
          setError("username", {
            type: "server",
            message: detailMessage,
          });
        } else {
          const genericRegisterMessage =
            "Ошибка регистрации. Проверьте введенные данные или попробуйте другое имя пользователя.";
          toast.error(detailMessage || genericRegisterMessage);
        }
      }
      console.error("Auth error:", error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary-light dark:from-slate-800 dark:to-dark-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-white dark:text-dark-text-DEFAULT">
          Управление задачами
        </h1>
        <h2 className="mt-2 text-center text-xl text-white dark:text-dark-text-secondary">
          {isLogin
            ? "Войдите в свою учетную запись"
            : "Создайте новую учетную запись"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-light-foreground dark:bg-dark-foreground py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Имя пользователя"
              fullWidth
              error={errors.username?.message}
              {...register("username", usernameValidationRules)}
            />

            <Input
              label="Пароль"
              type={showPassword ? "text" : "password"}
              fullWidth
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-light-text-secondary hover:text-light-text dark:text-dark-text-secondary dark:hover:text-dark-text-DEFAULT focus:outline-none transition-colors duration-150"
                  aria-label={
                    showPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                >
                  {showPassword ? (
                    <EyeIcon className="text-current" />
                  ) : (
                    <EyeSlashIcon className="text-current" />
                  )}
                </button>
              }
              {...register("password", passwordValidationRules)}
            />

            <div>
              <Button type="submit" fullWidth isLoading={isLoading}>
                {isLogin ? "Войти" : "Зарегистрироваться"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <button
              type="button"
              className="w-full text-center text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary focusable transition-colors duration-300"
              onClick={async () => {
                const newIsLogin = !isLogin;
                setIsLogin(newIsLogin);

                clearErrors(["username", "password"]);

                reset(
                  { username: "", password: "" },
                  { keepErrors: false, keepIsValid: false }
                );
              }}
            >
              {isLogin
                ? "Нет аккаунта? Зарегистрироваться"
                : "Уже есть аккаунт? Войти"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
