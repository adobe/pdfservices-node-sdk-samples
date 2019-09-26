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

const DCServicesSdk = require('@adobe/dc-services-node-sdk');
/**
 * This sample illustrates how to create a PDF file from a web page URL along with relevant conversion options.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */


/**
 * Sets any custom options for the operation.
 *
 * @param htmlToPDFOperation operation instance for which the options are provided.
 */
const setCustomOptions = (htmlToPDFOperation) => {
    // Define the page layout, in this case an 8 x 11.5 inch page (effectively portrait orientation).
    const pageLayout = new DCServicesSdk.CreatePDF.options.PageLayout();
    pageLayout.setPageSize(8, 11.5);
    // Set the desired HTML-to-PDF conversion options.
    const htmlToPdfOptions = new DCServicesSdk.CreatePDF.options.html.CreatePDFFromHtmlOptions.Builder()
        .includesHeaderFooter(true)
        .withPageLayout(pageLayout)
        .build();
    htmlToPDFOperation.setOptions(htmlToPdfOptions);
};


try {
    // Initial setup, create a ClientContext using a config file, and a new operation instance.
    const clientContext = DCServicesSdk.ClientContext.createFromFile('dc-services-sdk-config.json'),
        htmlToPDFOperation = DCServicesSdk.CreatePDF.Operation.createNew();

    // Set operation input from a URL.
    const input = DCServicesSdk.FileRef.createFromUrl(new URL('https://www.adobe.io'), DCServicesSdk.CreatePDF.SupportedMediaTypes.html);
    htmlToPDFOperation.setInput(input);

    // Provide any custom configuration options for the operation.
    setCustomOptions(htmlToPDFOperation);

    // Execute the operation and Save the result to the specified location.
    htmlToPDFOperation.execute(clientContext)
        .then(result => result.saveAsFile('output/createPdfFromUrlOutput.pdf'))
        .catch(err => console.log('Exception encountered while executing operation', err));
} catch (err) {
    console.log('Exception encountered while executing operation', err);
}
