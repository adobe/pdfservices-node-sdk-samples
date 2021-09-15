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
 * This sample illustrates how to use PDF Properties Operation to fetch various properties of an input PDF File and save them as a JSON file.
 *
 * Refer to README.md for instructions on how to run the samples.
 */
try {

	const credentials =  PDFServicesSdk.Credentials
		.serviceAccountCredentialsBuilder()
		.fromFile("pdfservices-api-credentials.json")
		.build();

	//Create an ExecutionContext using credentials and create a new operation instance.
	const clientContext = PDFServicesSdk.ExecutionContext.create(credentials),
		pdfPropertiesOperation = PDFServicesSdk.PDFProperties.Operation.createNew();

	// Set operation input from a source file.
	const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/pdfPropertiesInput.pdf');
	pdfPropertiesOperation.setInput(input);

	// Execute the operation and Save the result to the specified location.
	pdfPropertiesOperation.executeAndReturnFileRef(clientContext)
		.then(result => result.saveAsFile('output/PDFPropertiesOutput.json'))
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

