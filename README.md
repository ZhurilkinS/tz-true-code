# tz-true-code
##  Установка и запуск

### Способ 1: Запуск с помощью Docker (рекомендуемый)

1. **Клонируйте репозиторий**:
   
   git clone <your-repo-url>
   cd product-catalog


2. **Создайте файл окружения**:

    cp .env.example .env


3. **Запустите приложение**:

    docker-compose up --build
    

4. **Приложение будет доступно по адресам**:

    Frontend: http://localhost:3000

    Backend API: http://localhost:3001

### Способ 2: Локальная разработка

### Backend

1. **Перейдите в директорию backend**:
   
   cd backend

2. **Установите зависимости**:
   
   npm install
   
3. **Настройте базу данных**:    
  
    Убедитесь, что PostgreSQL запущен и создана база данных test.

4. **Запустите приложение**:
  
    npm run start:dev

### Frontend

1. **Перейдите в директорию frontend**:
   
   cd frontend

2. **Установите зависимости**:
   
   npm install

3. **Запустите приложение**:
  
    npm run dev


**Для отображения картинок необходимо включить VPN**
