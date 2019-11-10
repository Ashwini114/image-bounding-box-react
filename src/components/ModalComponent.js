import React,{useState,createRef,forwardRef, useImperativeHandle } from "react"
import {Modal, ModalHeader, ModalBody, ModalFooter,Button,Row,Col} from 'reactstrap';
import ImageComponent from './ImageComponent'


const  ModalComponent = forwardRef((props,ref) => {
const [modal_variables,updateModal] = useState({
    gallery_status:true,
    edit_status:0,
    uploaded_image: '',
    
})
const coordinates = {x1:0,y1:0,x2:0,y2:0}

const x1Ref = createRef();
const y1Ref = createRef();
const x2Ref = createRef();
const y2Ref = createRef();
const canvasRef = createRef();

useImperativeHandle(ref, () => ({

    updateImage(image_details) {
        props.toggle();
      updateModal({
          gallery_status : false,
          edit_status : image_details.id,
          uploaded_image : image_details.image
      })
      setTimeout(()=>{
        var c=document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        var img = document.getElementById("uploaded_image");
        
        document.getElementById("x1").value = image_details.x1;
        document.getElementById("y1").value = image_details.y1;
        document.getElementById("x2").value = image_details.x2;
        document.getElementById("y2").value = image_details.y2;
        setTimeout(() => {
          ctx.drawImage(img, 50, 0,900,450);
            if(image_details.x1 != 0 && image_details.y1 !=0 && image_details.x2 !=0 && image_details.y2 != 0)
               drawRect(image_details.x1,image_details.y1,image_details.x2,image_details.y2)
            else
              dragAndDrawBox();

        }, 1000);
      },1000)

    },
    newUpload()
    {
       updateModal({
           gallery_status : true,
           edit_status : 0
       })
       props.toggle();
    }

  }));
 
/**
 * 
 * Functions
 */

/** Preview uploaded image  */

const showImage = (e) =>{
   
   
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    

    
    
    reader.onload = function () {


    updateModal({
        gallery_status : false,
        uploaded_image : reader.result,
        edit_status : 0,
        
        
    })
    var c = document.getElementById('myCanvas');
    var ctx = c.getContext("2d");
    var img = document.getElementById("uploaded_image");
    
    setTimeout(() => {
        ctx.drawImage(img, 50, 0,900,450);

    }, 2000);

    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };

}
/* Drag and create bounding box */
const dragAndDrawBox = () =>{
    
     
     var canvas = document.getElementById("myCanvas");
    
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
         var img = document.getElementById("uploaded_image");
         ctx.drawImage(img, 50, 0,900,450);

         var width = mousex-last_mousex;
         var height = mousey-last_mousey;
         drawRect(last_mousex,last_mousey,width,height);
         document.getElementById("x1").value = last_mousex;
         document.getElementById("y1").value = last_mousey;
         document.getElementById("x2").value = width;
         document.getElementById("y2").value = height;
         
        

       }
    }
  

 }
 /** Change coordinates of bounding box as per input from input boxes */
const changeCoordinates = () =>{
    
   var c =document.getElementById("myCanvas");
   if(c)
   {
       var ctx = c.getContext("2d");
       var img = document.getElementById("uploaded_image");
       
       setTimeout(() => {
         ctx.drawImage(img, 50, 0,900,450);
           if(x1Ref.current){
            
            drawRect(x1Ref.current.value,y1Ref.current.value,x2Ref.current.value,y2Ref.current.value);

           }

   
       }, 2000);
   }


 }
 
 /** Function to draw a bounding box */
const drawRect = (x1,y1,x2,y2) =>{
  
   var context = document.getElementById("myCanvas")
   if(context)
   {
       var rect = context.getContext("2d");
       rect.beginPath();
       rect.rect(x1,y1,x2,y2);
       rect.stroke();
   }
 }
/* JSX elements */
/* To show upload image button */
const upload_image_button = <input type="file" name="name" onChange={showImage} id="uplo"/>;

/* Preview of uploaded image */
const uploaded_image_view = <div >

<ImageComponent uploaded_image={modal_variables.uploaded_image}/>
<Row className="gallery">
    <Col sm="6">
    <label>X1 : </label>
    <input type="text" ref={x1Ref} id="x1" className="form-control"  onKeyUp={()=>changeCoordinates()}/>   
    </Col>
    <Col sm="6" >
    <label>Y1 : </label>
    <input type="text" ref={y1Ref} id="y1" className="form-control"  onKeyUp={()=>changeCoordinates()}/>
    </Col>
    
</Row>
<Row className="gallery">
<Col sm="6" >
<label>X2 : </label>
    <input type="text" ref={x2Ref} id="x2" className="form-control"    onKeyUp={()=>changeCoordinates()}/>
    </Col>
    <Col sm="6" >
    <label>Y2 : </label>
    <input type="text" ref={y2Ref} id="y2" className="form-control"    onKeyUp={()=>changeCoordinates()}/>
    </Col>
</Row>
<div>
    <div className="add_new">
    <Button id="save_changes" onClick={()=>props.addToGallery(
        {
            image:modal_variables.uploaded_image,
            x1:x1Ref.current.value,x2:x2Ref.current.value,
            y1:y1Ref.current.value,y2:y2Ref.current.value},modal_variables.edit_status)}>Save</Button>
    </div>

</div>
        
</div>;

return(
        <Modal isOpen={props.modal} fade={false} toggle={props.toggle} >
            <ModalHeader toggle={props.toggle}>Modal title</ModalHeader>
            <ModalBody>
            <div>  
                {modal_variables.gallery_status ? upload_image_button : uploaded_image_view }
            </div>
            </ModalBody>
            <ModalFooter>
            
            <Button color="secondary" onClick={props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
});

export default ModalComponent;