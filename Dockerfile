FROM node:10
ARG HOST_WHITELIST
ARG CMS_SERVER

ENV HOST_WHITELIST=${HOST_WHITELIST}
ENV CMS_SERVER=${CMS_SERVER}

RUN apt-get update \
    && apt-get install -y \
        curl \
        netcat \
        nginx-extras \
        python \
        python-pip \
        python-setuptools \
        unzip \
    && pip install supervisor \
    && mkdir -p /code

WORKDIR /code

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production

COPY . ./
RUN rm /etc/nginx/nginx.conf \
    && ln -sf /code/nginx/* /etc/nginx/

RUN ./scripts/devenv.sh

CMD ./scripts/entrypoint.sh
