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
    DocumentLevelPermission,
    FieldLocation,
    FieldOptions,
    CSCAuthContext,
    CSCCredential,
    PDFElectronicSealParams,
    PDFElectronicSealJob,
    PDFElectronicSealResult,
    SDKError,
    ServiceUsageError,
    ServiceApiError
} = require("@adobe/pdfservices-node-sdk");
const fs = require("fs");

/**
 * This sample illustrates how to apply electronic seal over the PDF document using default appearance options.
 *
 * <p>
 * To know more about PDF Electronic Seal, please see the <<a href="https://www.adobe.com/go/dc_eseal_overview_doc" target="_blank">documentation</a>.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
(async () => {
    let sourceFileReadStream;
    let sealImageReadStream;
    try {
        // Initial setup, create credentials instance
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
        });

        // Creates a PDF Services instance
        const pdfServices = new PDFServices({credentials});

        // Creates an asset(s) from source file(s) and upload
        sourceFileReadStream = fs.createReadStream("resources/sampleInvoice.pdf")
        sealImageReadStream = fs.createReadStream("resources/sampleSealImage.png");
        const [sourceFileAsset, sealImageAsset] = await pdfServices.uploadAssets({
            streamAssets: [{
                readStream: sourceFileReadStream,
                mimeType: MimeType.PDF
            }, {
                readStream: sealImageReadStream,
                mimeType: MimeType.PNG
            }]
        });

        // Set the document level permission to be applied for output document
        const documentLevelPermission = DocumentLevelPermission.FORM_FILLING;

        // Set the Seal Field Name to be created in input PDF document
        const sealFieldName = "Signature1";

        // Set the page number in input document for applying seal
        const sealPageNumber = 1;

        // Set if seal should be visible or invisible
        const sealVisible = true;

        // Create FieldLocation instance and set the coordinates for applying signature
        const fieldLocation = new FieldLocation({
            left: 150,
            top: 250,
            right: 350,
            bottom: 200
        });

        // Create FieldOptions instance with required details
        const sealFieldOptions = new FieldOptions({
            visible: sealVisible,
            location: fieldLocation,
            fieldName: sealFieldName,
            pageNumber: sealPageNumber,
        });

        // Set the name of TSP Provider being used
        const providerName = "<PROVIDER_NAME>";

        // Set the access token to be used to access TSP provider hosted APIs
        const accessToken = "<ACCESS_TOKEN>";

        // Set the credential ID
        const credentialId = "<CREDENTIAL_ID>";

        // Set the PIN generated while creating credentials
        const pin = "<PIN>";

        // Create CSCAuthContext instance using access token and token type
        const authorizationContext = new CSCAuthContext({
            accessToken,
            tokenType: "Bearer"
        });

        // Create CertificateCredentials instance with required certificate details
        const certificateCredentials = new CSCCredential({
            providerName,
            credentialId,
            pin,
            authorizationContext,
        });

        // Create parameters for the job
        const params = new PDFElectronicSealParams({
            certificateCredentials,
            sealFieldOptions,
            documentLevelPermission,
        });

        // Creates a new job instance
        const job = new PDFElectronicSealJob({
            inputAsset: sourceFileAsset,
            sealImageAsset,
            params,
        });

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({job});
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: PDFElectronicSealResult
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
        sourceFileReadStream?.destroy();
        sealImageReadStream?.destroy();
    }
})();

// Generates a string containing a directory structure and file name for the output file
function createOutputFilePath() {
    const filePath = "output/ElectronicSeal/";
    const date = new Date();
    const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
        ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
    fs.mkdirSync(filePath, {recursive: true});
    return (`${filePath}seal${dateString}.pdf`);
}