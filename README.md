# Samples for the DC Services NodeJS SDK

This sample project helps you get started with the DC services SDK.

The sample JS scripts illustrate how to perform PDF-related actions (such as converting to and from the PDF format) using 
the SDK.

## Prerequisites
The sample application has the following requirements:
* Node JS : Version 10.0 or above. Node installation instructions can be found 
[here](https://nodejs.org/en/download/).


## Authentication Setup

The configuration file for the samples is ```dc-services-sdk-config.json```. Before the samples can be run, replace this 
file with the dc-services-sdk-config.json you receive from Adobe when you submit the early access request form. 

The SDK also supports providing the authentication credentials at runtime, without storing them in a config file. Please
refer this [section](#create-a-pdf-file-from-a-docx-file-by-providing-in-memory-authentication-credentials) to 
know more.


## Build with npm

Run the following command to build the project:
```$xslt
npm install
```

Note that the DC Services SDK is listed as a dependency in the package.json and will be downloaded automatically.

## A Note on Logging
For logging, this SDK uses the [log4js API](https://www.npmjs.com/package/log4js) . 
Upon running, the SDK searches for a file ```config/dc-sdk-log4js-config.json``` in the working directory, and reads the logging properties from there. If no configuration file is provided, default logging, i.e. logging INFO logs to the console is enabled. The clients can change the logging settings as per their needs.

## Running the samples

The following sub-sections describe how to run the samples. Prior to running the samples, check that the configuration 
file is set up as described above and that the project has been built.

The samples code is available under the ```src``` folder. Test 
files used by the samples can be found in the ```resources``` folder. When executed, all samples create an ```output``` 
child folder under the project root directory to store their results.

### Create a PDF File
These samples illustrate how to convert files of some formats to PDF. Refer the sdk documentation of create-pdf-operation.js to see the list of all supported media types which can be converted to PDF.

#### Create a PDF File From a DOCX File 

The sample script ```create-pdf-from-docx.js``` creates a PDF file from a DOCX file.

```$xslt
node src/createpdf/create-pdf-from-docx.js
```

#### Create a PDF File From a DOCX File (Write to an OutputStream)

The sample script ```create-pdf-from-docx-to-output-stream.js``` creates a PDF file from a DOCX file. Instead of saving the result to a 
local file, it writes the result to an output stream.

```$xslt
node src/createpdf/create-pdf-from-docx-to-output-stream.js
```

#### Create a PDF File From a DOCX File (By providing in-memory Authentication credentials)

The sample script ```create-pdf-with-inmemory-auth-credentials.js``` highlights how to provide in-memory auth credentials
for performing an operation. This enables the clients to fetch the credentials from a secret server during runtime, 
instead of storing them in a file.

Before running the sample, authentication credentials need to be updated as per the instructions in the script. 
```$xslt
node src/createpdf/create-pdf-with-inmemory-auth-credentials.js
```


####  Create a PDF File From a PPTX File 

The sample script ```create-pdf-from-pptx.js``` creates a PDF file from a PPTX file.

```$xslt
node src/createpdf/create-pdf-from-pptx.js
```

#### Create a PDF File From HTML (via Zip Archive)

The sample script ```create-pdf-from-html.js``` creates a PDF file from a zip file containing the input HTML file and its resources. 
Please refer the sdk documentation of create-pdf-operation.js to see instructions on the structure of the zip file.

```$xslt
node src/createpdf/create-pdf-from-html.js
```

#### Create a PDF File From HTML (via URL)

The sample script ```create-pdf-from-url.js``` converts an HTML page specified by a URL to a PDF file.

```$xslt
node src/createpdf/create-pdf-from-url.js
```

### Export PDF To Other Formats
These samples illustrate how to export PDF files to other formats. Refer to the documentation of export-pdf-operation.js
to see the list of supported export formats.

#### Export a PDF File To a DOCX File 

The sample script ```export-pdf-to-docx.js``` converts a PDF file to a DOCX file.

```$xslt
node src/exportpdf/export-pdf-to-docx.js
```

#### Export a PDF File To an Image Format (JPEG)

The sample script ```export-pdf-to-jpeg.js``` converts a PDF file's pages to JPEG images. Note that the output is a zip archive 
containing the individual images.

```$xslt
node src/exportpdf/export-pdf-to-jpeg.js
```

### Combine PDF Files
These samples illustrate how to combine multiple PDF files into a single PDF file.

#### Combine Multiple PDF Files

The sample script ```combine-pdf.js``` combines multiple PDF files into a single PDF file. The combined PDF file contains all pages
of the source files.

```$xslt
node src/combine/combine-pdf.js
```

#### Combine Specific Pages of Multiple PDF Files

The sample script ```combine-pdf-with-page-ranges.js``` combines specific pages of multiple PDF files into a single PDF file.
 
```$xslt
node src/combine/combine-pdf-with-page-ranges.js
```

### Licensing

This project is licensed under the MIT License. See [LICENSE](LICENSE.md) for more information.
