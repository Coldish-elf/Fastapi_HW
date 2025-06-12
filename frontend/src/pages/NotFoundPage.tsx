import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-2">Страница не найдена</h2>
      <p className="text-gray-600 mb-8 max-w-lg">
        Страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Link to="/">
        <Button>
          Вернуться на главную
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
