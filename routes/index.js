// var express = require('express');
// var tempfile = require('tempfile');
// var officegen = require('officegen');
// var router = express.Router();

// router.post('/docx', function(req, res){
//     var tempFilePath = tempfile('.docx');
//     docx.setDocSubject ( 'testDoc Subject' );
//     docx.setDocKeywords ( 'keywords' );
//     docx.setDescription ( 'test description' );

//     var pObj = docx.createP({align: 'center'});
//     pObj.addText('Policy Data', {bold: true, underline: true});

//     docx.on('finalize', function(written) {
//         console.log('Finish to create Word file.\nTotal bytes created: ' + written + '\n');
//     });
//     docx.on('error', function(err) {
//         console.log(err);
//     });

//    res.writeHead ( 200, {
//     "Content-Type": "application/vnd.openxmlformats-officedocument.documentml.document",
//     'Content-disposition': 'attachment; filename=testdoc.docx'
//     });
//     docx.generate(res);
// });
// module.exports = router;
