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
 * This sample illustrates how to reorder the pages in a PDF file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */

const getPageRangeForReorder = () => {
    // Specify order of the pages for an output document.
    const pageRanges = new PDFServicesSdk.PageRanges();

    // Add pages 3 to 4.
    pageRanges.addPageRange(3, 4);

    // Add page 1.
    pageRanges.addSinglePage(1);

    return pageRanges;
};
try {
    // Initial setup, create credentials instance.
    const credentials = PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdfservices-api-credentials.json")
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
        reorderPagesOperation = PDFServicesSdk.ReorderPages.Operation.createNew();

    // Set operation input from a source file, along with specifying the order of the pages for
    // rearranging the pages in a PDF file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/reorderPagesInput.pdf');
    const pageRanges = getPageRangeForReorder();
    reorderPagesOperation.setInput(input);
    reorderPagesOperation.setPagesOrder(pageRanges);

    // Execute the operation and Save the result to the specified location.
    reorderPagesOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/reorderPagesOutput.pdf'))
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
