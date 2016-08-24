import React from 'react'; 
import { shallow } from 'enzyme'; // Method from enzyme which allows us to do shallow render
import SymptomEntryView from '../client/app/symptomEntry.jsx';

describe('SymptomEntryView', () => {
  const wrapper = shallow(<SymptomEntryView />);

  it('works!', () => {
    expect(true).to.be.true;
  });

  it('renders as a <div>', () => {
    expect(wrapper.type()).to.eql('div');
  });
});