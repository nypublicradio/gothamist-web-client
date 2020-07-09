#!/usr/bin/env bash

case "$ENV" in
prod)
    ;;
demo)
    ;;
wagtail)
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
    ;;
esac