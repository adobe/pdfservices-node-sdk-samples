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
 * This sample illustrates how to use PDF Properties Operation to fetch various properties of an input PDF File and return them as a JSON Object.
 *
 * Refer to README.md for instructions on how to run the samples.
 */
try {

	const credentials =  PDFServicesSdk.Credentials
		.serviceAccountCredentialsBuilder()
		.fromFile("pdfservices-api-credentials.json")
		.build();

	//Create an ExecutionContext using credentials and create a new operation instance.
	const executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
		pdfPropertiesOperation = PDFServicesSdk.PDFProperties.Operation.createNew();

	// Set operation input from a source file.
	const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/pdfPropertiesInput.pdf');
	pdfPropertiesOperation.setInput(input);

	// Provide any custom configuration options for the operation.
	const options = new PDFServicesSdk.PDFProperties.options.PDFPropertiesOptions.Builder()
			.includePageLevelProperties(true)
			.build();
	pdfPropertiesOperation.setOptions(options);

	// Execute the operation and log the JSON Object.
	pdfPropertiesOperation.execute(executionContext)
		.then(result => console.log("The resultant json object is : " + JSON.stringify(result)))
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

