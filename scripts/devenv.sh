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
        # Squash CMS_SERVER env var is set with prefix
        # slashes so we'll remove them here if it's
        # been passed in to the container, otherwise
        # it'll default to what's in .env.sample
        if [[ $CMS_SERVER == "//"* ]]; then
            export CMS_SERVER="https:${CMS_SERVER}"
        fi
    fi
    # AFAIK no good way to _only_ install devDependencies
    # so we have to run `yarn install` again w/o the `-prod` flag
    if ! [[ -d "dist" ]]; then
        yarn install && yarn build
    fi
    ;;
esac
