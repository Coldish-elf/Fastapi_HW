# FastAPI Task Management Application

## Установка и запуск

1. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
2. Запустите сервер:
   ```bash
   python main.py
   ```

Сервер будет доступен по адресу http://localhost:8000.

## Запуск через Docker Compose

1. Соберите и запустите контейнеры:
   ```bash
   docker-compose up --build
   ```
2. Приложение будет доступно по адресу http://localhost:8000.

## Структура проекта

```
Streamlit_hw\
├── main.py                  # Запуск приложения
├── README.md                # Информация о проекте, инструкциях по запуску и описании функционала
├── requirements.txt         # Зависимости проекта
├── .gitignore               # Файлы, исключенные из контроля версий
└── app\
   ├── app.py               # FastAPI-приложение и маршруты
   ├── models.py            # Модели SQLAlchemy и Pydantic-схемы
   ├── schemas.py           # Модели SQLAlchemy и Pydantic-схемы
   ├── database.py          # Настройка базы данных
   ├── auth.py              # Функции аутентификации и шифрования
   ├── sidebar.py           # Тестовые запросы к API  
```