# vs-test-detail

[![Build Status](https://dev.azure.com/AnthonyShaw/vs-test-detail/_apis/build/status/tonybaloney.vs-test-detail?branchName=master)](https://dev.azure.com/AnthonyShaw/vs-test-detail/_build/latest?definitionId=6&branchName=master)

A UI extension for test cases in Azure DevOps (VSO)

* Currently supports NUnit XML 2/3 test results and displays additional detail in the test console
* Supports displaying custom test parameters and properties
* Supports stdout (missing from debug window) in NUnit 3 and JUnit

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

## Configuration

No additional configuration is required if you are using the `PublishTestResults@2` task with either the `NUnit` or `JUnit` test runner formats.

## Issues

If you come across any issues with this extension, please report them on the GitHub page. Attaching your report XML file to the issue will aid debugging.
