#!/usr/bin/env bash

set -e

cd /code
echo "Starting entrypoint script, ENV=$ENV..."

case "$ENV" in
prod)
    supervisord -c nginx/supervisord.conf
    ;;
demo)
    supervisord -c nginx/supervisord.conf
    ;;
wagtail)
    supervisord -c nginx/supervisord.conf
    ;;
*)
    export DIST_PATH="dist/"
    # export HOST="localhost"
    node fastboot
    ;;
esac

