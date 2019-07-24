# vs-nunit

[![Build Status](https://dev.azure.com/AnthonyShaw/vs-nunit/_apis/build/status/tonybaloney.vs-nunit?branchName=master)](https://dev.azure.com/AnthonyShaw/vs-nunit/_build/latest?definitionId=6&branchName=master)

An NUnit UI extension for test cases in Azure DevOps (VSO)

Loads NUnit XML 3.0 test results and displays additional detail in the test console

![](screenshot.png)

### Install

The project can be installed using npm

```
npm install
```

### Build

To build the components:

```
npm run build
```

The package will be within the `dist/` directory as a VSIX extension file.

### Testing

The test suite is written in TypeScript and kept within the source dir. To run jest, call:

```
npm run test
```
