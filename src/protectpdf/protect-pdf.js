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
 * This sample illustrates how to convert a PDF file into a password protected PDF file.
 * The password is used for encrypting PDF contents and will be required for viewing the PDF file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
try {
    // Initial setup, create credentials instance.
    const credentials =  PDFToolsSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdftools-api-credentials.json")
        .build();

    // Create an ExecutionContext using credentials
    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials);

    // Build ProtectPDF options by setting a User Password and Encryption
    // Algorithm (used for encrypting the PDF file).
    const protectPDF = PDFToolsSdk.ProtectPDF,
        options = new protectPDF.options.PasswordProtectOptions.Builder()
            .setUserPassword("encryptPassword")
            .setEncryptionAlgorithm(PDFToolsSdk.ProtectPDF.options.EncryptionAlgorithm.AES_256)
            .build();

    // Create a new operation instance.
    const protectPDFOperation = protectPDF.Operation.createNew(options);

    // Set operation input from a source file.
    const input = PDFToolsSdk.FileRef.createFromLocalFile('resources/protectPDFInput.pdf');
    protectPDFOperation.setInput(input);

    // Execute the operation and Save the result to the specified location.
    protectPDFOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/protectPDFOutput.pdf'))
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
