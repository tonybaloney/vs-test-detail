# vs-test-detail

[![Build Status](https://dev.azure.com/AnthonyShaw/vs-test-detail/_apis/build/status/tonybaloney.vs-test-detail?branchName=master)](https://dev.azure.com/AnthonyShaw/vs-test-detail/_build/latest?definitionId=6&branchName=master)

A UI extension for test cases in Azure DevOps (VSO)

* Currently supports NUnit XML 2/3 test results and displays additional detail in the test console

![](images/screenshot.png)

## Compatibility

NUnit XML output provides more granular data. The amount of data shown will depend on the plugin output.

| Platform/Plugin      | NUnit Output           | Supported?  |
| -------------------- |:-----------------:| -----:|
| Pytest/[pytest-nunit](https://pypi.org/project/pytest-nunit/)  | 3.0 XML | **Yes** |
| Node/[jest-nunit-reporter](https://www.npmjs.com/package/jest-nunit-reporter) | 2.0 XML      |   Yes  (minimal data) |
| .NET/NUnit 2                        | 2.5 XML      |   **Yes** (minimal data) |
| .NET/NUnit 3                        | 3.0 XML      |   **Yes**  |
| Java/JUnit 4                        | 4.0 XML      |   **Yes**  |
| Python/Junit                         | 4.0 XML      |   **Yes**  |

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
