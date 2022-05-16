import React ,{ useState }from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Form, Input } from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import {createTheme,ThemeProvider} from "@material-ui/core"


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  searchfield: {
    width: "50%",
    marginRight: "1rem",
    fontSize: 10,
  },
  timefield: {
    marginRight: "1.5rem"
  },
  report_type: {
    width: "8rem",

  }

}));




export default function Searchgrid({ title,rows,columns}) {
  
  const classes = useStyles();
  const [Selecteddevices,setSelecteddevices]=useState([]);
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1e90ff',
      },
      secondary: {
        main: '#1e90ff',
      },
    },

  });
 
console.log(Selecteddevices)
  return (
    <div style={{ height: "auto", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
    
      <div style={{ width: "100%", marginTop: "1rem" }}>
       
      
        <ThemeProvider theme={theme}>
        <MaterialTable 
        title={title}
        data={rows}
        columns={columns}
        options={{
          selection: true,
          headerStyle: {
            backgroundColor: '#1e90ff',
            color: '#FFF'
          },
         
        }}
        onSelectionChange={(item)=>
          // console.log(item)
          setSelecteddevices(item)
        }
        />
        </ThemeProvider>
       
        
    
      </div>

    </div>

  );
}

