/// <reference types="vss-web-extension-sdk" />

import {TestHttpClient5} from "TFS/TestManagement/RestClient";
import {NunitXMLDocument, isNunitXml} from "./documents/nunit";

let testCaseName: string = "";
let parser: DOMParser = new DOMParser();
let enc: TextDecoder = new TextDecoder();

VSS.ready(function() {

    let extensionContext: any = VSS.getConfiguration();

    VSS.require(["VSS/Service", "TFS/TestManagement/RestClient"], function (VSS_Service, TFS_Test_WebApi) {
        const testClient:TestHttpClient5 = VSS_Service.getCollectionClient(TFS_Test_WebApi.TestHttpClient5);

        const processAttachment = function (buf: ArrayBuffer) {
            let out: string = enc.decode(buf);
            const dom: Document = parser.parseFromString(out, 'text/xml');

            if (!isNunitXml(dom)) {
                document.getElementById("plugin-error").innerHTML += "Attachment is not a valid NUnit 3.0 XML file. <br/>";
                return;
            }

            let nunitDocument = new NunitXMLDocument(dom);
            let testCase = nunitDocument.getCase(testCaseName);
            let testSuite = testCase.getTestSuite();

            if (!testCase) {
                document.getElementById("plugin-error").innerHTML += "Could not locate a matching test case in the results. <br/>";
                return;
            }

            if (!testSuite) {
                document.getElementById("plugin-error").innerHTML += "Could not locate a matching test suite in the results. <br/>";
                return;
            }

            document.getElementById("test-case-classname").innerText = testCase.className;
            document.getElementById("test-case-methodname").innerText = testCase.methodName;
            document.getElementById("test-case-name").innerText = testCase.name;
            document.getElementById("test-case-seed").innerText = testCase.seed;
            document.getElementById("test-case-runstate").innerText = testCase.runState;

            for (let property of testCase.getProperties()) {
                document.getElementById("test-case-properties").innerText +=  property.name + ": " + property.value;
            }
            document.getElementById("test-case-output").innerText = testCase.getOutput();

            document.getElementById("test-suite-name").innerText = testSuite.name;
            document.getElementById("test-suite-runstate").innerText = testSuite.runState;

            for (let property of testSuite.getProperties()) {
                document.getElementById("test-suite-properties").innerText +=  property.name + ": " + property.value;
            }
        };

        const scopeAttachments = function (attachments) {
            console.log(attachments);
            let foundAttachment = false;
            for (let i = 0; i < attachments.length; i++) {
                if (attachments[i].fileName.endsWith(".xml")) {
                    testClient.getTestRunAttachmentContent(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId, attachments[i].id).then(processAttachment);
                    foundAttachment = true;
                }
            }
            if (!foundAttachment){
                document.getElementById("plugin-error").innerHTML += "Could not locate an NUnit 3.0 XML attachment. <br/>";
            }
        };

        testClient.getTestResultById(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId, extensionContext.resultId).then(
            function(result){
                testCaseName = result.automatedTestName;
                testClient.getTestRunAttachments(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId).then(scopeAttachments);
            }
        );
    });
});

