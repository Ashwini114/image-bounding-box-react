import React from "react"
import img from "../assets/loading.jpg"

const ImageComponent = (props) =>{
   
    return(
        <div>
            <div className="hide">
                <img  id="uploaded_image" src={props.uploaded_image?props.uploaded_image:img} width="100%"  />
            </div>

            <canvas  id="myCanvas"    width="900" height="450">
            Your browser does not support the HTML5 canvas tag.
            </canvas>
        </div>
    )
}

export default ImageComponent