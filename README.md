# FastAPI Task Management Application
![Tests](https://github.com/Coldish-elf/Fastapi_HW/actions/workflows/ci.yml/badge.svg)
![Coverage](coverage.svg)

## Функционал проекта

- **CRUD задачи:**  
  - Создание задач с заголовком, описанием, статусом, приоритетом и датой создания  
  - Просмотр списка задач пользователя  
  - Редактирование и обновление информации о задаче  
  - Удаление задачи

- **Сортировка и поиск:**  
  - Сортировка задач по заголовку, статусу или дате создания  
  - Возможность выбрать топ-N самых приоритетных задач  
  - Реализация поиска по тексту заголовка и описания задач

- **Аутентификация:**  
  - Регистрация пользователя  
  - Получение JWT-токена при входе в систему  
  - Доступ к задачам только для авторизованных пользователей

- **Кэширование:**  
  - Кэширование результатов запроса задач по пользователю и параметрам запросов (сортировка, поиск, топ-N). 

    Было выбрано кешировать именно это, чтобы уменьшить количество запросов к базе данных при повторных запросах с теми же параметрами. Кэшируются данные, которые получают задачи в определённом порядке или фильтрации, что снижает нагрузку на сервер и позволяет быстрее получить результаты.

- **Frontend:**  
  - Реализован на React с использованием Vite, Tailwind CSS и TypeScript
  - Интегрирован с бэкендом через API-прокси
  - Полностью контейнеризирован с использованием Docker
  
## Настройка переменных окружения для Docker Compose

Перед запуском приложения с использованием Docker Compose, необходимо создать файл `.env` в корневой директории  проекта.

Добавьте в файл `.env` следующие переменные, заменив значения на ваши:
```env
SECRET_KEY=сгенерированный ключ
POSTGRES_USER=имя_пользователя_для_postgresql
POSTGRES_PASSWORD=пароль_для_postgresql
POSTGRES_DB=имя_базы_данных_postgresql
```

## Установка и запуск

## Установка и запуск через Docker Compose

1.  Убедитесь, что Docker и Docker Compose установлены на вашем компьютере.
2.  Соберите и запустите контейнеры:
    ```bash
    docker-compose up --build -d
    ```
3.  Приложение будет доступно по адресу http://localhost.


## Тестирование

### Запуск тестов с подробным выводом
Чтобы увидеть подробный вывод тестов:
```bash
docker compose -f docker-compose-test.yml run --rm web pytest -v
```

### Генерация отчета о покрытии кода
Для проверки покрытия кода и генерации HTML-отчета:
```bash
docker compose -f docker-compose-test.yml run --rm web pytest --cov=app --cov-report=html
```

### Нагрузочное тестирование (Locust)

Для запуска нагрузочного тестирования с использованием Locust:

1.  Убедитесь, что ваше FastAPI приложение запущено.
2.  Выполните команду в терминале из корневой папки проекта:
    ```bash
    locust -f tests/locustfile.py
    ```
3.  Откройте браузер и перейдите по адресу, указанному Locust (обычно `http://localhost:8089`).
4.  В веб-интерфейсе Locust:
    *   Укажите количество пользователей для симуляции 
    *   Укажите скорость появления новых пользователей 
    *   В поле `Host` укажите адрес вашего запущенного приложения .
    *   Нажмите "Start".
5.  Locust начнет отправлять запросы к приложению. Можно наблюдать за статистикой в реальном времени.
6.  **Результаты нагрузочного тестирования:**
    *   Результаты отображаются в веб-интерфейсе Locust.
    *   Вы можете скачать отчеты о статистике и графиках непосредственно из интерфейса Locust (обычно в форматах CSV), либо download reports.


## Структура проекта

```
Fastapi_HW\
├── main.py                 # Запуск приложения
├── README.md               
├── requirements.txt        
├── .gitignore              
├── Dockerfile    
├── Dockerfile.test          
├── docker-compose.yml  
├── docker-compose-test.yml   
├── coverage.svg            # Резльутат покрытия кода
├── .coveragerc             # Конфигурация для покрытия кода
├── .github\
│   └── workflows\
│       └── ci.yml          # CI/CD конфигурация для GitHub Actions
└── app\
│   ├── __init__.py          # Инициализация пакета
│   ├── app.py               # FastAPI-приложение и маршруты
│   ├── models.py            # SQLAlchemy модели
│   ├── schemas.py           # Pydantic-схемы
│   ├── database.py          # Настройка базы данных
│   └── auth.py              # Аутентификация и шифрование
├── frontend/               
│   ├── Dockerfile          
│   ├── index.html          
│   ├── nginx.conf          
│   ├── package.json       
│   ├── tailwind.config.js  
│   ├── tsconfig.json       
│   ├── vite.config.ts      
│   └── src/                
│       ├── App.tsx         
│       ├── main.tsx        
│       ├── index.css       
│       ├── components/     # UI компоненты
│       ├── context/        # React Context
│       ├── hooks/          # Пользовательские React хуки (useAuth, useTasks)
│       ├── pages/          # Компоненты страниц (Dashboard, Login, NotFound)
│       ├── services/       # Сервисы для взаимодействия с API
│       └── types/          # TypeScript типы (Task, User)
└── tests\
   ├── conftest.py          # Фикстуры для тестов
   ├── locustfile.py        # Сценарии нагрузочного тестирования
   ├── test_api_tasks.py    # Тесты для задач (CRUD, сортировка, поиск)
   ├── test_api_users.py    # Тесты для пользователей (регистрация, авторизация)
   ├── test_auth.py         # Тесты для аутентификации (хэширование паролей, токены)
   ├── test_cache.py        # Тесты для кэширования (генерация ключей, установка, удаление)
```