import React, {MouseEvent} from "react";
import { Zoom, useScrollTrigger } from "@material-ui/core";

const BackToTop = ({ children }:{children:React.ReactElement}):JSX.Element => {
  const trigger = useScrollTrigger();

  //:MouseEvent<HTMLDivElement>
  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} 
           role="presentation" 
           style={{position: `fixed`, bottom: `50px`, right: `100px`, zIndex: 99}}>
        {children}
      </div>
    </Zoom>
  )
}

export default BackToTop;