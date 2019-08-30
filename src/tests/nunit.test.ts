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
    let path = 'src/tests/fixtures/pytest-nunit-report.xml';
    expect(fs.existsSync(path)).toBe(true);
    fs.readFile(path, 'utf8', function(err, contents) {
        if (err)
            throw err;
        let testDoc = (new DOMParser()).parseFromString(contents, 'text/xml');
        const testNunit = new nunit.NunitXMLDocument(testDoc);
        let resolvedCase = testNunit.getCase('integration/test_properties.py::test_attachment');
        expect(resolvedCase).toBeDefined();
        expect(resolvedCase.name).toBe("integration/test_properties.py::test_attachment");

        done();
    });
});

test('valid complex test case match test suite', (done) => {
    let path = 'src/tests/fixtures/pytest-nunit-report.xml';
    expect(fs.existsSync(path)).toBe(true);
    fs.readFile(path, 'utf8', function(err, contents) {
        if (err)
            throw err;
        let testDoc = (new DOMParser()).parseFromString(contents, 'text/xml');
        const testNunit = new nunit.NunitXMLDocument(testDoc);
        let resolvedPlan = testNunit.getPlan();
        expect(resolvedPlan.name).toBeNull();
        expect(resolvedPlan.getPropertiesList().length).toBe(5);
        let resolvedCase = testNunit.getCase('integration/test_properties.py::test_attachment');
        expect(resolvedCase).toBeDefined();
        expect(resolvedCase.getProperties().length).toBe(2);
        let resolvedSuite = resolvedCase.getTestSuite();
        expect(resolvedSuite).toBeDefined();
        expect(resolvedSuite.name).toEqual("integration/test_properties.py");
        expect(resolvedSuite.getProperties().length).toBe(1);
        done();
    });
});


test('nunit30 test suite', (done) => {
    let path = 'src/tests/fixtures/nunit30-nunit-report.xml';
    expect(fs.existsSync(path)).toBe(true);
    fs.readFile(path, 'utf8', function(err, contents) {
        if (err)
            throw err;
        let testDoc = (new DOMParser()).parseFromString(contents, 'text/xml');
        expect(nunit.isNunitXml(testDoc)).toBe(true);
        const testNunit = new nunit.NunitXMLDocument(testDoc);
        let resolvedPlan = testNunit.getPlan();
        expect(resolvedPlan.name).toEqual("mock-assembly.dll");
        expect(resolvedPlan.getPropertiesList().length).toBe(3);
        let resolvedCase = testNunit.getCase('NUnit.Tests.Assemblies.MockTestFixture.FailingTest');
        expect(resolvedCase).toBeDefined();
        expect(resolvedCase.getProperties().length).toBe(0);
        expect(resolvedCase.name).toBe("FailingTest");
        let resolvedSuite = resolvedCase.getTestSuite();
        expect(resolvedSuite).toBeDefined();
        expect(resolvedSuite.name).toBe("MockTestFixture");
        expect(resolvedSuite.getProperties().length).toBe(2);
        done();
    });
});