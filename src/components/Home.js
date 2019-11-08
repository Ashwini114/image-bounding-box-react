import React , {Component}  from "react";
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
          gallery_status : true,
          edit_status:0, // 0 for adding new image and image id for edit
          uploaded_image : process.env.PUBLIC_URL + '/images/image_3.jpg',


          
          
      }
      this.x1 = React.createRef();
     

  }
   /* Saves new and old images with bounding box */
  addToGallery()
  {

    var new_gallery = this.state.gallery;
    if(this.state.edit_status == 0)
    {
        new_gallery.push({
            id:this.state.last_id,
            image: this.state.uploaded_image,
            x1 : this.refs.x1.value?this.refs.x1.value:0,
            y1 : this.refs.y1.value?this.refs.y1.value:0,
            x2 : this.refs.x2.value?this.refs.x2.value:0,
            y2 : this.refs.y2.value?this.refs.y2.value:0
    })
    }
    else{
        new_gallery.map((old)=>{
            if(old.id == this.state.edit_status)
            {
                old.x1=this.refs.x1.value?this.refs.x1.value:0;
                old.y1=this.refs.y1.value?this.refs.y1.value:0;
                old.x2=this.refs.x2.value?this.refs.x2.value:0;
                old.y2=this.refs.y2.value?this.refs.y2.value:0;

            }
        })
    }
    
      this.setState({
          last_id : this.state.last_id,
          gallery : new_gallery
      })
      this.toggle();
      
  }
  /** To open modal to upload new image */
  open_new = () =>{
    this.setState({
      gallery_status : true
    },()=>{
      this.toggle();
    })
  }
  toggle = () =>{
      
      this.setState({
         
          modal : !this.state.modal
      });
  }
  /** Preview uploaded image  */
  showImage = (e) =>{
   
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    let reference = this;
    
    reader.onload = function () {

        reference.setState({
            uploaded_image: reader.result,
            gallery_status : false,
            edit_status : 0
        },()=>{
            var c =reference.refs.canvases;
            var ctx = c.getContext("2d");
            var img = reference.refs.uploaded_image;
            
            setTimeout(() => {
                ctx.drawImage(img, 50, 0,900,450);

            }, 2000);
           
            
        })
  
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };

  }
  /** Preview existing images */
  updateImage = (image_details) =>{
   
    this.setState({
        uploaded_image: image_details.image,
        gallery_status : false,
        edit_status : image_details.id
    },()=>{
            var c =this.refs.canvases;
            
            var ctx = c.getContext("2d");
            var img = this.refs.uploaded_image;
            this.refs.x1.value = image_details.x1;
            this.refs.y1.value = image_details.y1;
            this.refs.x2.value = image_details.x2;
            this.refs.y2.value = image_details.y2;
            setTimeout(() => {
              ctx.drawImage(img, 50, 0,900,450);
                if(image_details.x1 != 0 && image_details.y1 !=0 && image_details.x2 !=0 && image_details.y2 != 0)
                this.drawRect(image_details.x1,image_details.y1,image_details.x2,image_details.y2)
                else
                 this.dragAndDrawBox();

            }, 2000);
        
            
    })
     this.toggle();
      
    


}
 /* Function to drag and create bounding box on images without bounding box */
  dragAndDrawBox = () =>{
    
     
     var canvas = this.refs.canvases;
     
     var ctx = canvas.getContext('2d');
     var canvasx = canvas.getBoundingClientRect().left;
     var canvasy = canvas.getBoundingClientRect().top;
     var last_mousex = 0;
     var last_mousey = 0
     var mousex = 0;
     var mousey = 0;
     var mousedown = false;
     
     canvas.onmouseup = (e) =>{
         mousedown = false;
     }
     canvas.onmousedown = (e) =>{
        last_mousex = parseInt(e.clientX-canvasx);
        last_mousey = parseInt(e.clientY-canvasy);
        mousedown = true;
        
     }
     canvas.onmousemove = (e) =>{
        mousex = parseInt(e.clientX-canvasx);
        mousey = parseInt(e.clientY-canvasy);
        if(mousedown) {
          var img = this.refs.uploaded_image;
          ctx.drawImage(img, 50, 0,900,450);

          var width = mousex-last_mousex;
          var height = mousey-last_mousey;
          this.drawRect(last_mousex,last_mousey,width,height);
          this.refs.x1.value = last_mousex;
          this.refs.y1.value = last_mousey;
          this.refs.x2.value = width;
          this.refs.y2.value = height;

        }
     }
   

  }
  /** Change coordinates of bounding box as per input from input boxes */
  changeCoordinates = () =>{
  
    var c =this.refs.canvases;
    if(this.refs.canvases)
    {
        var ctx = c.getContext("2d");
        var img = this.refs.uploaded_image;
        
        setTimeout(() => {
          ctx.drawImage(img, 50, 0,900,450);
            if(this.refs.x1)
             this.drawRect(this.refs.x1.value,this.refs.y1.value,this.refs.x2.value,this.refs.y2.value);

    
        }, 2000);
    }


  }
  /** Function to draw a bounding box */
  drawRect = (x1,y1,x2,y2) =>{
   
    var context = this.refs.canvases;
    if(context)
    {
        var rect = context.getContext("2d");
        rect.beginPath();
        rect.rect(x1,y1,x2,y2);
        rect.stroke();
    }
  }
  
  render()
  {
      /* list to show gallery images */ 
      const gallery_view = this.state.gallery.map((gall)=> 
      <div className="col-sm-4 " key={gall.id}>
      <Card onClick={this.updateImage.bind(this,gall)}>
      <CardImg top width="100%"  src={gall.image} alt="Card image cap" />
      </Card>
      </div>);
      
      /* To show upload image button */
      const upload_image_button = <input type="file" name="name" onChange={this.showImage.bind(this)}/>;

      /* Preview of uploaded image */
      const uploaded_image_view = <div >
      <div className="hide">
      <img  id="uploaded_image" src={this.state.uploaded_image} width="100%" ref="uploaded_image" />
      </div>
      
      <canvas id="myCanvas"  ref="canvases" width="900" height="450">
        Your browser does not support the HTML5 canvas tag.
        </canvas>
       
      <Row className="gallery">
          <Col sm="6">
            <label>X1 : </label>
            <input type="text"  className="form-control" ref="x1" onKeyUp={this.changeCoordinates.bind(this)}/>   
          </Col>
          <Col sm="6" >
          <label>Y1 : </label>
          <input type="text" className="form-control"   ref="y1" onKeyUp={this.changeCoordinates.bind(this)}/>
          </Col>
         
      </Row>
        <Row className="gallery">
        <Col sm="6" >
        <label>X2 : </label>
          <input type="text" className="form-control"   ref="x2" onKeyUp={this.changeCoordinates.bind(this)}/>
          </Col>
          <Col sm="6" >
          <label>Y2 : </label>
          <input type="text" className="form-control"   ref="y2" onKeyUp={this.changeCoordinates.bind(this)}/>
          </Col>
      </Row>
      <div>
          <div className="add_new">
          <Button onClick={this.addToGallery.bind(this)}>Save</Button>
          </div>
      
      </div>
      
    </div>;
    /** Gallery listing */
    const gallery_listing =  <Card>
    <CardHeader>Image Gallery</CardHeader>
    <div className="gallery ">
     <div className="add_new"> <Button color="primary" onClick={this.open_new.bind(this)}>Add New</Button> </div>
    </div>
    <div className="row gallery">
      {gallery_view}
     
    </div>
   </Card>;






      return(
      <div>

      
      { gallery_listing }
      
      <Modal isOpen={this.state.modal} fade={false} toggle={this.toggle.bind(this)} >
        <ModalHeader toggle={this.toggle.bind(this)}>Modal title</ModalHeader>
        <ModalBody>
            {this.state.gallery_status ? upload_image_button : uploaded_image_view }

        </ModalBody>
        <ModalFooter>
         
          <Button color="secondary" onClick={this.toggle.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
      )
  }
}

export default Home