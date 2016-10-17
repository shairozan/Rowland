# Rowland

Rowland is an implementation of [Sails](http://sailsjs.org) specifically aimed at being a PDF Stamping micro service. Rowland accepts two things in a multi-part form post:

1. A JSON structure indiciating the key-value pairs (name : value) of the fields in the PDF
2. The PDF that should be populated

This way the application never needs to be hardcoded with files. You just pass it both the document to be filled in, the values to fill it in with, and it responds with the populated PDF. Relies on the pdf-fill-form PDF package which contains the GPL poppler library and the LGPL QT development libraries. 

# Setup

Before you can use the PDF stamping component, you need to setup the environment per pdf-fill-form's information:

On ubuntu 14.04 and 16.04, you can perform the below
```
$ sudo apt-get install libpoppler-qt4-dev libcairo2-dev
$ npm install pdf-fill-form
``` 

If you're just interested in running the application itself, Docker images are being created
