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
 * This sample illustrates how to replace specific pages in a PDF file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */

const getPageRangesForFirstFile = () => {
    // Specify pages of the first file for replacing the page of base PDF file.
    const pageRangesForFirstFile = new PDFToolsSdk.PageRanges();
    // Add pages 1 to 3.
    pageRangesForFirstFile.addPageRange(1, 3);

    // Add page 4.
    pageRangesForFirstFile.addSinglePage(4);

    return pageRangesForFirstFile;
};

try {
    // Initial setup, create credentials instance.
    const credentials = PDFToolsSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdftools-api-credentials.json")
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials),
        replacePagesOperation = PDFToolsSdk.ReplacePages.Operation.createNew();

    // Set operation base input from a source file.
    const baseInputFile = PDFToolsSdk.FileRef.createFromLocalFile('resources/baseInput.pdf');
    replacePagesOperation.setBaseInput(baseInputFile);

    // Create a FileRef instance using a local file.
    const firstInputFile = PDFToolsSdk.FileRef.createFromLocalFile('resources/replacePagesInput1.pdf'),
        pageRanges = getPageRangesForFirstFile();

    // Adds the pages (specified by the page ranges) of the input PDF file for replacing the
    // page of the base PDF file.
    replacePagesOperation.addPagesForReplace(1, firstInputFile, pageRanges);

    // Create a FileRef instance using a local file.
    const secondInputFile = PDFToolsSdk.FileRef.createFromLocalFile('resources/replacePagesInput2.pdf');

    // Adds all the pages of the input PDF file for replacing the page of the base PDF file.
    replacePagesOperation.addPagesForReplace(3, secondInputFile);

    // Execute the operation and Save the result to the specified location.
    replacePagesOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/replacePagesOutput.pdf'))
        .catch(err => {
            if (err instanceof PDFToolsSdk.Error.ServiceApiError
                || err instanceof PDFToolsSdk.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation', err);
            } else {
                console.log('Exception encountered while executing operation', err);
            }
        });
} catch (err) {
    console.log('Exception encountered while executing operation', err);
}
