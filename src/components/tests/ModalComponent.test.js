import React from "react"
import Enzyme, {shallow,mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16'
import ModalComponent from "../ModalComponent";
import ImageComponent from "../ImageComponent"
import loadingImage from "../../assets/loading.jpg"


Enzyme.configure({adapter: new Adapter()});

describe("ModalComponent", () => {
it("renders", () => {

mount(<ModalComponent />);
});
 
it('No image displayed',()=>{
    const wrapper = shallow(<ImageComponent />);
    expect(wrapper.find("img").prop("src")).toEqual(loadingImage)
})



});

