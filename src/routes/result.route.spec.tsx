import { h } from 'preact';
import { mount, configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';
import  ResultsRoute  from './results.route';

configure({ adapter: new Adapter })

describe('Result Component', () => {
    it('should display h1 text', async () => {
        const wrapper = shallow(<ResultsRoute  />);
        expect(wrapper.find('h1').text()).toBe("Results should display here.")
    })
})