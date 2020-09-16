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
 * This sample illustrates how to split input PDF into multiple PDF files on the basis of the maximum number
 * of pages each of the output files can have.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
try {
    // Initial setup, create credentials instance.
    const credentials = PDFToolsSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdftools-api-credentials.json")
        .build();

    // Create an ExecutionContext using credentials
    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials);

    // Create a new operation instance.
    const splitPDFOperation = PDFToolsSdk.SplitPDF.Operation.createNew(),
        input = PDFToolsSdk.FileRef.createFromLocalFile(
            'resources/splitPDFInput.pdf',
            PDFToolsSdk.SplitPDF.SupportedSourceFormat.pdf
        );
    // Set operation input from a source file.
    splitPDFOperation.setInput(input);

    // Set the maximum number of pages each of the output files can have.
    splitPDFOperation.setPageCount(2);

    // Execute the operation and Save the result to the specified location.
    splitPDFOperation.execute(executionContext)
        .then(result => {
            let saveFilesPromises = [];
            for(let i = 0; i < result.length; i++){
                saveFilesPromises.push(result[i].saveAsFile(`output/SplitPDFByNumberOfPagesOutput_${i}.pdf`));
            }
            return Promise.all(saveFilesPromises);
        })
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
