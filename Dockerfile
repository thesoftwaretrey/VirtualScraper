FROM node:16-slim
COPY fonts.conf .
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN  apt-get update \
     && apt-get install -yq wget curl gnupg libgconf-2-4 ca-certificates wget xvfb dbus dbus-x11 build-essential --no-install-recommends \
     && apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcurl4-gnutls-dev libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget fonts-arphic-ukai fonts-arphic-uming fonts-ipafont-mincho fonts-ipafont-gothic fonts-unfonts-core fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-noto unzip --no-install-recommends \
     && cd "$(mktemp -d)" \
     && wget https://noto-website.storage.googleapis.com/pkgs/NotoColorEmoji-unhinted.zip \
     && unzip NotoColorEmoji-unhinted.zip \
     && mkdir -p ~/.fonts \
     && mv *.ttf ~/.fonts \
     && mkdir -p ~/.config/fontconfig \
     && cp /fonts.conf ~/.config/fontconfig \
     && fc-cache -f -v \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - 
     RUN apt-get update \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends \
     && rm -rf /var/lib/apt/lists/* /var/cache/apt/* 

COPY . /virtualscraper
WORKDIR /virtualscraper
RUN npm install \
&& chmod +x *.sh
COPY entrypoint.sh /virtualscraper/entrypoint.sh

ENTRYPOINT ["/virtualscraper/entrypoint.sh"]
EXPOSE 8080
ENV DISPLAY :99
CMD xvfb-run --server-args="-screen 0 1920x1080x16" npm start
CMD ["node", "index.js"]