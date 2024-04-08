/*
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const {
    ServicePrincipalCredentials,
    PDFServices,
    MimeType,
    AutotagPDFParams,
    AutotagPDFJob,
    AutotagPDFResult,
    SDKError,
    ServiceUsageError,
    ServiceApiError
} = require("@adobe/pdfservices-node-sdk");
const fs = require("fs");
const args = process.argv;

/**
 * This sample illustrates how to generate a tagged PDF by setting options with command line arguments.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
(async () => {
    let readStream;
    try {
        console.log("--input " + getInputFilePathFromCmdArgs(args));
        console.log("--output " + getOutputFilePathFromCmdArgs(args));
        console.log("--report " + getGenerateReportFromCmdArgs(args));
        console.log("--shift_headings " + getShiftHeadingsFromCmdArgs(args));

        // Initial setup, create credentials instance
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
        });

        // Creates a PDF Services instance
        const pdfServices = new PDFServices({credentials});

        // Creates an asset(s) from source file(s) and upload
        readStream = fs.createReadStream(getInputFilePathFromCmdArgs(args));
        const inputAsset = await pdfServices.upload({
            readStream,
            mimeType: MimeType.PDF
        });

        // Create parameters for the job
        const params = new AutotagPDFParams({
            generateReport: getGenerateReportFromCmdArgs(args),
            shiftHeadings: getShiftHeadingsFromCmdArgs(args)
        });

        // Creates a new job instance
        const job = new AutotagPDFJob({inputAsset, params});

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({job});
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: AutotagPDFResult
        });

        // Get content from the resulting asset(s)
        const resultAsset = pdfServicesResponse.result.taggedPDF;
        const resultAssetReport = pdfServicesResponse.result.report;
        const streamAsset = await pdfServices.getContent({asset: resultAsset});
        const streamAssetReport = resultAssetReport
            ? await pdfServices.getContent({asset: resultAssetReport})
            : undefined;

        // Creates an output stream and copy stream asset's content to it
        const outputPath = getOutputFilePathFromCmdArgs(args);
        const outputFilePath = outputPath + "autotagPDFInput-tagged.pdf";
        console.log(`Saving asset at ${outputFilePath}`);

        const writeStream = fs.createWriteStream(outputFilePath);
        streamAsset.readStream.pipe(writeStream);
        if (resultAssetReport) {
            const outputFileReportPath = outputPath + "autotagPDFInput-report.xlsx";
            console.log(`Saving asset at ${outputFileReportPath}`);

            const writeStream = fs.createWriteStream(outputFileReportPath);
            streamAssetReport.readStream.pipe(writeStream);
        }
    } catch (err) {
        if (err instanceof SDKError || err instanceof ServiceUsageError || err instanceof ServiceApiError) {
            console.log("Exception encountered while executing operation", err);
        } else {
            console.log("Exception encountered while executing operation", err);
        }
    } finally {
        readStream?.destroy();
    }
})();

function getInputFilePathFromCmdArgs(args) {
    let inputFilePath = "resources/autotagPdfInput.pdf";
    let inputFilePathIndex = args.indexOf("--input");
    if (inputFilePathIndex >= 0 && inputFilePathIndex < args.length - 1) {
        inputFilePath = args[inputFilePathIndex + 1];
    } else
        console.log("input file not specified, using default value : autotagPdfInput.pdf");
    return inputFilePath;
}

function getOutputFilePathFromCmdArgs(args) {
    let outputFilePath = "output/AutotagPDFWithParameters/";
    let outputFilePathIndex = args.indexOf("--output");
    if (outputFilePathIndex >= 0 && outputFilePathIndex < args.length - 1) {
        outputFilePath = args[outputFilePathIndex + 1];
    } else {
        console.log("output path not specified, using default value :" + outputFilePath);
        fs.mkdirSync(outputFilePath, {recursive: true});
    }
    return outputFilePath;
}

function getGenerateReportFromCmdArgs(args) {
    return args.includes("--report");
}

function getShiftHeadingsFromCmdArgs(args) {
    return args.includes("--shift_headings");
}