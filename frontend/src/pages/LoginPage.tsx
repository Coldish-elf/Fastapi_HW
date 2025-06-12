import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { register as registerUser } from '@/services/authService';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
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
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    setLoginError(null);
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(data.username, data.password);
        toast.success('Вход выполнен успешно!');
        navigate('/dashboard');
      } else {
        await registerUser(data);
        toast.success('Регистрация успешна! Теперь вы можете войти.');
        setIsLogin(true);
        reset();
      }
    } catch (error: any) {
      if (isLogin) {
        setLoginError('Неверный логин или пароль. Попробуйте ещё раз');
      } else {
        const errorMessage = error.response?.data?.detail || 
          'Ошибка регистрации. Проверьте введенные данные или имя пользователя уже занято.';
        toast.error(errorMessage);
      }
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-white">
          Управление задачами
        </h1>
        <h2 className="mt-2 text-center text-xl text-white">
          {isLogin ? 'Войдите в свою учетную запись' : 'Создайте новую учетную запись'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loginError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
              {loginError}
            </div>
          )}
        
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Имя пользователя"
              fullWidth
              error={!isLogin && errors.username?.message ? errors.username.message : undefined}
              {...register('username', { 
                required: 'Имя пользователя обязательно', 
                minLength: { value: 5, message: 'Имя пользователя должно содержать минимум 5 символов' } 
              })}
            />

            <Input
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              error={!isLogin && errors.password?.message ? errors.password.message : undefined}
              rightIcon={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {/* When password is hidden (showPassword=false), show the eye icon to indicate "click to show" */}
                  {/* When password is visible (showPassword=true), show the slashed eye to indicate "click to hide" */}
                  {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                </button>
              }
              {...register('password', { 
                required: 'Пароль обязателен',
                minLength: { value: 6, message: 'Пароль должен содержать минимум 6 символов' },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d).{6,}$/,
                  message: 'Пароль должен содержать минимум 6 символов, одну заглавную букву и одну цифру'
                }
              })}
            />

            <div>
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading}
              >
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <button
              type="button"
              className="w-full text-center text-sm text-primary hover:text-primary-dark"
              onClick={() => {
                setIsLogin(!isLogin);
                setLoginError(null);
              }}
            >
              {isLogin 
                ? 'Нет аккаунта? Зарегистрироваться' 
                : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
