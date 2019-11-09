import React from "react"

const ImageComponent = (props) =>{
    
    return(
        <div>
            <div className="hide">
                <img  id="uploaded_image" src={props.uploaded_image} width="100%"  />
            </div>

            <canvas  id="myCanvas"    width="900" height="450">
            Your browser does not support the HTML5 canvas tag.
            </canvas>
        </div>
    )
}

export default ImageComponent