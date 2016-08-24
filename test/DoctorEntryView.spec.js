import React from 'react';
import { shallow } from 'enzyme'; // Method from enzyme which allows us to do shallow render
import DoctorEntryView from '../client/app/doctorEntryView.jsx';

describe('DoctorEntryView', () => {
  const wrapper = shallow(<DoctorEntryView />);

  it('works!', () => {
    expect(true).to.be.true;
  });

  it('renders as a <div>', () => {
    expect(wrapper.type()).to.eql('div');
  });
});
