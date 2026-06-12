# Ticket Service — Система управления заявками техподдержки

Дипломный проект — веб-сервис для отдела технической поддержки малого предприятия.

## Технологии

- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Frontend:** React, TypeScript, Vite
- **База данных:** PostgreSQL
- **Инфраструктура:** Docker, nginx

## Развёртывание (Docker) — рекомендуемый способ

### 1. Установить Docker Desktop

Скачать с официального сайта: https://www.docker.com/products/docker-desktop/

Установить и запустить. После установки Docker будет доступен в командной строке.

### 2. Открыть командную строку

Нажать `Win + R`, ввести `cmd`, нажать Enter.

### 3. Выполнить команды

Скопировать и выполнить по очереди:

```bash
git clone https://github.com/zabolotnev3522-sketch/-_Ticker.Service
cd -_Ticker.Service
docker compose up
```

Первый запуск занимает 2–5 минут (сборка образов). Дождаться появления надписи `"Starting server..."`.

### 4. Открыть в браузере

```
http://localhost
```

### Остановка

Нажать `Ctrl + C` в командной строке или открыть новую консоль в той же папке и выполнить:

```bash
docker compose down
```

### Полная очистка (удалить базу данных)

```bash
docker compose down -v
```

## Установка без Docker (вручную)

### Требования

- Node.js 18+
- PostgreSQL 14+
- npm

### Шаги

1. **Клонировать репозиторий**

```bash
git clone https://github.com/zabolotnev3522-sketch/-_Ticker.Service
cd -_Ticker.Service
```

2. **Создать базу данных**

```bash
psql -U postgres -c "CREATE DATABASE ticket_service;"
```

3. **Backend**

```bash
cd backend
npm install
```

Создать файл `backend/.env`:

```
DATABASE_URL="postgresql://postgres:123@localhost:5432/ticket_service?schema=public"
JWT_SECRET="super-secret-key-change-in-production"
PORT=3000
```

```bash
npx prisma migrate dev
npm run db:seed
npm run dev
```

4. **Frontend** (в новом терминале)

```bash
cd frontend
npm install
npm run dev
```

Открыть **http://localhost:5173**

## Тестовые учётные данные

| Роль | Email | Пароль |
|------|-------|--------|
| ADMIN | admin@test.com | password123 |
| MANAGER | manager@test.com | password123 |
| ENGINEER | engineer1@test.com | password123 |
| ENGINEER | engineer2@test.com | password123 |
| CLIENT | client@test.com | password123 |

## Функции по ролям

| Роль | Возможности |
|------|-------------|
| **Клиент** | Создать заявку, смотреть статус, комментировать |
| **Инженер** | Взять заявку (claim), отметить решённой, закрыть, комментировать |
| **Менеджер** | Смотреть все заявки, назначать/переназначать, менять приоритет, смотреть список инженеров |
| **Администратор** | Всё что менеджер + управление пользователями (создать, редактировать, удалить) |

## Структура проекта

```
ticket-service/
├── backend/
│   ├── prisma/          # Схема БД и миграции
│   ├── src/
│   │   ├── middleware/   # Аутентификация и авторизация
│   │   ├── routes/       # REST маршруты
│   │   ├── services/     # Бизнес-логика
│   │   └── index.ts      # Точка входа
│   ├── tests/            # Тесты (Vitest)
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/          # HTTP-клиент
│   │   ├── components/   # UI компоненты
│   │   └── pages/        # Страницы
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## REST API

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| POST | /api/auth/register | Регистрация пользователя | ADMIN |
| POST | /api/auth/login | Вход в систему | Все |
| GET | /api/tickets | Список заявок (с фильтрами) | Авторизованные |
| POST | /api/tickets | Создать заявку | CLIENT |
| GET | /api/tickets/:id | Детали заявки | Авторизованные |
| PATCH | /api/tickets/:id | Обновить заявку | Авторизованные |
| POST | /api/tickets/:id/assign | Назначить инженера | MANAGER |
| POST | /api/tickets/:id/claim | Взять заявку | ENGINEER |
| POST | /api/tickets/:id/comments | Добавить комментарий | Авторизованные |
| GET | /api/users | Список пользователей | MANAGER |
| GET | /api/users/engineers | Список инженеров | MANAGER |
| PATCH | /api/users/:id | Редактировать пользователя | ADMIN |
| DELETE | /api/users/:id | Удалить пользователя | ADMIN |
