#!/bin/bash

export ENV=test

pass=0
fail=0
fail_report=()

fail() {
    >&2 echo -e "\e[41m[fail]\e[49m \e[91m$1\e[39m"
    ((fail++))
    fail_report+=("$1")
}

pass() {
    echo -e "\e[42m[pass]\e[49m $1"
    ((pass++))
}

title() {
    echo
    echo -e "\e[44m$1\e[49m"
}

totals() {
    title "Results"
    echo -e "\e[42m[Total Passing]\e[49m $pass"
    if [[ $fail -gt 0 ]]; then
        echo -e "\e[41m[Total Failing]\e[49m $fail"
        echo
        for msg in "${fail_report[@]}"; do
            echo -e "\e[41m$msg\e[49m"
        done
        exit 1
    else
        echo -e "[Total Failing] $fail"
    fi
}

join_arr() {
    local IFS=","
    shift
    echo "$*"
}

test_redirect(){
    test_url="$1"
    expected_resp="$2"
    host_header="${4:-gothamist.com}"
    expected_url="$([[ $3 == http* ]] && echo "$3" || echo "http://$host_header$3")"

    test_host="http://localhost"

    test_urls=("$test_url")

    for url in "${test_urls[@]}"; do
        IFS='|' read returned_resp returned_url time_total <<<$(curl -H "Host: $host_header" -sI "$test_host$url" -o /dev/null -w "%{http_code}|%{redirect_url}|%{time_total}")
        if [[ ! "${returned_url}" == "${expected_url}" ]] || [[ ! "${returned_resp}" == "${expected_resp}" ]]; then
            fail "(${time_total}s) $url returned $returned_resp -> $returned_url instead of $expected_resp -> ${expected_url}"
        else
            pass "(${time_total}s) $url returned $returned_resp -> $returned_url"
        fi
    done
}

test_proxy_pass(){
    test_url="$1"
    expected_resp="${2:-200}"
    host_header="${3:-gothamist.com}"

    test_host="http://localhost"

    test_urls=("$test_url")

    for url in "${test_urls[@]}"; do
        read returned_resp time_totla <<<$(curl -H "Host: $host_header" -sI "$test_host$url" -o /dev/null -w "%{http_code} %{time_total}")
        if [[ ! "${returned_resp}" == "${expected_resp}" ]]; then
            fail "(${time_total}s) $url returned $returned_resp instead of $expected_resp"
        else
            pass "(${time_total}s) $url returned $returned_resp"
        fi
    done
}


# Tests Below Here

title "Checking config for syntax errors..."
nginx -g "daemon off;" -t
nc -z 127.0.0.1 80 || nginx -g "daemon on;"

title "Checking trailing slash rewrite..."
test_redirect /foo/ 301 /foo

title "Checking .php exact match redirects..."
test_redirect /about.php 301 https://www.gothamistllc.com
test_redirect /advertising.php 301 https://www.gothamistllc.com
test_redirect '/author.php?term=foo&page=1' 301 /author/foo/1
test_redirect '/cat.php?term=news&page=1' 301 /news/1
test_redirect '/getaways.php?page=1' 301 /getaways/1
test_redirect /mediakit/gothamist.php 301 https://www.gothamistllc.com/gothamist
test_redirect /mediakit/index.php 301 https://www.gothamistllc.com
test_redirect /mediakit/spec_rates.php 301 https://www.gothamistllc.com/offerings/
test_redirect '/mobile.php?page=1' 301 /1
test_redirect /pretty.php 301 /
test_redirect '/tag.php?term=foo&page=1' 301 /tags/foo/1

title "Checking non-php exact match redirects..."
test_redirect /checkout 301 /2017/08/09/check_out.php
test_redirect /contribute 301 /labs/contribute
test_redirect /favorites 301 /labs/favorites
test_redirect /judges 301 /2018/09/12/judges_ballot_primary_nyc.php
test_redirect /labs/map 301 /map
test_redirect /submit 301 https://gothamist.submittable.com/submit/18730
test_redirect /turnout 301 https://project.gothamist.com/voter-turnout

title "Checking feed redirects..."
test_redirect /atom.xml 301 https://feeds.gothamistllc.com/gothamist05
test_redirect /index.rdf 301 https://feeds.gothamistllc.com/gothamist05
test_redirect /index.xml 301 https://feeds.gothamistllc.com/gothamist05

title "Checking regex redirects..."
test_redirect /archives/foo.php 301 /foo.php
test_redirect /blog.php 301 /
test_redirect /blog2.php 301 /
test_redirect /blog3.php 301 /
test_redirect /blog4.php 301 /
test_redirect /blog5.php 301 /
test_redirect /blog6.php 301 /
test_redirect /2015/09/10/hiv_doe_howard_sellers.php 301 /2015/09/10/hiv_meds_howard.php
test_redirect '/sections/arts & entertainment' 301 /arts-entertainment
test_redirect '/sections/arts%20&%20entertainment' 301 /arts-entertainment
test_redirect '/sections/artsentertainment' 301 /arts-entertainment
test_redirect '/sections/arts-entertainment' 301 /arts-entertainment
test_redirect '/sections/arts' 301 /arts-entertainment
test_redirect '/sections/art' 301 /arts-entertainment

totals
