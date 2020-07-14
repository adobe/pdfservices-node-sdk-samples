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

const PDFToolsSdk = require('@adobe/documentservices-pdftools-node-sdk');

/**
 * This sample illustrates how to provide custom http timeouts for performing an operation. This enables the
 * clients to set custom timeouts on the basis of their network speed.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
try {
    // Initial setup, create credentials and custom client config instance.
    const credentials =  PDFToolsSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdftools-api-credentials.json")
        .build();

    // Create client config instance with custom time-outs.
    const clientConfig = PDFToolsSdk.ClientConfig
        .clientConfigBuilder()
        .withConnectTimeout(10000)
        .withReadTimeout(40000)
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials,clientConfig),
        createPdfOperation = PDFToolsSdk.CreatePDF.Operation.createNew();

    // Set operation input from a source file.
    const input = PDFToolsSdk.FileRef.createFromLocalFile('resources/createPDFInput.docx');
    createPdfOperation.setInput(input);

    // Execute the operation and Save the result to the specified location.
    createPdfOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/createPDFFromDOCXWithCustomConfigOutput.pdf'))
        .catch(err => {
            if(err instanceof PDFToolsSdk.Error.ServiceApiError
                || err instanceof PDFToolsSdk.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation', err);
            } else {
                console.log('Exception encountered while executing operation', err);
            }
        });
} catch (err) {
    console.log('Exception encountered while executing operation', err);
}
