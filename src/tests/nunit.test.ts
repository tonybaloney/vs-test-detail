import * as nunit from '../documents/nunit';

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