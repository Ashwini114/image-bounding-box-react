import React , {Component,useRef}  from "react";
import ModalComponent from "./ModalComponent"
import { Card, Button, CardHeader, CardImg,
    Modal, ModalHeader, ModalBody, ModalFooter,Row,Col,Input,InputGroupAddon,InputGroup } from 'reactstrap';
import { conditionalExpression } from "@babel/types";

class Home extends Component{
  constructor(props)
  {
      super(props);
      this.state= {
          gallery : [{
              id:1,
              image: process.env.PUBLIC_URL + '/images/image.jpg',
              x1:0,
              y1:0,
              x2:0,
              y2:0
            },
            {
                id:2,
                image: process.env.PUBLIC_URL + '/images/image_2.jpg',
                x1:0,
                y1:0,
                x2:0,
                y2:0
            },
            {
                id:3,
                image: process.env.PUBLIC_URL + '/images/image_3.jpg',
                x1:0,
                y1:0,
                x2:0,
                y2:0
            }
         ],
          last_id: 4,
          modal : false,

          
      }
      this.modalRef = React.createRef();
      this.addToGallery = this.addToGallery.bind(this)

  }
   /* Saves new and old images with bounding box */
  addToGallery(new_image,edit_status)
  {
    console.log(edit_status)
    new_image.id=this.state.last_id;
    
  
    var new_gallery = this.state.gallery;
    if(edit_status == 0)
    {
        new_gallery.push(new_image)
    }
    else{
      console.log(new_image,edit_status)
        new_gallery.map((old)=>{
            if(old.id == edit_status)
            {
                old.x1=new_image.x1;
                old.y1=new_image.y1;
                old.x2=new_image.x2;
                old.y2=new_image.y2;

            }
        })
    }
    
      this.setState({
          last_id : this.state.last_id+1,
          gallery : new_gallery
      })
      this.toggle();
      
  }
  /** To open modal to upload new image */
  open_new = () =>{
     this.modalRef.current.newUpload();
  }
  toggle = () =>{
      
      this.setState({
         
          modal : !this.state.modal
      });
  }
   /** Preview existing images */
   selectImage = (image_details) =>{
    
      this.modalRef.current.updateImage(image_details);
  
}

  
  render()
  {
      /* list to show gallery images */ 
      const gallery_view = this.state.gallery.map((gall)=> 
      <div className="col-sm-4 " key={gall.id}>
      <Card onClick={()=>this.selectImage(gall)}>
      <CardImg top width="100%"  src={gall.image} alt="Card image cap" />
      </Card>
      </div>);
      
     
    /** Gallery listing */
    const gallery_listing =  <Card>
    <CardHeader>Image Gallery</CardHeader>
    <div className="gallery ">
     <div className="add_new"> <Button color="primary" onClick={()=>this.open_new(this)}>Add New</Button> </div>
    </div>
    <div className="row gallery">
      {gallery_view}
     
    </div>
   </Card>;






      return(
      <div>

      
      { gallery_listing }

      <ModalComponent  ref={this.modalRef} modal={this.state.modal} toggle={this.toggle} addToGallery={this.addToGallery}/>
    </div>
      )
  }
}

export default Home