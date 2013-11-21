BtnSf2Sandbox
=============

Backend
(install composer)
- composer install
- app/console doctrine:database:create
- app/console doctrine:schema:update --force

Frontend
(install nodejs, install npm, install bower, install grunt)
- bower install (frontend vendors)
- npm install   (grunt libraries)
- grunt watch (or --verbose) (compass compilation with livereload)
- grunt dump:prod (generate css, js files for production)
- grunt dump:dev (generate css, js files for stage)
- grunt clean (remove css, js files for production/stage)
- grunt phpcs (hint php files for PSR2 standard)
- grunt jshint (hint js files)
- grunt hint (hint js and php files)

(chrome+osx livereloadjs bug - sudo gem install em-websocket)


Deploy
(exchange ssh keys with stage server)
- cap deploy
