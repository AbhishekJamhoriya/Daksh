import React from "react";
import { useState, useEffect, useRef } from "react";
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    "min-width": "200px",
    "margin-top": "10px",
  },
  toggle: {
      width: "100px",
      height: "30px",
      "background-color": "#6c1ab9",
      color: "#fff",
      border: "unset",
      cursor: "pointer",
      "border-radius": "10px",
  },
  contentShow: {
      width: "auto",
      height: "auto",
      "margin-top": "10px",
      border: "1px solid #686868",
      display: "flex",
      "justify-content": "center",
      "border-radius": "10px",
  },
  contentHide: {
      display: "none",
  },
});

const Collapsible = ({children, label}) => {
  const [IsOpen, setIsOpen] = useState(false)
  const classes = useStyles();
  return (
    <div className={classes.container}>
     
        <Button className={classes.toggle} onClick={() => setIsOpen(!IsOpen)}>{label}</Button>
        <div className={IsOpen ? classes.contentShow : classes.contentHide}>{children}</div>
    </div>
  )
}

export default Collapsible;
