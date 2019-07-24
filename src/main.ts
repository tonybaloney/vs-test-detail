let testCaseName = "";

function isNunitXml(dom){
    return true;
}

VSS.init({ usePlatformScripts: true, usePlatformStyles: true });
VSS.ready(function() {
    let parser = new DOMParser();
    let enc = new TextDecoder();
    let extensionContext = VSS.getConfiguration();

    VSS.require(["VSS/Service", "TFS/TestManagement/RestClient"], function (VSS_Service, TFS_Test_WebApi) {
        const testClient = VSS_Service.getCollectionClient(TFS_Test_WebApi.TestHttpClient5_2);
        testClient.getTestRunById(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId).then(
            function(run) {
                console.log(run);
            }
        );

        const processAttachment = function (buf) {
            let out = enc.decode(buf);
            const dom = parser.parseFromString(out, 'text/xml');

            if (!isNunitXml(dom))
                return;

            const cases = dom.getElementsByTagName('test-case');
            console.log(dom);
            for (var i = 0; i < cases.length; i++) {
                var caseName = cases[i].getAttribute('name');
                if (caseName === testCaseName) {
                    const properties = cases[i].getElementsByTagName('property');
                    for (let j = 0; j < properties.length; j++) {
                        let name = properties[j].getAttribute('name');
                        let value = properties[j].getAttribute('value');
                        document.getElementById("properties").innerHTML += "<strong>" + name + "</strong>: " + value + "<br/>"
                    }
                    const output = cases[i].getElementsByTagName('output')[0];
                    document.getElementById("output").innerText = output.textContent;
                }
            }
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