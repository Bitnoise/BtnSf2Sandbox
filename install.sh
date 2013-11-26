#!/bin/bash

composer install
./fixperms
bower install
npm install
