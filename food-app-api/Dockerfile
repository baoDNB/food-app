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

WORKDIR /var/www
RUN mkdir -p /var/www/database && \
    touch /var/www/database/database.sqlite && \
    chmod -R 775 /var/www/database && \
    chown -R www-data:www-data /var/www/database
COPY . .

RUN mkdir -p database && touch database/database.sqlite && chmod -R 777 database

RUN composer install --no-interaction --optimize-autoloader --no-dev

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000