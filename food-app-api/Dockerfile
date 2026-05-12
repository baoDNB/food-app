FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install zip pdo pdo_pgsql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
# Tạo thư mục database và file sqlite trống
RUN mkdir -p database && touch database/database.sqlite && chmod -R 777 database

COPY . .

RUN composer install --no-interaction --optimize-autoloader --no-dev

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000