# Samples for the PDF Services Node.js SDK

This sample project helps you get started with the  PDF Services Node.js SDK.

The sample JS scripts illustrate how to perform PDF-related actions (such as converting to and from the PDF format) using 
the SDK. **Please note that the PDF Services Node.js SDK supports only server side use cases.**

## Prerequisites
The sample application has the following requirements:
* Node.js : Version 10.13 or above. Node installation instructions can be found 
[here](https://nodejs.org/en/download/).


## Authentication Setup

The credentials file and corresponding private key file for the samples is ```pdfservices-api-credentials.json``` and ```private.key``` 
respectively. Before the samples can be run, replace both the files with the ones present in the downloaded zip file at 
the end of creation of credentials via [Get Started](https://www.adobe.io/apis/documentcloud/dcsdk/gettingstarted.html?ref=getStartedWithServicesSdk) workflow.

The SDK also supports providing the authentication credentials at runtime, without storing them in a config file. Please
refer this [section](#create-a-pdf-file-from-a-docx-file-by-providing-in-memory-authentication-credentials) to 
know more.

## Quota Exhaustion

If you receive ServiceUsageError during the Samples run, it means that trial credentials have exhausted their usage quota. 
Please [contact us](https://www.adobe.com/go/pdftoolsapi_requestform) to get paid credentials.

## Build with npm

Run the following command to build the project:
```$xslt
npm install
```

Note that the PDF Services SDK is listed as a dependency in the package.json and will be downloaded automatically.

## A Note on Logging
For logging, this SDK uses the [log4js API](https://www.npmjs.com/package/log4js) . 
Upon running, the SDK searches for a file ```config/pdfservices-sdk-log4js-config.json``` in the working directory, and reads the
logging properties from there. If no configuration file is provided, default logging, i.e. logging INFO logs to the console is enabled. The clients can change the logging settings as per their needs.

## Running the samples

The following sub-sections describe how to run the samples. Prior to running the samples, check that the configuration 
file is set up as described above and that the project has been built.

The samples code is available under the ```src``` folder. Test 
files used by the samples can be found in the ```resources``` folder. When executed, all samples create an ```output``` 
child folder under the project root directory to store their results.

### Create a PDF File
These samples illustrate how to convert files of some formats to PDF. Refer the sdk documentation of create-pdf-operation.js 
to see the list of all supported media types which can be converted to PDF.

#### Create a PDF File From a DOCX File 

The sample script ```create-pdf-from-docx.js``` creates a PDF file from a DOCX file.

```$xslt
node src/createpdf/create-pdf-from-docx.js
```

#### Create a PDF File From a DOCX File with options

The sample script ```create-pdf-from-docx-with-options.js``` creates a PDF file from a DOCX file by setting documentLanguage as
the language of input file.

```$xslt
node src/createpdf/create-pdf-from-docx-with-options.js
```

#### Create a PDF File From a DOCX Readable Stream

The sample script ```create-pdf-from-docx-stream.js``` creates a PDF file from a readable DOCX stream.

```$xslt
node src/createpdf/create-pdf-from-docx-stream.js
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

#### Create a PDF File From a DOCX File(By providing custom value for timeouts)
The sample script ```create-pdf-with-custom-timeouts``` highlights how to provide the custom value for connection timeout and read timeout.
```$xslt
node src/createpdf/create-pdf-with-custom-timeouts.js
```

####  Create a PDF File From a PPTX File 

The sample script ```create-pdf-from-pptx.js``` creates a PDF file from a PPTX file.

```$xslt
node src/createpdf/create-pdf-from-pptx.js
```

#### Create a PDF File From Static HTML (via Zip Archive)

The sample script ```create-pdf-from-static-html.js``` creates a PDF file from a zip file containing the input HTML file and its resources. 
Please refer the sdk documentation of create-pdf-operation.js to see instructions on the structure of the zip file.

```$xslt
node src/createpdf/create-pdf-from-static-html.js
```

#### Create a PDF File From Static HTML file with inline CSS

The sample script ```create-pdf-from-html-with-inline-css.js``` creates a PDF file from an input HTML file with inline CSS. 

```$xslt
node src/createpdf/create-pdf-from-html-with-inline-css.js
```

#### Create a PDF File From HTML specified via URL 

The sample script ```create-pdf-from-url.js``` creates a PDF file from an HTML specified via URL. 

```$xslt
node src/createpdf/create-pdf-from-url.js
```

#### Create a PDF File From Dynamic HTML (via Zip Archive)

The sample script ```create-pdf-from-dynamic-html.js``` converts a zip file, containing the input HTML file and its resources, along with the input data to a PDF file. The input data is used by the javascript in the HTML file to manipulate the HTML DOM, thus effectively updating the source HTML file. This mechanism can be used to provide data to the template HTML dynamically and then, convert it into a PDF file.

```$xslt
node src/createpdf/create-pdf-from-dynamic-html.js
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

#### Export a PDF File To a List of Images (JPEG)

The sample script ```export-pdf-to-jpeg-list.js``` converts a PDF file's pages to a list of JPEG images.

```$xslt
node src/exportpdf/export-pdf-to-jpeg-list.js
```

### Combine PDF Files
These samples illustrate how to combine multiple PDF files into a single PDF file.

#### Combine Multiple PDF Files

The sample script ```combine-pdf.js``` combines multiple PDF files into a single PDF file. The combined PDF file contains all pages
of the source files.

```$xslt
node src/combinepdf/combine-pdf.js
```

#### Combine Specific Pages of Multiple PDF Files

The sample script ```combine-pdf-with-page-ranges.js``` combines specific pages of multiple PDF files into into a single PDF file.
 
```$xslt
node src/combinepdf/combine-pdf-with-page-ranges.js
```

### OCR PDF File
These samples illustrate how to apply OCR(Optical Character Recognition) to a PDF file and convert it to a searchable copy of your PDF. 
The supported input format is application/pdf.

#### Convert a PDF File into a Searchable PDF File

The sample script ```ocr-pdf.js``` converts a PDF file into a searchable PDF file.

```$xslt
node src/ocr/ocr-pdf.js
```

#### Convert a PDF File into a Searchable PDF File while keeping the original image

The sample script ```ocr-pdf-with-options.js``` converts a PDF file to a searchable PDF file with maximum fidelity to the original image and default en-us locale. Refer to the documentation of ocr-options.js
to see the list of supported OCR locales and OCR types.

```$xslt
node src/ocr/ocr-pdf-with-options.js
```

### Compress PDF File

The sample illustrates how to reduce the size of a PDF file.

#### Reduce PDF File Size

The sample script ```compress-pdf.js``` reduces the size of a PDF file.

```$xslt
node src/compresspdf/compress-pdf.js
```

#### Reduce PDF File Size on the basis of Compression Level

The sample script ```compress-pdf-with-options.js``` reduces the size of a PDF file on the basis of provided compression level.
Refer to the documentation of compress-pdf-options.js to see the list of supported compression levels.

```$xslt
node src/compresspdf/compress-pdf-with-options.js
```

### Linearize PDF File

The sample illustrates how to convert a PDF file into a Linearized (also known as "web optimized") PDF file. Such PDF files are 
optimized for incremental access in network environments.

#### Convert a PDF File into a Web Optimized File

The sample script ```linearize-pdf.js``` optimizes the PDF file for a faster Web View.

```$xslt
node src/linearizepdf/linearize-pdf.js
```

### Protect PDF File

These samples illustrate how to secure a PDF file with a password.

#### Convert a PDF File into a Password Protected PDF File

The sample script ```protect-pdf.js``` converts a PDF file into a password protected PDF file.

```$xslt
node src/protectpdf/protect-pdf.js
```

#### Protect a PDF File with an Owner Password and Permissions

The sample script ```protect-pdf-with-owner-password.js``` secures an input PDF file with owner password and allows certain access permissions
such as copying and editing the contents, and printing of the document at low resolution.

```$xslt
node src/protectpdf/protect-pdf-with-owner-password.js
```

### Remove Protection

The sample illustrates how to remove a password security from a PDF document.

#### Remove Protection from a PDF File

The sample script ```remove-protection.js``` removes a password security from a secured PDF document.

```$xslt
node src/removeprotection/remove-protection.js
```

### Rotate Pages

The sample illustrates how to rotate pages in a PDF file.

#### Rotate Pages in PDF File

The sample script ```rotate-pdf-pages.js``` rotates specific pages in a PDF file.

```$xslt
node src/rotatepages/rotate-pdf-pages.js
```

### Delete Pages

The sample illustrates how to delete pages in a PDF file.

#### Delete Pages from PDF File

The sample script ```delete-pdf-pages.js``` removes specific pages from a PDF file.

```$xslt
node src/deletepages/delete-pdf-pages.js
```

### Reorder Pages

The sample illustrates how to reorder the pages in a PDF file.

#### Reorder Pages in PDF File

The sample script ```reorder-pdf-pages.js``` rearranges the pages of a PDF file according to the specified order.

```$xslt
node src/reorderpages/reorder-pdf-pages.js
```

### Insert Pages

The sample illustrates how to insert pages in a PDF file.

#### Insert Pages into a PDF File

The sample script ```insert-pdf-pages.js``` inserts pages of multiple PDF files into a base PDF file.

```$xslt
node src/insertpages/insert-pdf-pages.js
```

### Replace Pages

The sample illustrates how to replace pages of a PDF file.

#### Replace PDF File Pages with Multiple PDF Files

The sample script ```replace-pdf-pages.js``` replaces specific pages in a PDF file with pages from multiple PDF files.

```$xslt
node src/replacepages/replace-pdf-pages.js
```

### Split PDF File

These samples illustrate how to split PDF file into multiple PDF files.

#### Split PDF By Number of Pages

The sample script ```split-pdf-by-number-of-pages.js``` splits input PDF into multiple PDF files on the basis of the maximum number
of pages each of the output files can have.

```$xslt
node src/splitpdf/split-pdf-by-number-of-pages.js
```

#### Split PDF Into Number of PDF Files

The sample script ```split-pdf-into-number-of-files.js``` splits input PDF into multiple PDF files on the basis of the number
of documents.

```$xslt
node src/splitpdf/split-pdf-into-number-of-files.js
```

#### Split PDF By Page Ranges

The sample script ```split-pdf-by-page-ranges.js``` splits input PDF into multiple PDF files on the basis of page ranges.
Each page range corresponds to a single output file having the pages specified in the page range.

```$xslt
node src/splitpdf/split-pdf-by-page-ranges.js
```

### Document Merge
Adobe Document Merge Operation allows you to produce high fidelity PDF and Word documents with dynamic data inputs.
Using this operation, you can merge your JSON data with Word templates to create dynamic documents for 
contracts and agreements, invoices, proposals, reports, forms, branded marketing documents and more.
To know more about document generation and document templates, please checkout the [documentation](http://www.adobe.com/go/dcdocgen_overview_doc)

#### Merge Document to DOCX

The sample script ```merge-document-to-docx.js``` merges the Word based document template with the input JSON data to generate 
the output document in the DOCX format

```$xslt
node src/documentmerge/merge-document-to-docx.js
```

#### Merge Document to PDF

This sample script  ```merge-document-to-pdf.js``` merges the Word based document template with the input JSON data to generate
the output document in the PDF format. 

```$xslt
node src/documentmerge/merge-document-to-pdf.js
```

### Extract PDF

These samples illustrate extracting content of PDF in a structured JSON format along with the renditions inside PDF. 
The output of SDK extract operation is Zip package. The Zip package consists of following:

* The structuredData.json file with the extracted content & PDF element structure. See the [JSON schema](https://opensource.adobe.com/pdftools-sdk-docs/release/shared/extractJSONOutputSchema.json). Please refer the [Styling JSON schema](https://opensource.adobe.com/pdftools-sdk-docs/release/shared/extractJSONOutputSchemaStylingInfo.json) for a description of the output when the styling option is enabled.
* A renditions folder(s) containing renditions for each element type selected as input. 
  The folder name is either “tables” or “figures” depending on your specified element type. 
  Each folder contains renditions with filenames that correspond to the element information in the JSON file. 

#### Extract Text Elements

The sample script ```extract-text-info-from-pdf.js``` extracts text elements from PDF Document.

```$xslt
node src/extractpdf/extract-text-info-from-pdf.js
```

#### Extract Text, Table Elements

The sample script ```extract-text-table-info-from-pdf.js``` extracts text, table elements from PDF Document.

```$xslt
node src/extractpdf/extract-text-table-info-from-pdf.js
```

#### Extract Text, Table Elements with Renditions of Table Elements

The sample script ```extract-text-table-info-with-tables-renditions-from-pdf.js``` extracts text, table elements along with table renditions from PDF Document.
Note that the output is a zip containing the structured information along with renditions as described in [section](#extract-pdf).

```$xslt
node src/extractpdf/extract-text-table-info-with-tables-renditions-from-pdf.js
```

#### Extract Text, Table Elements with Renditions of Figure, Table Elements

The sample script ```extract-text-table-info-with-figures-tables-renditions-from-pdf.js``` extracts text, table elements along with figure 
and table element's renditions from PDF Document. Note that the output is a zip containing the structured information 
along with renditions as described in [section](#extract-pdf).

```$xslt
node src/extractpdf/extract-text-table-info-with-figures-tables-renditions-from-pdf.js
```

#### Extract Text, Table Elements and bounding boxes for Characters present in text blocks with Renditions of Table Elements

The sample script ```extract-text-table-info-with-char-bounds-from-pdf.js``` extracts text, table elements, bounding boxes for characters present in text blocks and table element's renditions from PDF Document. 
Note that the output is a zip containing the structured information along with renditions as described in [section](#extract-pdf).

```$xslt
node src/extractpdf/extract-text-table-info-with-char-bounds-from-pdf.js
```

#### Extract Text, Table Elements with Renditions and CSV's of Table Elements

The sample script ```extract-text-table-info-with-tables-structure-from-pdf.js``` extracts text, table elements, table structures as CSV and table element's renditions from PDF Document. Note that the output is a zip containing the structured information along with renditions as described in [section](#extract-pdf).

```$xslt
node src/extractpdf/extract-text-table-info-with-tables-structure-from-pdf.js
```

#### Extract Text, Table Elements with Styling information of text

The sample script ```extract-text-table-info-with-styling-info-from-pdf``` extracts text and table elements along with the styling information of the text blocks. Note that the output is a zip containing the structured information along with renditions as described in [section](#extract-pdf).

```$xslt
node src/extractpdf/extract-text-table-info-with-styling-info-from-pdf.js
```

### Fetch PDF Properties

These samples illustrate how to fetch properties of a PDF file in the JSON format.

#### Fetch PDF Properties as a JSON File

The sample script ```pdf-properties-as-file.js``` fetches the properties of an input PDF, as a JSON file.

```$xslt
node src/pdfproperties/pdf-properties-as-file.js
```

#### Fetch PDF Properties as a JSON Object
The sample script ```pdf-properties-as-json.js``` fetches the properties of an input PDF, as a JSON Object.

```$xslt
node src/pdfproperties/pdf-properties-as-json.js
```

### Licensing

This project is licensed under the MIT License. See [LICENSE](LICENSE.md) for more information.
