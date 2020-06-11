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
    if ! [[ -f ".env" ]]; then
        cp .env.sample .env
    fi
    # AFAIK no good way to _only_ install devDependencies
    # so we have to run `yarn install` again w/o the `-prod` flag
    if ! [[ -d "dist" ]]; then
        yarn install && yarn build
    fi
    export DIST_PATH="dist/"
    export HOST="localhost"
    node fastboot
    ;;
esac

