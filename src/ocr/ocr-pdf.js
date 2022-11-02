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
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
/**
 * This sample illustrates how to perform OCR operation on a PDF file and convert it into a searchable PDF file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
try {
    // Initial setup, create credentials instance.
    const credentials =  PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdfservices-api-credentials.json")
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
        ocrOperation = PDFServicesSdk.OCR.Operation.createNew();

    // Set operation input from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/ocrInput.pdf');
    ocrOperation.setInput(input);

    // Execute the operation and Save the result to the specified location.
    ocrOperation.execute(executionContext)
        .then(result => result.saveAsFile(createOutputFileDirectoryPath("output/OCRPDF","OCR","pdf")))
        .catch(err => {
            if(err instanceof PDFServicesSdk.Error.ServiceApiError
                || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation', err);
            } else {
                console.log('Exception encountered while executing operation', err);
            }
        });

    //Generates a string containing a directory structure and file name for the output file.
    function createOutputFileDirectoryPath(directory, name, format) {
        let date = new Date();
        let dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
            ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
            ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
        return (directory + '/' + name + '_' + dateString + '.' + format);
    }

} catch (err) {
    console.log('Exception encountered while executing operation', err);
}
