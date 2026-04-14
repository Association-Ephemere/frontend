#!/bin/sh
cat > /usr/share/nginx/html/env-config.js <<EOF
window.__env__ = {
  VITE_JOB_SERVICE_URL: "${VITE_JOB_SERVICE_URL}"
};
EOF
exec nginx -g "daemon off;"
