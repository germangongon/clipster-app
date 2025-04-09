FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instalar curl y wait-for-it
RUN apt-get update && apt-get install -y curl && \
    curl -sSL https://github.com/vishnubob/wait-for-it/releases/download/v2.2.3/wait-for-it.sh -o /usr/local/bin/wait-for-it && \
    chmod +x /usr/local/bin/wait-for-it

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

# Configurar el entrypoint del contenedor
ENTRYPOINT ["/entrypoint.sh"]
