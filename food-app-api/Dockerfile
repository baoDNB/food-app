# Sử dụng PHP 8.2 FPM
FROM php:8.2-fpm

# Cài đặt các system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Xóa cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Cài đặt PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Lấy Composer mới nhất
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Thiết lập thư mục làm việc
WORKDIR /var/www

# Copy code vào container
COPY . .

# Cài đặt dependencies của Laravel
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Cấp quyền cho storage và bootstrap/cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Port mặc định cho Render
EXPOSE 80

CMD ["php-fpm"]