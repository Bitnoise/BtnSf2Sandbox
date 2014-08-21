#!/bin/bash

composer install
./fixperms.sh
bower install
npm install
