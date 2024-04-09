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
    InsertPagesParams,
    InsertPagesJob,
    InsertPagesResult,
    SDKError,
    ServiceUsageError,
    ServiceApiError
} = require("@adobe/pdfservices-node-sdk");
const fs = require("fs");

/**
 * This sample illustrates how to insert specific pages of multiple PDF files into a single PDF file
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
(async () => {
    let baseReadStream;
    let firstReadStreamToInsert;
    let secondReadStreamToInsert;
    try {
        // Initial setup, create credentials instance
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
        });

        // Creates a PDF Services instance
        const pdfServices = new PDFServices({credentials});

        // Creates an asset(s) from source file(s) and upload
        baseReadStream = fs.createReadStream("resources/baseInput.pdf");
        firstReadStreamToInsert = fs.createReadStream("resources/firstFileToInsertInput.pdf");
        secondReadStreamToInsert = fs.createReadStream("resources/secondFileToInsertInput.pdf");
        const [baseAsset, firstAssetToInsert, secondAssetToInsert] = await pdfServices.uploadAssets({
            streamAssets: [{
                readStream: baseReadStream,
                mimeType: MimeType.PDF
            }, {
                readStream: firstReadStreamToInsert,
                mimeType: MimeType.PDF
            }, {
                readStream: secondReadStreamToInsert,
                mimeType: MimeType.PDF
            }]
        });

        // Create parameters for the job
        const params = new InsertPagesParams(baseAsset)
            // Add the first asset as input to the params, along with its page ranges and base page
            .addPagesToInsertAt({
                inputAsset: firstAssetToInsert,
                pageRanges: getPageRangesForFirstFile(),
                basePage: 2
            })
            // Add the second asset as input to the params, along with base page
            .addPagesToInsertAt({
                inputAsset: secondAssetToInsert,
                basePage: 3
            });

        // Create a new job instance
        const job = new InsertPagesJob({params});

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({job});
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: InsertPagesResult
        });

        // Get content from the resulting asset(s)
        const resultAsset = pdfServicesResponse.result.asset;
        const streamAsset = await pdfServices.getContent({asset: resultAsset});

        // Creates an output stream and copy result asset's content to it
        const outputFilePath = createOutputFilePath();
        console.log(`Saving asset at ${outputFilePath}`);

        const outputStream = fs.createWriteStream(outputFilePath);
        streamAsset.readStream.pipe(outputStream);
    } catch (err) {
        if (err instanceof SDKError || err instanceof ServiceUsageError || err instanceof ServiceApiError) {
            console.log("Exception encountered while executing operation", err);
        } else {
            console.log("Exception encountered while executing operation", err);
        }
    } finally {
        baseReadStream?.destroy();
        firstReadStreamToInsert?.destroy();
        secondReadStreamToInsert?.destroy();
    }
})();

function getPageRangesForFirstFile() {
    // Specify which pages of the first file are to be inserted in the base file
    const pageRanges = new PageRanges();
    // Add pages 1 to 3
    pageRanges.addRange(1, 3);
    // Add page 4
    pageRanges.addSinglePage(4);
    return pageRanges;
}

// Generates a string containing a directory structure and file name for the output file
function createOutputFilePath() {
    const filePath = "output/InsertPages/";
    const date = new Date();
    const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
        ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
    fs.mkdirSync(filePath, {recursive: true});
    return (`${filePath}insert${dateString}.pdf`);
}