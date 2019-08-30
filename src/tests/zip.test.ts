import * as nunit from '../documents/nunit2';
var fs = require('fs');
const unzipper = require('unzipper');


test('test invalid Nunit XML file', async () => {
    let path = 'src/tests/fixtures/pytest-nunit-report.xml.zip';
    const directory = await unzipper.Open.file(path);
    console.log('directory', directory.files[0].path);
    directory.files[0]
        .stream()
        .pipe(fs.createWriteStream('firstFile'))
        .on('error', () => {console.log("Error!")})
        .on('finish', () => {console.log("Done!")})

});