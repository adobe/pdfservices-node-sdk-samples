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
 * This sample illustrates how to perform an OCR operation on a PDF file and convert it into an searchable PDF file on
 * the basis of provided locale and SEARCHABLE_IMAGE_EXACT ocr type to keep the original image
 * (Recommended for cases requiring maximum fidelity to the original image.).
 * <p>
 * Note that OCR operation on a PDF file results in a PDF file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
try {
    // Initial setup, create credentials instance.
    const credentials =  PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdfservices-api-credentials.json")
        .build();

    //Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
        ocrOperation = PDFServicesSdk.OCR.Operation.createNew();

    // Set operation input from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/ocrInput.pdf');
    ocrOperation.setInput(input);

    // Provide any custom configuration options for the operation.
    const options = new PDFServicesSdk.OCR.options.OCROptions.Builder()
        .withOcrType(PDFServicesSdk.OCR.options.OCRSupportedType.SEARCHABLE_IMAGE_EXACT)
        .withOcrLang(PDFServicesSdk.OCR.options.OCRSupportedLocale.EN_US)
        .build();
    ocrOperation.setOptions(options);

    // Execute the operation and Save the result to the specified location.
    ocrOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/ocrWithOptionsOutput.pdf'))
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
