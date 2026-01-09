# Estágio 1: Build da aplicação React
FROM node:22-alpine AS build

# Define a pasta de trabalho
WORKDIR /app

# Copia os arquivos de configuração do npm
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação, incluindo o 'index.html' da pasta raiz
COPY . .

# Constrói a aplicação para produção
RUN npm run build

# Estágio 2: Servir a aplicação com Nginx
FROM nginx:stable-alpine

# Copia a pasta "browser" que contém os arquivos finais para a raiz do Nginx
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]