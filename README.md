# Child First Authority
**Student absenteeism and outreach tracking app**

[![Build Status](https://travis-ci.org/child-first-authority-fcc-project/webapp.svg)](https://travis-ci.org/child-first-authority-fcc-project/webapp)

## Purpose

This application is intended to streamline the process of tracking and reporting student absenteeism for Child First Authority.

# Authentication and Authorization

Google OAuth is used for authentication for using the app. Authenticated users are by default a 'guest'. The admin and super users are able to promote/demote 
access of other users by assigning roles.

The roles are:

  - guest
  - teacher
  - manager
  - admin
  - super user

## Deployment

**Vagrant**

The development environment for working with this application can be found in this [repository](https://github.com/child-first-authority-fcc-project/vagrantbox) 

**Heroku**

There is a grunt task to deploy this application to Heroku. This requires the [heroku-toolbelt](https://toolbelt.heroku.com/). If using the development environment, the toolbelt is installed by the provisioner.

After logging in to Heroku with Heroku toolbelt, deploying is accomplished by:

    $ grunt buildcontrol:heroku
    
The env variables that need to be set:

- APP_SECRET = *SECRET*
- DOMAIN = *SOME HTTPS DOMAIN*
- GOOGLE_ID = *GOOGLE ID*
- GOOGLE_SECRET = *GOOGLE SECRET*
- NODE_ENV = production
- SUPER_USER_EMAIL = *EMAIL OF SUPER USER*

Google id and secret need to be obtained by creating an application on [Google Developers Console](https://console.developers.google.com/project). 

## Sample PDFs

https://github.com/child-first-authority-fcc-project/sample-pdfs
