import * as nunit from '../documents/nunit';
var fs = require('fs');


test('test invalid Nunit XML file', () => {
    const testXml = "<xml/><foo></foo>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');
    expect(nunit.isNunitXml(testDoc)).toBe(false);
});

test('test valid Nunit XML file', () => {
    const testXml = "<test-run></test-run>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');
    expect(nunit.isNunitXml(testDoc)).toBe(true);
});

test('test case match', () => {
    const testXml = "<test-run><test-suite><test-case name='test' fullname='test'><properties></properties></test-case></test-suite></test-run>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');

    const testNunit = new nunit.NunitXMLDocument(testDoc);
    expect(testNunit.getCase('test')).toBeDefined();
});

test('invalid test case match', () => {
    const testXml = "<test-run><test-suite><test-case name='test' fullname='test'><properties></properties></test-case></test-suite></test-run>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');

    const testNunit = new nunit.NunitXMLDocument(testDoc);
    expect(testNunit.getCase('invalid')).toBeUndefined();
});

test('valid complex test case match', (done) => {
    let path = 'src/tests/pytest-nunit-report.xml';
    expect(fs.existsSync(path)).toBe(true);
    fs.readFile(path, 'utf8', function(err, contents) {
        if (err)
            throw err;
        let testDoc = (new DOMParser()).parseFromString(contents, 'text/xml');
        const testNunit = new nunit.NunitXMLDocument(testDoc);
        let resolvedCase = testNunit.getCase('tests/integration/test_properties.py::test_attachment');
        expect(resolvedCase).toBeDefined();
        expect(resolvedCase.name).toBe("tests/integration/test_properties.py::test_attachment");
        expect(resolvedCase.className).toBe("TestClass");
        expect(resolvedCase.methodName).toBe("test_method");
        expect(resolvedCase.runState).toBe("Runnable");
        expect(resolvedCase.seed).toBe("1");

        done();
    });
});

test('valid complex test case match test suite', (done) => {
    let path = 'src/tests/pytest-nunit-report.xml';
    expect(fs.existsSync(path)).toBe(true);
    fs.readFile(path, 'utf8', function(err, contents) {
        if (err)
            throw err;
        let testDoc = (new DOMParser()).parseFromString(contents, 'text/xml');
        const testNunit = new nunit.NunitXMLDocument(testDoc);
        let resolvedCase = testNunit.getCase('tests/integration/test_properties.py::test_attachment');
        expect(resolvedCase).toBeDefined();
        expect(resolvedCase.getProperties().length).toBe(1);
        let resolvedSuite = resolvedCase.getTestSuite();
        expect(resolvedSuite).toBeDefined();
        expect(resolvedSuite.getProperties().length).toBe(1);
        done();
    });
});
