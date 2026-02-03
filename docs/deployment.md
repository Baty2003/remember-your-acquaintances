# Развёртывание на VDS

Инструкция по настройке приложения Remember Your Acquaintances на VDS (Ubuntu 22.04).

## Требования

- Ubuntu 22.04
- Node.js 20+
- Nginx
- PM2

---

## 1. Подготовка сервера

```bash
# Обновление системы
apt update && apt upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Nginx
apt install -y nginx
systemctl enable nginx

# PM2
npm install -g pm2
```

---

## 2. Загрузка проекта

### Вариант A: Git

```bash
apt install -y git
cd /var/www
git clone https://github.com/твой-username/remember-your-acquaintances.git
cd remember-your-acquaintances
```

### Вариант B: SCP с локальной машины

```bash
# Локально:
scp -r /path/to/remember-your-acquaintances root@IP_СЕРВЕРА:/var/www/
```

---

## 3. Backend

### 3.1 Установка зависимостей

```bash
cd /var/www/remember-your-acquaintances
npm install
cd backend && npm install
```

### 3.2 Файл .env

Создать `backend/.env`:

```
PORT=3000
HOST=127.0.0.1
NODE_ENV=production
DATABASE_URL="file:./prisma/prod.db"
JWT_SECRET="сгенерируй-длинный-ключ-32-символа"
JWT_EXPIRES_IN="7d"
```

Сгенерировать JWT_SECRET:
```bash
openssl rand -base64 32
```

### 3.3 Миграции и сборка

```bash
cd /var/www/remember-your-acquaintances/backend
npx prisma migrate deploy
npm run build
```

### 3.4 Запуск через PM2

```bash
cd /var/www/remember-your-acquaintances/backend
pm2 start dist/index.js --name rya-backend
pm2 save
pm2 startup
```

---

## 4. Frontend

### 4.1 Сборка

**Важно:** `VITE_API_URL=""` — для запросов на тот же домен (относительные URL).

```bash
cd /var/www/remember-your-acquaintances/frontend
VITE_API_URL="" npm run build
```

Результат в `frontend/dist/`.

---

## 5. Nginx

### 5.1 Конфиг

Создать `/etc/nginx/sites-available/remember-your-acquaintances`:

```nginx
server {
    listen 80;
    server_name IP_ИЛИ_ДОМЕН;   # например: 168.222.252.190 или example.com

    root /var/www/remember-your-acquaintances/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

### 5.2 Включение

```bash
ln -sf /etc/nginx/sites-available/remember-your-acquaintances /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

---

## 6. Проверка

- Backend: `curl http://127.0.0.1:3000/health`
- API: `curl http://IP_СЕРВЕРА/api`
- Сайт: открыть `http://IP_СЕРВЕРА` в браузере

---

## 7. HTTPS (опционально)

При наличии домена:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d example.com -d www.example.com
```

---

## Обновление деплоя

### Только frontend

```bash
cd /var/www/remember-your-acquaintances
git pull
cd frontend && VITE_API_URL="" npm run build
# Nginx перезапускать не нужно
```

### Только backend

```bash
cd /var/www/remember-your-acquaintances
git pull
cd backend && npm run build && pm2 restart rya-backend
```

### Backend + миграции

```bash
cd /var/www/remember-your-acquaintances/backend
git pull
npx prisma migrate deploy
npm run build
pm2 restart rya-backend
```

---

## Полезные команды

| Действие | Команда |
|----------|---------|
| Логи backend | `pm2 logs rya-backend` |
| Статус backend | `pm2 status` |
| Перезапуск backend | `pm2 restart rya-backend` |
| Проверка Nginx | `nginx -t` |
| Перезагрузка Nginx | `systemctl reload nginx` |

---

## Исправления, внесённые при деплое

1. **API URL для production** — в `apiClient.ts` и `baseApi.ts` используется `VITE_API_URL ?? "http://localhost:8080"` (оператор `??` вместо `||`, чтобы пустая строка работала корректно).

2. **Миграция metAt** — добавлена миграция `20260203000006_add_met_at` для колонки `metAt` в таблице Contact.

3. **Миграция ContactLink** — добавлена миграция `20260203000007_add_contact_link` для таблицы ContactLink (ссылки контактов).

4. **Build backend** — в `package.json` добавлен `prisma generate` перед `tsc` в скрипте build.
