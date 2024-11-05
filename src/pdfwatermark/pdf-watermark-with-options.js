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
    WatermarkAppearance,
    PDFWatermarkParams,
    PDFWatermarkJob,
    PDFWatermarkResult,
    SDKError,
    ServiceUsageError,
    ServiceApiError,
    PageRanges
} = require("@adobe/pdfservices-node-sdk");
const fs = require("fs");

/**
 * This sample illustrates how to apply watermark to a PDF file.
 * It showcases how to customize watermarking with specific page ranges and appearance settings.
 * <p>
 * Note that PDF Watermark operation on a PDF file results in a PDF file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
(async () => {
    let sourceFileReadStream;
    let waterMarkReadStream;
    try {
        // Initial setup, create credentials instance
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
        });

        // Creates a PDF Services instance
        const pdfServices = new PDFServices({credentials});

        // Creates an asset(s) from source file(s) and upload
        sourceFileReadStream = fs.createReadStream("resources/watermarkPDFInput.pdf");
        waterMarkReadStream = fs.createReadStream("resources/watermark.pdf");
        const [inputAsset, watermarkAsset] = await pdfServices.uploadAssets({
            streamAssets: [{
                readStream: sourceFileReadStream,
                mimeType: MimeType.PDF
            }, {
                readStream: waterMarkReadStream,
                mimeType: MimeType.PDF
            }]
        });

        // watermark pages of the document (as specified by PageRanges).
        const pageRangesForWatermark = getPageRangesForWatermark();
        const watermarkAppearance = new WatermarkAppearance({
            appearOnForeground: false,
            opacity: 50,
        });

        // Create parameters for the job
        const pdfWatermarkParams = new PDFWatermarkParams({
            watermarkAppearance: watermarkAppearance,
            pageRanges: pageRangesForWatermark
        })

        // Creates a new job instance
        const job = new PDFWatermarkJob({
            inputAsset: inputAsset,
            watermarkAsset: watermarkAsset,
            params: pdfWatermarkParams
        });

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({job});
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: PDFWatermarkResult
        });

        // Get content from the resulting asset(s)
        const resultAsset = pdfServicesResponse.result.asset;
        const streamAsset = await pdfServices.getContent({asset: resultAsset});

        // Creates an output stream and copy stream asset's content to it
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
        sourceFileReadStream?.destroy();
        waterMarkReadStream?.destroy();
    }
})();

function getPageRangesForWatermark() {
    // Specify pages for deletion.
    const pageRangesForWatermark = new PageRanges();
    // Add page 1.
    pageRangesForWatermark.addSinglePage(1);
    // Add pages 3 to 4.
    pageRangesForWatermark.addRange(3, 4);
    return pageRangesForWatermark;
}

// Generates a string containing a directory structure and file name for the output file
function createOutputFilePath() {
    const filePath = "output/PDFWatermarkWithOptions/";
    const date = new Date();
    const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
        ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
    fs.mkdirSync(filePath, {recursive: true});
    return (`${filePath}watermark${dateString}.pdf`);
}
