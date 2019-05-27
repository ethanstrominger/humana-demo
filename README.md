<!--
TOC (Shortcut to update: Ctrl-M T).  Requires vscode plug-in Markdown TOC by
AlanWalk.  Can be manually updated if you don't have that plug-in.
-->
<!-- TOC -->autoauto- [Development Environment](#development-environment)auto    - [Overview](#overview)auto    - [How to Install](#how-to-install)auto    - [How to Start React Server](#how-to-start-react-server)auto    - [How to start backend server](#how-to-start-backend-server)auto    - [How to run tests](#how-to-run-tests)autoauto<!-- /TOC -->

## Overview

The application uses a React server and a mongo backend. Tests are written in Mocha. The application was setup using Windows environment with git bash and should work on Unix, but has not been tested with Unix. Mongodb could not be started from gitbash. Windows was used when verifying results in mongodb.

## How to Install

1. Create project directory
1. Download code from github to project directory
1. Install node
1. Install mongodb or change code to point to a mongodb server
1. Follow instructions below to start react server and backend server

## How to Start React Server

From root directory:

`npm start`<br/>

## How to start backend server

From backend/src directory:

`babel-node serverRequests.js`<br/>

## How to run tests

From question-app directory:

`npm test`
