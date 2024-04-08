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
    CombinePDFParams,
    CombinePDFJob,
    CombinePDFResult,
    PageRanges,
    SDKError,
    ServiceUsageError,
    ServiceApiError
} = require("@adobe/pdfservices-node-sdk");
const fs = require("fs");

/**
 * This sample illustrates how to combine specific pages of multiple PDF files into a single PDF file.
 * <p>
 * Note that the SDK supports combining upto 20 files in one operation
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
(async () => {
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
        readStream1 = fs.createReadStream("resources/combineFilesInput1.pdf");
        readStream2 = fs.createReadStream("resources/combineFilesInput2.pdf");
        const [inputAsset1, inputAsset2] = await pdfServices.uploadAssets({
            streamAssets: [{
                readStream: readStream1,
                mimeType: MimeType.PDF
            }, {
                readStream: readStream2,
                mimeType: MimeType.PDF
            }]
        });

        // Create a CombinePDFParams instance
        const params = new CombinePDFParams()
            .addAsset(inputAsset1, getPageRangesForFirstFile())
            .addAsset(inputAsset2, getPageRangesForSecondFile());

        // Create a new job instance
        const job = new CombinePDFJob({params});

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({job});
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: CombinePDFResult
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
        readStream1?.destroy();
        readStream2?.destroy();
    }
})();

const getPageRangesForFirstFile = () => {
    // Specify which pages of the first file are to be included in the combined file.
    const pageRangesForFirstFile = new PageRanges();
    // Add page 1.
    pageRangesForFirstFile.addSinglePage(1);
    // Add page 2.
    pageRangesForFirstFile.addSinglePage(2);
    // Add pages 3 to 4.
    pageRangesForFirstFile.addRange(3, 4);
    return pageRangesForFirstFile;
};

const getPageRangesForSecondFile = () => {
    // Specify which pages of the second file are to be included in the combined file.
    const pageRangesForSecondFile = new PageRanges();
    // Add all pages including and after page 3.
    pageRangesForSecondFile.addAllFrom(3);
    return pageRangesForSecondFile;
};

// Generates a string containing a directory structure and file name for the output file
function createOutputFilePath() {
    const filePath = "output/CombinePDFWithPageRanges/";
    const date = new Date();
    const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
        ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
    fs.mkdirSync(filePath, {recursive: true});
    return (`${filePath}combine${dateString}.pdf`);
}