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
 * This sample illustrates how to export a PDF file to a list of JPEG files.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 * </p>
 */

try {
    // Initial setup, create credentials instance.
    const credentials =  PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdfservices-api-credentials.json")
        .build();

    //Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
        exportPDFToImages = PDFServicesSdk.ExportPDFToImages,
        exportPdfToImagesOperation = exportPDFToImages.Operation.createNew(exportPDFToImages.SupportedTargetFormats.JPEG);

    // Set operation input from a source file
    const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/exportPDFToImageInput.pdf');
    exportPdfToImagesOperation.setInput(input);

    // Execute the operation and Save the result to the specified location.
    exportPdfToImagesOperation.execute(executionContext)
        .then(result => {
            let saveFilesPromises = [];
            for(let i = 0; i < result.length; i++){
                saveFilesPromises.push(result[i].saveAsFile(`output/exportPDFToJPEGOutput_${i}.jpeg`));
            }
            return Promise.all(saveFilesPromises);
        })
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

