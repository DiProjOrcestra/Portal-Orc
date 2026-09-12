FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código-fonte do frontend
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Inicia o servidor de desenvolvimento do Vite escutando em todas as interfaces
CMD ["npm", "run", "dev", "--", "--host"]
