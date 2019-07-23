var testCaseName = "";
VSS.init({ usePlatformScripts: true, usePlatformStyles: true });
VSS.ready(function() {
    let extensionContext = VSS.getConfiguration();

    VSS.require(["VSS/Service", "TFS/TestManagement/RestClient"], function (VSS_Service, TFS_Test_WebApi) {
        var testClient = VSS_Service.getCollectionClient(TFS_Test_WebApi.TestHttpClient5_2);
        testClient.getTestRunById(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId).then(
            function(run) {
                console.log(run);
            }
        );

        var processAttachments = function(buf){
            parser = new DOMParser();
            enc = new TextDecoder();
            out = enc.decode(buf);
            var dom = parser.parseFromString(out, 'text/xml');
            var cases = dom.getElementsByTagName('test-case');
            console.log(dom);
            for (var i=0; i<cases.length ; i++) {
                var caseName = cases[i].getAttribute('name');
                if (caseName === testCaseName) {
                    var properties = cases[i].getElementsByTagName('property');
                    for (var j=0; j<properties.length; j++){
                        name = properties[j].getAttribute('name');
                        value = properties[j].getAttribute('value');
                        document.getElementById("properties").innerHTML += "<strong>" + name + "</strong>: " + value + "<br/>"
                    }
                    var output = cases[i].getElementsByTagName('output')[0];
                    document.getElementById("output").innerText = output.textContent;
                }
            }
        }

        var scopeAttachments = function(attachments){
            console.log(attachments);
            for (var i=0; i<attachments.length; i++){
                if (attachments[i].fileName.endsWith(".xml")){
                    testClient.getTestRunAttachmentContent(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId, attachments[i].id).then(processAttachments);
                }
            }
        }

        testClient.getTestResultById(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId, extensionContext.resultId).then(
            function(result){
                testCaseName = result.automatedTestName;
                testClient.getTestRunAttachments(extensionContext.viewContext.data.mainData.project.id, extensionContext.runId).then(scopeAttachments);
            }
        );
    });
});