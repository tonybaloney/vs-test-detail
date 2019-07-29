import * as junit from '../../documents/junit';
var fs = require('fs');


test('test invalid Junit XML file', () => {
    const testXml = "<xml/><foo></foo>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');
    expect(junit.isJunitXml(testDoc)).toBe(false);
});

test('test valid Junit XML file', () => {
    const testXml = "<testsuites></testsuites>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');
    expect(junit.isJunitXml(testDoc)).toBe(true);
});

test('test valid Junit XML file - single suite', () => {
    const testXml = "<testsuite></testsuite>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');
    expect(junit.isJunitXml(testDoc)).toBe(true);
});

test('test case match', () => {
    const testXml = "<testsuites><testsuite><testcase name='test' fullname='test'><properties></properties></testcase></testsuite></testsuites>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');

    const testXMLDoc = new junit.JunitXMLDocument(testDoc);
    expect(testXMLDoc.getCase('test')).toBeDefined();
});

test('invalid test case match', () => {
    const testXml = "<testsuites><testsuite><testcase name='test' fullname='test'><properties></properties></testcase></testsuite></testsuites>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');

    const testXMLDoc = new junit.JunitXMLDocument(testDoc);
    expect(testXMLDoc.getCase('invalid')).toBeUndefined();
});

test('junit sample 1', (done) => {
    let path = 'src/tests/fixtures/cs-junit-report.xml';
    expect(fs.existsSync(path)).toBe(true);
    fs.readFile(path, 'utf8', function(err, contents) {
        if (err)
            throw err;
        let testDoc = (new DOMParser()).parseFromString(contents, 'text/xml');
        const testXMLDoc = new junit.JunitXMLDocument(testDoc);
        let resolvedCase = testXMLDoc.getCase('should default path to an empty string');
        expect(resolvedCase).toBeDefined();
        expect(resolvedCase.name).toBe("should default path to an empty string");
        done();
    });
});

test('junit sample 2', (done) => {
    let path = 'src/tests/fixtures/ibm-junit-report.xml';
    expect(fs.existsSync(path)).toBe(true);
    fs.readFile(path, 'utf8', function(err, contents) {
        if (err)
            throw err;
        let testDoc = (new DOMParser()).parseFromString(contents, 'text/xml');
        const testXMLDoc = new junit.JunitXMLDocument(testDoc);
        let resolvedCase = testXMLDoc.getCase('Use a program name that matches the source file name');
        expect(resolvedCase).toBeDefined();
        expect(resolvedCase.getProperties().length).toBe(0);
        let resolvedSuite = resolvedCase.getTestSuite();
        expect(resolvedSuite).toBeDefined();
        expect(resolvedSuite.getProperties().length).toBe(0);
        done();
    });
});
