#!/bin/bash

echo "Esperando a que la base de datos esté disponible..."

# Espera hasta que la base de datos esté lista
wait-for-it $DB_HOST:$DB_PORT --timeout=60 -- echo "Base de datos disponible"

echo "Corriendo migraciones y collectstatic..."
python manage.py migrate --noinput
python manage.py collectstatic --noinput

echo "Levantando servidor..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000
