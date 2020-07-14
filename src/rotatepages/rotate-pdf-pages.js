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
 * This sample illustrates how to rotate pages in a PDF file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */

const getFirstPageRangeForRotation = () => {
    // Specify pages for rotation.
    const firstPageRange = new PDFToolsSdk.PageRanges();
    // Add page 1.
    firstPageRange.addSinglePage(1);

    // Add pages 3 to 4.
    firstPageRange.addPageRange(3, 4);

    return firstPageRange;
};

const getSecondPageRangeForRotation = () => {
    // Specify pages for rotation.
    const secondPageRange = new PDFToolsSdk.PageRanges();
    // Add page 2.
    secondPageRange.addSinglePage(2);

    return secondPageRange;
};

try {
    // Initial setup, create credentials instance.
    const credentials = PDFToolsSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdftools-api-credentials.json")
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials),
        rotatePagesOperation = PDFToolsSdk.RotatePages.Operation.createNew();

    // Set operation input from a source file.
    const input = PDFToolsSdk.FileRef.createFromLocalFile('resources/rotatePagesInput.pdf');
    rotatePagesOperation.setInput(input);

    // Sets angle by 90 degrees (in clockwise direction) for rotating the specified pages of
    // the input PDF file.
    const firstPageRange = getFirstPageRangeForRotation();
    rotatePagesOperation.setAngleToRotatePagesBy(PDFToolsSdk.RotatePages.Angle._90, firstPageRange);

    // Sets angle by 180 degrees (in clockwise direction) for rotating the specified pages of
    // the input PDF file.
    const secondPageRange = getSecondPageRangeForRotation();
    rotatePagesOperation.setAngleToRotatePagesBy(PDFToolsSdk.RotatePages.Angle._180,secondPageRange);

    // Execute the operation and Save the result to the specified location.
    rotatePagesOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/rotatePagesOutput.pdf'))
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
