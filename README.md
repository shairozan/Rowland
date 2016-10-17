# Rowland

Rowland is an implementation of [Sails](http://sailsjs.org) specifically aimed at being a PDF Stamping micro service. Rowland accepts two things in a multi-part form post:

1. A JSON structure indiciating the key-value pairs (name : value) of the fields in the PDF
2. The PDF that should be populated

This way the application never needs to be hardcoded with files. You just pass it both the document to be filled in, the values to fill it in with, and it responds with the populated PDF. Relies on the pdf-fill-form PDF package which contains the GPL poppler library and the LGPL QT development libraries. 

The application gets its name from Rowland Hill, the individual credited with creating the postage stamp.

# Setup
1. First thing is to require the system libraries required for the PDF stamping NPM components. You need to setup the environment per pdf-fill-form's information On ubuntu 14.04 and 16.04, you can perform the below
```
$ sudo apt-get install libpoppler-qt4-dev libcairo2-dev
$ npm install pdf-fill-form
```
2. Install Sails Globally
```
$ sudo npm -g install sails
```
3. Navigate to the Rowland application directory (Where you'll find packages.json) and install the packages
```
$ npm install
```
4. In the Rowland directory, start sails!
```
sails lift
```

Refer to sails.js' documentation on how to configure SSL / the framework's general functionality if you're looking at configuring it differently. If you're just interested in running the application itself, Docker images are being created
