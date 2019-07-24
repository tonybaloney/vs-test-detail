"use strict";
/// <reference types="vss-web-extension-sdk" />
Object.defineProperty(exports, "__esModule", { value: true });
var testCaseName = "";
var parser = new DOMParser();
var enc = new TextDecoder();
function isNunitXml(document) {
    return (document.firstElementChild.className === "test-run");
}
var NunitProperty = /** @class */ (function () {
    function NunitProperty(element) {
        this.name = element.getAttribute('name');
        this.value = element.getAttribute('value');
    }
    return NunitProperty;
}());
var NunitTestCase = /** @class */ (function () {
    function NunitTestCase(element) {
        this.element = element;
    }
    NunitTestCase.prototype.getProperties = function () {
        var results = new Array();
        // @ts-ignore
        for (var _i = 0, _a = this.element.getElementsByTagName('property'); _i < _a.length; _i++) {
            var el = _a[_i];
            results.push(new NunitProperty(el));
        }
        return results;
    };
    NunitTestCase.prototype.getOutput = function () {
        return this.element.getElementsByTagName('output')[0].textContent;
    };
    return NunitTestCase;
}());
var NunitXMLDocument = /** @class */ (function () {
    function NunitXMLDocument(document) {
        if (!isNunitXml(document))
            throw new DOMException("Invalid NUnit XML document", document.firstElementChild.className);
        this.document = document;
    }
    NunitXMLDocument.prototype.getCases = function () {
        return this.document.getElementsByTagName('test-case');
    };
    NunitXMLDocument.prototype.getCase = function (name) {
        // @ts-ignore
        for (var _i = 0, _a = this.getCases(); _i < _a.length; _i++) {
            var testCase = _a[_i];
            var caseName = testCase.getAttribute('name');
            if (caseName === name) {
                return new NunitTestCase(testCase);
            }
        }
    };
    return NunitXMLDocument;
}());
VSS.ready(function () {
    var extensionContext = VSS.getConfiguration();
    VSS.require(["VSS/Service", "TFS/TestManagement/RestClient"], function (VSS_Service, TFS_Test_WebApi) {
        var testClient = VSS_Service.getCollectionClient(TFS_Test_WebApi.TestHttpClient5);
        var processAttachment = function (buf) {
            var out = enc.decode(buf);
            var dom = parser.parseFromString(out, 'text/xml');
            if (!isNunitXml(dom))
                return;
            var nunitDocument = new NunitXMLDocument(document);
            var testCase = nunitDocument.getCase(testCaseName);
            for (var _i = 0, _a = testCase.getProperties(); _i < _a.length; _i++) {
                var property = _a[_i];
                document.getElementById("properties").innerHTML += "<strong>" + property.name + "</strong>: " + property.value + "<br/>";
            }
            document.getElementById("output").innerText = testCase.getOutput();
        };
        var scopeAttachments = function (attachments) {
            console.log(attachments);
            for (var i = 0; i < attachments.length; i++) {
                if (attachments[i].fileName.endsWith(".xml")) {
                    testClient.getTestRunAttachmentContent(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId, attachments[i].id).then(processAttachment);
                }
            }
        };
        testClient.getTestResultById(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId, extensionContext.resultId).then(function (result) {
            testCaseName = result.automatedTestName;
            testClient.getTestRunAttachments(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId).then(scopeAttachments);
        });
    });
});
//# sourceMappingURL=main.js.map