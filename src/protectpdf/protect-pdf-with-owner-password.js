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
 * This sample illustrates how to secure a PDF file with owner password and allow certain access permissions
 * such as copying and editing the contents, and printing of the document at low resolution.
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

    // Create new permissions instance and add the required permissions
    const protectPDF = PDFServicesSdk.ProtectPDF,
        protectPDFOptions = protectPDF.options,
        permissions = protectPDFOptions.Permissions.createNew();
    permissions.addPermission(protectPDFOptions.Permission.PRINT_LOW_QUALITY);
    permissions.addPermission(protectPDFOptions.Permission.EDIT_DOCUMENT_ASSEMBLY);
    permissions.addPermission(protectPDFOptions.Permission.COPY_CONTENT);

    // Build ProtectPDF options by setting an Owner/Permissions Password, Permissions,
    // Encryption Algorithm (used for encrypting the PDF file) and specifying the type of content to encrypt.
    const options = new protectPDFOptions.PasswordProtectOptions.Builder()
            .setOwnerPassword("password")
            .setPermissions(permissions)
            .setEncryptionAlgorithm(protectPDFOptions.EncryptionAlgorithm.AES_256)
            .setContentEncryption(protectPDFOptions.ContentEncryption.ALL_CONTENT_EXCEPT_METADATA)
            .build();

    // Create a new operation instance.
    const protectPDFOperation = protectPDF.Operation.createNew(options);

    // Set operation input from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/protectPDFInput.pdf');
    protectPDFOperation.setInput(input);

    // Execute the operation and Save the result to the specified location.
    protectPDFOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/protectPDFWithOwnerPasswordOutput.pdf'))
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
