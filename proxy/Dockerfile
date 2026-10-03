FROM docker.io/owasp/modsecurity-crs:nginx

USER root

RUN mkdir -p /etc/ssl/certs /etc/ssl/private && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/selfsigned.key \
    -out /etc/ssl/certs/selfsigned.crt \
    -subj "/C=FR/ST=Paris/L=Paris/O=42/OU=Transcendence/CN=localhost" && \
    chmod 600 /etc/ssl/private/selfsigned.key && \
    chmod 644 /etc/ssl/certs/selfsigned.crt

COPY ./conf.d/default.conf /etc/nginx/templates/conf.d/default.conf.template
COPY ./modsec/custom-rules.conf /etc/modsecurity.d/owasp-crs/rules/custom-rules.conf
