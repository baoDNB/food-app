FROM php:8.4-cli

# Cài đặt các phụ trợ cần thiết
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libzip-dev \
    libpq-dev \
    libsqlite3-dev \
    && docker-php-ext-install zip pdo pdo_pgsql pdo_sqlite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy code vào trước để đảm bảo cấu trúc thư mục
COPY . .

# Tạo database và cấp quyền (Dùng quyền 777 để tránh lỗi 502/Permission)
RUN mkdir -p /var/www/database && \
    touch /var/www/database/database.sqlite && \
    chmod -R 777 /var/www/storage /var/www/bootstrap/cache /var/www/database

RUN composer install --no-interaction --optimize-autoloader --no-dev

# Chỉ dùng MỘT lệnh CMD duy nhất để khởi động
# Lệnh này sẽ: Migrate xong mới bật server
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000