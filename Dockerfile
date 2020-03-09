# Angular app containerization
FROM nginx:alpine as angular-build
WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY dist/ .
# EXPOSE 80 443
CMD [ "nginx", "-g", "daemon off;" ]

