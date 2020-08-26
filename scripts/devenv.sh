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
        echo "TKTKTK HOST_WHITELIST = >$HOST_WHITELIST<"
        echo "TKTKTK SQUASH_DOMAIN = >$SQUASH_DOMAIN<"
    fi
    # AFAIK no good way to _only_ install devDependencies
    # so we have to run `yarn install` again w/o the `-prod` flag
    if ! [[ -d "dist" ]]; then
        yarn install && yarn build
    fi
    ;;
esac
