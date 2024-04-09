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
    InsertPagesResult,
    ReplacePagesJob,
    ReplacePagesParams,
    SDKError,
    ServiceUsageError,
    ServiceApiError
} = require("@adobe/pdfservices-node-sdk");
const fs = require("fs");

/**
 * This sample illustrates how to replace specific pages in a PDF file
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */

(async () => {
    let baseReadStream;
    let readStream1;
    let readStream2;
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
        readStream1 = fs.createReadStream("resources/replacePagesInput1.pdf");
        readStream2 = fs.createReadStream("resources/replacePagesInput2.pdf");
        const [baseAsset, asset1, asset2] = await pdfServices.uploadAssets({
            streamAssets: [{
                readStream: baseReadStream,
                mimeType: MimeType.PDF
            }, {
                readStream: readStream1,
                mimeType: MimeType.PDF
            }, {
                readStream: readStream2,
                mimeType: MimeType.PDF
            }]
        });

        // Create parameters for the job
        const params = new ReplacePagesParams(baseAsset)
            // Add the first asset as input to the params, along with its page ranges and base page
            .addPagesForReplace({
                asset: asset1,
                pageRanges: getPageRangesForFirstFile(),
                basePage: 1
            })
            // Add the second asset as input to the params, along with base page
            .addPagesForReplace({
                asset: asset2,
                basePage: 3
            });

        // Create a new job instance
        const job = new ReplacePagesJob({params});

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
        readStream1?.destroy();
        readStream2?.destroy();
    }
})();

function getPageRangesForFirstFile() {
    // Specify pages of the first file for replacing the page of base PDF file
    const pageRanges = new PageRanges();
    // Add pages 1 to 3
    pageRanges.addRange(1, 3);
    // Add page 4
    pageRanges.addSinglePage(4);
    return pageRanges;
}

// Generates a string containing a directory structure and file name for the output file
function createOutputFilePath() {
    const filePath = "output/ReplacePages/";
    const date = new Date();
    const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
        ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
    fs.mkdirSync(filePath, {recursive: true});
    return (`${filePath}replace${dateString}.pdf`);
}