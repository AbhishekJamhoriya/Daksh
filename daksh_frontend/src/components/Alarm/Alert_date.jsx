import React,{useState} from "react";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

const Alert_date = (props) => {
    const [open, setOpen] = useState(true);
  return (
    <>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ height:43 }}
          severity={props.severity}
        >
           
         {props.value}
        </Alert>
      </Collapse>
    </>
  );
};

export default Alert_date;
