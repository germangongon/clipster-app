#!/bin/sh

echo "Esperando a que la base de datos esté disponible..."

# Espera hasta que la base de datos esté lista
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "Base de datos disponible, corriendo migraciones y collectstatic..."

python manage.py migrate --noinput
python manage.py collectstatic --noinput

echo "Levantando servidor..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000
