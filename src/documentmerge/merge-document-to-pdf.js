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

const PDFServicesSdk = require('@adobe/pdfservices-node-sdk'),
    fs = require('fs');

/**
 * This sample illustrates how to merge the Word based document template with the input JSON data to generate
 * the output document in the PDF format.
 * <p>
 * To know more about document generation and document templates, please see the <a href="http://www.adobe.com/go/dcdocgen_overview_doc">documentation</a>
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
try {
    // Initial setup, create credentials instance.
    const credentials =  PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdfservices-api-credentials.json")
        .build();

    // Setup input data for the document merge process
    const jsonString = fs.readFileSync('resources/salesOrder.json'),
        jsonDataForMerge = JSON.parse(jsonString);

    // Create an ExecutionContext using credentials
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

    // Create a new DocumentMerge options instance
    const documentMerge = PDFServicesSdk.DocumentMerge,
        documentMergeOptions = documentMerge.options,
        options = new documentMergeOptions.DocumentMergeOptions(jsonDataForMerge, documentMergeOptions.OutputFormat.PDF);

    // Create a new operation instance using the options instance
    const documentMergeOperation = documentMerge.Operation.createNew(options)

    // Set operation input document template from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/salesOrderTemplate.docx');
    documentMergeOperation.setInput(input);

    // Execute the operation and Save the result to the specified location.
    documentMergeOperation.execute(executionContext)
        .then(result => result.saveAsFile('output/salesOrderOutput.pdf'))
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

