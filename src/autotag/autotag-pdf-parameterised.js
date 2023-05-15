/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');

const args = process.argv;

/**
 * This sample illustrates how to generate a tagged PDF by setting options with command line arguments.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */

try {
    console.log("--input " + getInputFilePathFromCmdArgs(args));
    console.log("--output " + getOutputFilePathFromCmdArgs(args));
    console.log("--report " + getGenerateReportFromCmdArgs(args));
    console.log("--shift_headings " + getShiftHeadingsFromCmdArgs(args));

    // Initial setup, create credentials instance.
    const credentials =  PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdfservices-api-credentials.json")
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
        autotagPDF = PDFServicesSdk.AutotagPDF,
        autotagPDFOperation = autotagPDF.Operation.createNew();

    // Set operation input from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile(getInputFilePathFromCmdArgs(args));
    autotagPDFOperation.setInput(input);

    // Create Options
    let autotagPDFOptionsBuilder = new PDFServicesSdk.AutotagPDF.options.AutotagPDFOptions.Builder();
    autotagPDFOptionsBuilder = getShiftHeadingsFromCmdArgs(args) ? autotagPDFOptionsBuilder.shiftHeadings() : autotagPDFOptionsBuilder;
    autotagPDFOptionsBuilder = getGenerateReportFromCmdArgs(args) ? autotagPDFOptionsBuilder.generateReport() : autotagPDFOptionsBuilder;

    const autotagPDFOptions = autotagPDFOptionsBuilder.build();

    // Set operation options
    autotagPDFOperation.setOptions(autotagPDFOptions);

    let outputPath = getOutputFilePathFromCmdArgs(args);
    // Execute the operation and Save the result to the specified location.
    autotagPDFOperation.execute(executionContext)
        .then(result => {
            result.taggedPDF.saveAsFile(outputPath + 'AutotagPDFParamerterised-tagged.pdf');
            result.report?.saveAsFile(outputPath + 'AutotagPDFParamerterised-report.xlsx');
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


function getInputFilePathFromCmdArgs(args) {
    let inputFilePath = "resources/autotagPdfInput.pdf";
    let inputFilePathIndex = args.indexOf("--input");
    if (inputFilePathIndex >= 0 && inputFilePathIndex < args.length - 1) {
        inputFilePath = args[inputFilePathIndex + 1];
    }else
        console.log("input file not specified, using default value : autotagPdfInput.pdf");

    return inputFilePath;
}

function getOutputFilePathFromCmdArgs(args) {
    let outputFilePath = "output/";
    let outputFilePathIndex = args.indexOf("--output");
    if (outputFilePathIndex >= 0 && outputFilePathIndex < args.length - 1) {
        outputFilePath = args[outputFilePathIndex + 1];
    }else
        console.log("output path not specified, using default value : output/");

    return outputFilePath;
}

function getGenerateReportFromCmdArgs(args) {
    return args.includes("--report");
}

function getShiftHeadingsFromCmdArgs(args) {
    return args.includes("--shift_headings");
}