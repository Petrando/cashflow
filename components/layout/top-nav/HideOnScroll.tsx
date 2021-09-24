import * as React from "react";
import { Slide, useScrollTrigger } from "@material-ui/core";

const HideOnScroll = ({ children }:{ children:React.ReactElement}):JSX.Element => {
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default HideOnScroll;