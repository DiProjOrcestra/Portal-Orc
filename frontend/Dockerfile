FROM nginx:alpine

# Limpa os arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos estáticos da pasta docs para o Nginx
COPY docs/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]