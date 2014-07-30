FROM 		binocarlos/nodejs
MAINTAINER 	Kai Davenport <kaiyadavenport@gmail.com>

ADD . /srv/app
RUN cd /srv/app && npm install

ENTRYPOINT ["/usr/local/bin/node", "/srv/app/cli.js"]
CMD [""]