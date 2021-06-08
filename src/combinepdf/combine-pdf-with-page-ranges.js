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
 * This sample illustrates how to combine specific pages of multiple PDF files into a single PDF file.
 * <p>
 * Note that the SDK supports combining upto 20 files in one operation
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */

const getPageRangesForFirstFile = () => {
    // Specify which pages of the first file are to be included in the combined file.
    const pageRangesForFirstFile = new PDFServicesSdk.PageRanges();
    // Add page 1.
    pageRangesForFirstFile.addSinglePage(1);
    // Add page 2.
    pageRangesForFirstFile.addSinglePage(2);
    // Add pages 3 to 4.
    pageRangesForFirstFile.addPageRange(3, 4);
    return pageRangesForFirstFile;
};

const getPageRangesForSecondFile = () => {
    // Specify which pages of the second file are to be included in the combined file.
    const pageRangesForSecondFile = new PDFServicesSdk.PageRanges();
    // Add all pages including and after page 3.
    pageRangesForSecondFile.addAllFrom(3);
    return pageRangesForSecondFile;
};

try {
    // Initial setup, create credentials instance.
    const credentials =  PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdfservices-api-credentials.json")
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
        combineFilesOperation = PDFServicesSdk.CombineFiles.Operation.createNew();

    // Create a FileRef instance from a local file.
    const combineSource1 = PDFServicesSdk.FileRef.createFromLocalFile('resources/combineFileWithPageRangeInput1.pdf'),
        pageRangesForFirstFile = getPageRangesForFirstFile();
    // Add the first file as input to the operation, along with its page range.
    combineFilesOperation.addInput(combineSource1, pageRangesForFirstFile);

    // Create a second FileRef instance using a local file.
    const combineSource2 = PDFServicesSdk.FileRef.createFromLocalFile('resources/combineFileWithPageRangeInput2.pdf'),
        pageRangesForSecondFile = getPageRangesForSecondFile();
    // Add the second file as input to the operation, along with its page range.
    combineFilesOperation.addInput(combineSource2, pageRangesForSecondFile);

    // Execute the operation and Save the result to the specified location.
    combineFilesOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/combineFilesWithPageRangesOutput.pdf'))
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
