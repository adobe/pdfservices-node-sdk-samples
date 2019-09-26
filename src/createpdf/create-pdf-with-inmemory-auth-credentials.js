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
 * This sample illustrates how to provide in-memory auth credentials for performing an operation. This enables the
 * clients to fetch the credentials from a secret server during runtime, instead of storing them in a file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */


try {
    // Initial setup, create a ClientContext using a config file, and a new operation instance.
    const clientContext = DCServicesSdk.ClientContext.createFromFile('dc-services-sdk-config.json'),
        createPdfOperation = DCServicesSdk.CreatePDF.Operation.createNew();

    // Set operation input from a source file.
    const input = DCServicesSdk.FileRef.createFromLocalFile('resources/createPDFInput.docx');
    createPdfOperation.setInput(input);

    /*
    Set this variable to the value of "identity" key in dc-services-sdk-config.json that you received in Adobe
    Document Cloud Services SDK welcome email
    */
    const authenticationJsonString = '';
    // Create a new ClientContext instance with the provided authentication credentials.
    const authentication = DCServicesSdk.Authentication.createFromJson(authenticationJsonString),
        contextWithAuth = clientContext.withAuthentication(authentication);

    // Execute the operation and Save the result to the specified location.
    createPdfOperation.execute(contextWithAuth)
        .then(result => result.saveAsFile('output/createPDFWithInMemCredentials.pdf'))
        .catch(err => console.log('Exception encountered while executing operation', err));
} catch (err) {
    console.log('Please note that the variable authenticationJsonString needs to be initialized with the value of "identity"' +
                    ' key in dc-services-sdk-config.json file.');
    console.log('Exception encountered while executing operation', err);
}
