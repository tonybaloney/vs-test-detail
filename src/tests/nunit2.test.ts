import * as nunit from '../documents/nunit2';
var fs = require('fs');


test('test invalid Nunit XML file', () => {
    const testXml = "<xml/><foo></foo>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');
    expect(nunit.isNunit2Xml(testDoc)).toBe(false);
});

test('test valid Nunit XML file', () => {
    const testXml = "<test-results></test-results>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');
    expect(nunit.isNunit2Xml(testDoc)).toBe(true);
});

test('test case match', () => {
    const testXml = "<test-results><test-suite><results><test-case name='test' fullname='test'><properties></properties></test-case></results></test-suite></test-results>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');

    const testNunit = new nunit.Nunit2XMLDocument(testDoc);
    expect(testNunit.getCase('test')).toBeDefined();
});

test('invalid test case match', () => {
    const testXml = "<test-results><test-suite><results><test-case name='test' fullname='test'><properties></properties></test-case></results></test-suite></test-results>"
    const testDoc = (new DOMParser()).parseFromString(testXml, 'text/xml');

    const testNunit = new nunit.Nunit2XMLDocument(testDoc);
    expect(testNunit.getCase('invalid')).toBeUndefined();
});

test('valid complex test case match', (done) => {
    let path = 'src/tests/jest-nunit-report.xml';
    expect(fs.existsSync(path)).toBe(true);
    fs.readFile(path, 'utf8', function(err, contents) {
        if (err)
            throw err;
        let testDoc = (new DOMParser()).parseFromString(contents, 'text/xml');
        const testNunit = new nunit.Nunit2XMLDocument(testDoc);
        let resolvedCase = testNunit.getCase(' test valid Nunit XML file');
        expect(resolvedCase).toBeDefined();
        expect(resolvedCase.name).toBe(" test valid Nunit XML file");

        done();
    });
});

test('jest-nunit-reporter test suite', (done) => {
    let path = 'src/tests/jest-nunit-report.xml';
    expect(fs.existsSync(path)).toBe(true);
    fs.readFile(path, 'utf8', function(err, contents) {
        if (err)
            throw err;
        let testDoc = (new DOMParser()).parseFromString(contents, 'text/xml');
        const testNunit = new nunit.Nunit2XMLDocument(testDoc);
        let resolvedCase = testNunit.getCase(' test valid Nunit XML file');
        expect(resolvedCase).toBeDefined();
        expect(resolvedCase.getProperties().length).toBe(0);
        let resolvedSuite = resolvedCase.getTestSuite();
        expect(resolvedSuite).toBeDefined();
        expect(resolvedSuite.getProperties().length).toBe(0);
        done();
    });
});

test('nunit 2.5 test suite', (done) => {
    let path = 'src/tests/nunit25-nunit-report.xml';
    expect(fs.existsSync(path)).toBe(true);
    fs.readFile(path, 'utf8', function(err, contents) {
        if (err)
            throw err;
        let testDoc = (new DOMParser()).parseFromString(contents, 'text/xml');
        const testNunit = new nunit.Nunit2XMLDocument(testDoc);
        let resolvedCase = testNunit.getCase('NUnit.Tests.Assemblies.MockTestFixture.FailingTest');
        expect(resolvedCase).toBeDefined();
        expect(resolvedCase.name).toBe("NUnit.Tests.Assemblies.MockTestFixture.FailingTest");
        expect(resolvedCase).toBeDefined();
        expect(resolvedCase.getProperties().length).toBe(0);
        let resolvedSuite = resolvedCase.getTestSuite();
        expect(resolvedSuite).toBeDefined();
        expect(resolvedSuite.getProperties().length).toBe(0);
        done();
    });
});