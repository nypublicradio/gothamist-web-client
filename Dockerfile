FROM node:10

RUN apt-get update \
    && apt-get install -y \
        curl \
        netcat \
        nginx-extras \
        python \
        python-setuptools \
        unzip \
    && python -m easy_install supervisor \
    && mkdir -p /code

WORKDIR /code

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production

COPY . ./
RUN rm /etc/nginx/nginx.conf \
    && ln -sf /code/nginx/* /etc/nginx/

RUN ./scripts/envdist.sh

CMD ./scripts/entrypoint.sh
