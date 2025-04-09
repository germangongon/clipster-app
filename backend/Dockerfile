FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instalar Netcat (usando netcat-openbsd)
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

# Copiar los requisitos e instalarlos
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiar el código y el entrypoint
COPY . .

# Copiar el entrypoint.sh
COPY entrypoint.sh /entrypoint.sh

# Dar permisos de ejecución al entrypoint
RUN chmod +x /entrypoint.sh

# Configurar el entrypoint del contenedor
ENTRYPOINT ["/entrypoint.sh"]
