FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instalar netcat-openbsd para usar el comando nc
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

# Copiar los requisitos e instalarlos
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiar todo el código del backend al contenedor
COPY . .

# Copiar el entrypoint.sh al contenedor
COPY entrypoint.sh /entrypoint.sh

# Dar permisos de ejecución al entrypoint
RUN chmod +x /entrypoint.sh

# Verificar que netcat se haya instalado correctamente (opcional)
RUN nc -v

# Configurar el entrypoint del contenedor
ENTRYPOINT ["/entrypoint.sh"]
