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
        # Squash env var is set with prefix slashes
        # so we'll remove them here if it's been passed
        # in, otherwise it'll default to what's in
        # .env.sample
        [ -z "$CMS_SERVER" ] && export CMS_SERVER=$(sed -E 's/\/\///' <<< $CMS_SERVER)
        echo "TK HOST_WHITELIST: >>$HOST_WHITELIST<<"
        echo "TK CMS_SERVER: >>$CMS_SERVER<<"
    fi
    # AFAIK no good way to _only_ install devDependencies
    # so we have to run `yarn install` again w/o the `-prod` flag
    if ! [[ -d "dist" ]]; then
        yarn install && yarn build
    fi
    ;;
esac
