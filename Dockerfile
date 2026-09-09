# Pizza Assistant — static site, served by nginx.
# No backend, no database: everything runs client-side, sessions live in
# the browser's localStorage. This container just serves the files.

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY www/ /usr/share/nginx/html/

EXPOSE 80
