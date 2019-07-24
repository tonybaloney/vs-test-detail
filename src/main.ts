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
            let out:string = enc.decode(buf);
            const dom:Document = parser.parseFromString(out, 'text/xml');

            if (!isNunitXml(dom))
                return;

            let nunitDocument = new NunitXMLDocument(document);
            let testCase = nunitDocument.getCase(testCaseName);
            for (let property of testCase.getProperties()) {
                document.getElementById("properties").innerHTML += "<strong>" + property.name + "</strong>: " + property.value + "<br/>"
            }
            document.getElementById("output").innerText = testCase.getOutput();
        };

        const scopeAttachments = function (attachments) {
            console.log(attachments);
            for (let i = 0; i < attachments.length; i++) {
                if (attachments[i].fileName.endsWith(".xml")) {
                    testClient.getTestRunAttachmentContent(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId, attachments[i].id).then(processAttachment);
                }
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