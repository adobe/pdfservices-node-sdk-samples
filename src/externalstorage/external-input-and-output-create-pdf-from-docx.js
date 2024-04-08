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
    CreatePDFJob,
    ExternalAsset,
    ExternalStorageType,
    PDFServicesJobStatus,
    SDKError,
    ServiceUsageError,
    ServiceApiError
} = require("@adobe/pdfservices-node-sdk");

/**
 * This sample illustrates how to use external storage as input and output in PDF Services.
 * For this illustration a PDF file will be created and stored externally from a DOCX file stored externally.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
(async () => {
    try {
        // Initial setup, create credentials instance
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
        });

        // Creates a PDF Services instance
        const pdfServices = new PDFServices({credentials});

        // Creating external assets from pre signed URI
        const inputPreSignedURL = "<INPUT_PRESIGNED_URI>";
        const outputPreSignedURL = "<OUTPUT_PRESIGNED_URI>";
        const inputExternalAsset = new ExternalAsset({
            uri: inputPreSignedURL,
            storageType: ExternalStorageType.S3
        });
        const outputExternalAsset = new ExternalAsset({
            uri: outputPreSignedURL,
            storageType: ExternalStorageType.S3
        });

        // Creates a new job instance
        const job = new CreatePDFJob({
            inputAsset: inputExternalAsset,
            outputAsset: outputExternalAsset
        });

        // Submit the job and get the polling URL
        const pollingURL = await pdfServices.submit({job});

        // Poll to check job status and wait until job is done
        let pdfServicesJobStatus;
        while (pdfServicesJobStatus === undefined || pdfServicesJobStatus?.status === PDFServicesJobStatus.IN_PROGRESS) {
            console.log('Polling for status');
            pdfServicesJobStatus = await pdfServices.getJobStatus({pollingURL});

            // Wait as per retry after interval
            const retryAfter = pdfServicesJobStatus.retryInterval;
            await new Promise(resolve => setTimeout(resolve, retryAfter));
        }
        console.log("Output is now available on the provided output external storage.");
    } catch (err) {
        if (err instanceof SDKError || err instanceof ServiceUsageError || err instanceof ServiceApiError) {
            console.log("Exception encountered while executing operation", err);
        } else {
            console.log("Exception encountered while executing operation", err);
        }
    }
})();