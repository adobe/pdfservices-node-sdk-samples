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

const DCServicesSdk = require('@adobe/dc-services-node-sdk'),
    fs = require('fs');

/**
 * This sample illustrates how to create a PDF file from a DOCX readable stream.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
try {
    // Initial setup, create a ClientContext using a config file, and a new operation instance.
    const clientContext = DCServicesSdk.ClientContext.createFromFile('dc-services-sdk-config.json'),
        createPdfOperation = DCServicesSdk.CreatePDF.Operation.createNew();

    // Prepare a readable stream for the file that needs to be converted.
    const docxReadableStream = fs.createReadStream('resources/createPDFInput.docx');
    // Set operation input from the source stream by specifying the stream MediaType.
    const input = DCServicesSdk.FileRef.createFromStream(docxReadableStream, DCServicesSdk.CreatePDF.SupportedMediaTypes.docx);
    createPdfOperation.setInput(input);

    // Execute the operation and Save the result to the specified location.
    createPdfOperation.execute(clientContext)
        .then(result => result.saveAsFile('output/createPDFFromDOCXStream.pdf'))
        .catch(err => console.log('Exception encountered while executing operation', err));
} catch (err) {
    console.log('Exception encountered while executing operation', err);
}
