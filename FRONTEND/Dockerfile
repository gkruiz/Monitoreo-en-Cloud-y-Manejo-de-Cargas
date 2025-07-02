FROM nginx:1.15.2-alpine
COPY . /usr/share/nginx/html
ARG REACT_APP_IP

ENV REACT_APP_IP=$REACT_APP_IP
EXPOSE 80

