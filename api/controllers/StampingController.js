module.exports = {

  /**
   * @description This method exists to accept JSON structures and return a download of a file
   * @param form
   * @param data
   * @param res
   * @returns {*}
   */
  receive: function(req,res){
    var fsextra = require('fs-extra');
    var fs = require('fs');
    var path = require('path');
    var os = require('os');


    try{
      var pdfFillForm = require('pdf-fill-form');
    } catch(e){
      //TODO: Graylog / Log customization for GrayLogWrapper
      sails.log.error("Cannot instantiate PDF Fill Form",{full_message : "Can't load the requirement of " +
      "pdf fill form. This would indicate that this is either (1) a windows machine or (2) doesn't have" +
      "the required lbraries installed"});
      res.status(554);
      return res.send({Error : "Couldn't instantiate requirements. Things went south bro"});
    }


    //Extract the data component of the post. Expected json structure
    var content = req.body.data;

    //Verify we are getting JSON Data
    try{
      JSON.parse(content)
    } catch(e){
      sails.log.error("Post values are not valid JSON",{ full_message : "The data provided outside of the file " +
      "is not a valid JSON structure"  });
      //Die if the provided component isn't valid json
      res.status(504);
      return res.send({ Error : "The provided data field is not valid JSON"});
    }

    req.file('form').upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000
    },function whenDone(err, uploadedFiles) {
      if (err) {
        //Some stuff?
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }

      sails.log.info("Beginning PDF Generation", {container: os.hostname()});

      //Set the target PDF value to just an iterator name
      //Generate random file name between 10 and 1000
      var TARGET_PDF = path.resolve(__dirname, '../../files/' + Math.floor( ( Math.random() * ( (1000 - 10 + 1)) + 1 )  ).toString() + ".pdf");

      //Copy the template to TARGET PDF
      fsextra.copySync(uploadedFiles[0].fd,TARGET_PDF);

      //Now we stamp the contents ;)

      //Fill the target PDF

      // Here we'll actually perform the PDF filling
      // Need to leave these commented out because windows
      try{
        var evaluation = true;
        var pdf = pdfFillForm.writeSync(uploadedFiles[0].fd,JSON.parse(content), { "save": "pdf" } );
        fs.writeFileSync(TARGET_PDF,pdf);

      } catch(e){
        evaluation = false;
        sails.log.error(e.message);
      }

      //respond with a download of said PDF only if we were able to create something
      if(evaluation){
        fs.createReadStream(TARGET_PDF).pipe(res);
      } else{
        res.status(554);
        res.send({Error : "Couldn't instantiate requirements. Things went south bro"});
        return;
      }


      //Delete the file on a wait. Don't just delete it hte moment we start sending hte response

      try{
        //Remove the created filed
        setTimeout(function(){
          fs.unlink(TARGET_PDF);
        },5000);

        //Remove the uploaded file
        setTimeout(function(){
          fs.unlink(uploadedFiles[0].fd);
        },5000);
      } catch(e){
        sails.log.error(e.message);
      }

      sails.log.info("Job and cleanup complete",{container: os.hostname()})
    });
  }
};

