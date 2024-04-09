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
    ExportPDFToImagesJob,
    ExportPDFToImagesTargetFormat,
    ExportPDFToImagesOutputType,
    ExportPDFToImagesParams,
    ExportPDFToImagesResult,
    SDKError,
    ServiceUsageError,
    ServiceApiError
} = require("@adobe/pdfservices-node-sdk");
const fs = require("fs");

/**
 * This sample illustrates how to export a PDF file to a list of JPEG files.
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
        readStream = fs.createReadStream("resources/exportPDFToImageInput.pdf");
        const inputAsset = await pdfServices.upload({
            readStream,
            mimeType: MimeType.PDF
        });

        // Create parameters for the job
        const params = new ExportPDFToImagesParams({
            targetFormat: ExportPDFToImagesTargetFormat.JPEG,
            outputType: ExportPDFToImagesOutputType.LIST_OF_PAGE_IMAGES
        });

        // Creates a new job instance
        const job = new ExportPDFToImagesJob({inputAsset, params});

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({job});
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: ExportPDFToImagesResult
        });

        // Get content from the resulting asset(s)
        const resultAssets = pdfServicesResponse.result.assets;

        const getOutputFilePathForIndex = createOutputFilePath();
        for (let i = 0; i < resultAssets.length; i++) {
            const _outputFilePath = getOutputFilePathForIndex(i);
            console.log(`Saving asset at ${_outputFilePath}`);

            const streamAsset = await pdfServices.getContent({asset: resultAssets[i]});

            // Creates an output stream and copy stream asset's content to it
            const outputStream = fs.createWriteStream(_outputFilePath);
            streamAsset.readStream.pipe(outputStream);
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

// Generates a string containing a directory structure and file name for the output file
function createOutputFilePath() {
    const filePath = "output/ExportPDFToJPEG/";
    const date = new Date();
    const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
        ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
    fs.mkdirSync(filePath, {recursive: true});
    return (index) => `${filePath}export${dateString}_${index}.jpeg`;
}