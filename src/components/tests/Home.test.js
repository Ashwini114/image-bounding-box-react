import React from "react"
import Enzyme, {shallow,mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16'
import Home from "../Home";
import ModalComponent from "../ModalComponent";
Enzyme.configure({adapter: new Adapter()});


describe('Home', () => {
    it('modal opens', () => {
     const wrapper = shallow(<Home />);
      wrapper.find('.add_new').simulate('click');
      setTimeout(()=>{
        expect(wrapper.state().modal).toEqual(true);
      },2000)
      
    });
    it('initial image gallery', () => {
        const wrapper = shallow(<Home />);
       
           expect(wrapper.state().gallery.length).toEqual(3);
        
         
    });

  });