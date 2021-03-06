<!--
TOC (Shortcut to update: Ctrl-M T).  Requires vscode plug-in Markdown TOC by
AlanWalk.  Can be manually updated if you don't have that plug-in.
-->
<!-- TOC -->

- [Overview](#overview)
  - [Technologies Used:](#technologies-used)
  - [Development Environment](#development-environment)
  - [vscode Setup](#vscode-setup)
- [MongoDB requirements](#mongodb-requirements)
- [How to Install](#how-to-install)
- [How to Start React Server](#how-to-start-react-server)
- [How to Start Backend Server](#how-to-start-backend-server)
- [How to Run Tests](#how-to-run-tests)
- [Loading Data from Files](#loading-data-from-files)

<!-- /TOC -->

## Overview

### Technologies Used:

- React
- MongoDb
- Mocha

### Development Environment

- vscode
- Windows (should work with UNIX, not tested)
- gitbash
- MongoDB (Mongodb could not be started from gitbash. Windows was used when verifying results in mongodb.)

### vscode Setup

- Extension Markdown TOC 1.5.6 (AlanWalk) for README.md.
- Set eol preference to \n for extension to work. TOC can be updated manually.

## MongoDB requirements

By default, the application requires mongodb databases to be running on localhost:3001. This can be modified in QuestionClass.js. The first time the UI is run,ethanstromingerdbprod will be created. The first time tests are run, estromingerdbtest database will be created.

## How to Install

1. Create project directory
1. Download code from github to project directory
1. Install node
1. Navigate to project directory in gitbash
1. npm install
1. cd backend
1. npm install
1. cd ../src
1. npm install
1. Install mongodb or change code to point to a mongodb server (see previous section)
1. Follow instructions below to start react server and backend server

## How to Start React Server

From root directory:

`npm start`<br/>

## How to Start Backend Server

From backend/src directory:

`babel-node backendRequests.js`<br/>

## How to Run Tests

From project directory:

`npm test`

## Loading Data from Files

To load files from the UI, copy the files into /backend/src/data and restart the backend server.To load files from the backend,see [CREATEFROMJSONFILE] in /test/transations/QuestionClass-tests.js for an example how to do this.
