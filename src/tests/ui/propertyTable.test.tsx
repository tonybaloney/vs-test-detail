import * as React from 'react'
import {mount, shallow} from 'enzyme'
import { PropertyTable } from '../../ui/propertyTable';
import { IProperty } from '../../documents/abstract'


test('test valid Junit XML file', () => {
    const testProperties : IProperty[] = [
        { name: 'testname', value: 'testvalue'}
    ];
    const wrapper = shallow(<PropertyTable properties={testProperties}/>); // mount/render/shallow when applicable

    expect(wrapper.find('Table')).toHaveProp('itemProvider');
    expect(wrapper.find('Table')).toHaveProp('columns');
    expect(wrapper.find('Header')).toExist();
});

