#!/bin/bash

CHANGES=$(git log ..origin/main --oneline | wc -l) 

if [ $CHANGES = "0" ]
then
	git pull
	cd frontend
	npm install
	cd ../backend
	npm install
fi

