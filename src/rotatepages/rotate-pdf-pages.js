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
 * This sample illustrates how to rotate pages in a PDF file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */

const getFirstPageRangeForRotation = () => {
    // Specify pages for rotation.
    const firstPageRange = new PDFServicesSdk.PageRanges();
    // Add page 1.
    firstPageRange.addSinglePage(1);

    // Add pages 3 to 4.
    firstPageRange.addPageRange(3, 4);

    return firstPageRange;
};

const getSecondPageRangeForRotation = () => {
    // Specify pages for rotation.
    const secondPageRange = new PDFServicesSdk.PageRanges();
    // Add page 2.
    secondPageRange.addSinglePage(2);

    return secondPageRange;
};

try {
    // Initial setup, create credentials instance.
    const credentials = PDFServicesSdk.Credentials
        .servicePrincipalCredentialsBuilder()
        .withClientId(process.env.PDF_SERVICES_CLIENT_ID)
        .withClientSecret(process.env.PDF_SERVICES_CLIENT_SECRET)
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
        rotatePagesOperation = PDFServicesSdk.RotatePages.Operation.createNew();

    // Set operation input from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/rotatePagesInput.pdf');
    rotatePagesOperation.setInput(input);

    // Sets angle by 90 degrees (in clockwise direction) for rotating the specified pages of
    // the input PDF file.
    const firstPageRange = getFirstPageRangeForRotation();
    rotatePagesOperation.setAngleToRotatePagesBy(PDFServicesSdk.RotatePages.Angle._90, firstPageRange);

    // Sets angle by 180 degrees (in clockwise direction) for rotating the specified pages of
    // the input PDF file.
    const secondPageRange = getSecondPageRangeForRotation();
    rotatePagesOperation.setAngleToRotatePagesBy(PDFServicesSdk.RotatePages.Angle._180,secondPageRange);

    //Generating a file name
    let outputFilePath = createOutputFilePath();

    // Execute the operation and Save the result to the specified location.
    rotatePagesOperation.execute(executionContext)
        .then(result => result.saveAsFile(outputFilePath))
        .catch(err => {
            if (err instanceof PDFServicesSdk.Error.ServiceApiError
                || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation', err);
            } else {
                console.log('Exception encountered while executing operation', err);
            }
        });

    //Generates a string containing a directory structure and file name for the output file.
    function createOutputFilePath() {
        let date = new Date();
        let dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
            ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
            ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
        return ("output/RotatePages/rotate" + dateString + ".pdf");
    }

} catch (err) {
    console.log('Exception encountered while executing operation', err);
}
