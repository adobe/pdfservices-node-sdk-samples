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
    PageRanges,
    RotatePagesParams,
    Angle,
    RotatePagesJob,
    RotatePagesResult,
    SDKError,
    ServiceUsageError,
    ServiceApiError
} = require("@adobe/pdfservices-node-sdk");
const fs = require("fs");

/**
 * This sample illustrates how to rotate pages in a PDF file
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
(async () => {
    let readStream;
    try {
        // Initial setup, create credentials instance
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
        });

        // Creates a PDF Services instance
        const pdfServices = new PDFServices({credentials});

        // Creates an asset(s) from source file(s) and upload
        readStream = fs.createReadStream("resources/rotatePagesInput.pdf");
        const inputAsset = await pdfServices.upload({
            readStream,
            mimeType: MimeType.PDF
        });

        // First set of page ranges for rotating the specified pages of the input PDF file
        const firstPageRange = getFirstPageRangeForRotation();

        // Second set of page ranges for rotating the specified pages of the input PDF file
        const secondPageRange = getSecondPageRangeForRotation();

        // Create parameters for the job
        const params = new RotatePagesParams()
            .setAngleToRotatePagesBy(Angle._90, firstPageRange)
            .setAngleToRotatePagesBy(Angle._180, secondPageRange);

        // Creates a new job instance
        const job = new RotatePagesJob({inputAsset, params});

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({job});
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: RotatePagesResult
        });

        // Get content from the resulting asset(s)
        const resultAsset = pdfServicesResponse.result.asset;
        const streamAsset = await pdfServices.getContent({asset: resultAsset});

        // Creates a write stream and copy stream asset's content to it
        const outputFilePath = createOutputFilePath();
        console.log(`Saving asset at ${outputFilePath}`);

        const writeStream = fs.createWriteStream(outputFilePath);
        streamAsset.readStream.pipe(writeStream);
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

function getFirstPageRangeForRotation() {
    // Specify pages for rotation.
    const firstPageRange = new PageRanges();
    // Add page 1.
    firstPageRange.addSinglePage(1);
    // Add pages 3 to 4.
    firstPageRange.addRange(3, 4);
    return firstPageRange;
}

function getSecondPageRangeForRotation() {
    // Specify pages for rotation.
    const secondPageRange = new PageRanges();
    // Add page 2.
    secondPageRange.addSinglePage(2);
    return secondPageRange;
}

// Generates a string containing a directory structure and file name for the output file
function createOutputFilePath() {
    const filePath = "output/RotatePages/";
    const date = new Date();
    const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
        ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
    fs.mkdirSync(filePath, {recursive: true});
    return (`${filePath}rotate${dateString}.pdf`);
}