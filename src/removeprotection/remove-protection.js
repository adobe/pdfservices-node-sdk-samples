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
 * This sample illustrates how to remove password security from a PDF document.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
try {
    // Initial setup, create credentials instance.
    const credentials = PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdfservices-api-credentials.json")
        .build();

    // Create an ExecutionContext using credentials
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

    // Create a new operation instance.
    const removeProtectionOperation = PDFServicesSdk.RemoveProtection.Operation.createNew(),
        input = PDFServicesSdk.FileRef.createFromLocalFile(
            'resources/removeProtectionInput.pdf',
            PDFServicesSdk.RemoveProtection.SupportedSourceFormat.pdf
        );
    // Set operation input from a source file.
    removeProtectionOperation.setInput(input);

    // Set the password for removing security from a PDF document.
    removeProtectionOperation.setPassword("password");

    // Execute the operation and Save the result to the specified location.
    removeProtectionOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/removeProtectionOutput.pdf'))
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
