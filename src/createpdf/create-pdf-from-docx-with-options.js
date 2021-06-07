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
 * This sample illustrates how to provide documentLanguage option when creating a pdf file from docx file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */


/**
 * Sets any custom options for the operation.
 *
 * @param createPdfOperation operation instance for which the options are provided.
 */
const setCustomOptions = (createPdfOperation) => {
    // Select the documentLanguage for input file.
    const documentLanguage = PDFServicesSdk.CreatePDF.options.word.SupportedDocumentLanguage.EN_US;

    // Set the desired WORD-to-PDF conversion options with documentLanguage.
    const createPdfOptions = new PDFServicesSdk.CreatePDF.options.word.CreatePDFFromWordOptions.Builder()
        .withDocumentLanguage(documentLanguage).build();
    createPdfOperation.setOptions(createPdfOptions);
};

try {
    // Initial setup, create credentials instance.
    const credentials =  PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdfservices-api-credentials.json")
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
        createPdfOperation = PDFServicesSdk.CreatePDF.Operation.createNew();

    // Set operation input from a source file.
        const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/createPDFInput.docx');
    createPdfOperation.setInput(input);

    // Provide any custom configuration options for the operation.
    setCustomOptions(createPdfOperation);

    // Execute the operation and Save the result to the specified location.
    createPdfOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/createPDFFromDOCXWithOptionsOutput.pdf'))
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
