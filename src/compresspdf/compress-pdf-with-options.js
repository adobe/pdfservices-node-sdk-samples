/*
 * Copyright 2021 Adobe
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
 * This sample illustrates how to compress PDF by reducing the size of the PDF file
 * on the basis of provided compression level.
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
        compressPDF = PDFServicesSdk.CompressPDF,
        compressPDFOperation = compressPDF.Operation.createNew();

    // Set operation input from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/compressPDFInput.pdf');
    compressPDFOperation.setInput(input);

    // Provide any custom configuration options for the operation.
    const options = new compressPDF.options.CompressPDFOptions.Builder()
        .withCompressionLevel(PDFServicesSdk.CompressPDF.options.CompressionLevel.LOW)
        .build();
    compressPDFOperation.setOptions(options);

    // Execute the operation and Save the result to the specified location.
    compressPDFOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/compressPDFWithOptionsOutput.pdf'))
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
