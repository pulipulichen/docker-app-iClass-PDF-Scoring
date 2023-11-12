FROM node:18.12.1-buster

#Update stretch repositories
# RUN sed -i s/deb.debian.org/archive.debian.org/g /etc/apt/sources.list
# RUN sed -i 's|security.debian.org|archive.debian.org/|g' /etc/apt/sources.list
# RUN sed -i '/buster-updates/d' /etc/apt/sources.list

RUN apt-get update

RUN apt-get install -y \
    unzip img2pdf qpdf zip

COPY package.json /
RUN npm install

CMD ["bash"]