/*
 * Copyright 2019 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const PDFServicesSdk = require('@adobe/pdfservices-node-sdk'),
    fs = require('fs');

/**
 * This sample illustrates how to create a PDF file from a DOCX file, and then write the result to an output stream.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */


/**
 * Prepares a writeStream over a predetermined result file.
 */
const prepareWriteStream = () => {
    // create output directory if it doesn't exists.
    if (!fs.existsSync('output/CreatePDFAsStream')) {
        console.log('Creating output directory');
        fs.mkdirSync('output/CreatePDFAsStream');
    }

    //Generating a file name
    let outputFilePath = createOutputFilePath();

    return fs.createWriteStream(outputFilePath);
};

//Generates a string containing a directory structure and file name for the output file.
function createOutputFilePath() {
    let date = new Date();
    let dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
        ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
    return ("output/CreatePDFAsStream/create" + dateString + ".pdf");
}

try {
    // Initial setup, create credentials instance.
    const credentials =  PDFServicesSdk.Credentials
        .servicePrincipalCredentialsBuilder()
        .withClientId(process.env.PDF_SERVICES_CLIENT_ID)
        .withClientSecret(process.env.PDF_SERVICES_CLIENT_SECRET)
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
        createPdfOperation = PDFServicesSdk.CreatePDF.Operation.createNew();

    // Set operation input from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/createPDFInput.docx');
    createPdfOperation.setInput(input);

    const writeStream = prepareWriteStream();
    // Define a callback function that executes once the stream write is finished
    writeStream.on('finish', () => console.log('Stream Write Finished'));

    // Execute the operation and Write the result to stream.
    createPdfOperation.execute(executionContext)
        .then(result => result.writeToStream(writeStream))
        .catch(err => {
            if(err instanceof PDFServicesSdk.Error.ServiceApiError
                || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation', err);
            } else {
                console.log('Exception encountered while executing operation', err);
            }
        });
} catch (err) {
    console.log('Exception encountered while executing operation', err);
}
