import { Container, Typography } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import  Carousel  from "react-material-ui-carousel"

import "./index.css"
import  {Login}  from "../auth/Login";
import Loginpageimage from "../../Images/Loginpageimage.png"

const data = [{position:"Front-end",title:"Powerful and easy to use multipurpose theme"},{ position:"Back-end",title:"Powerful and easy to use multipurpose theme"}, {position:"Database",title:"Powerful and easy to use multipurpose theme"}]

const LoginScreen = () => {

    return (

        <div className="maindiv">
            <Row className="row">
                <Col md={7} className="loginside">
                    <Login/>
                </Col>
                <Col md={5} className="logoside">
                    <div className="carousel_logo_div">
                        <Container className="logoimage">
                            <div className="logoimagediv">
                                    <img className="logoimg" src={Loginpageimage}></img>
                            </div>
                        </Container>
                        <Container className="carouseldiv">
                        <Carousel
                            className="carousel"
                           autoPlay={true}
                           animation='slide'
                           cycleNavigation={true}
                           indicators={false}
                           navButtonsProps={{
                               style: {
                                   color: '#000000',
                                   backgroundColor: '#ffffff',
                                   borderRadius: 0,
                                   margin: 0,
                                   width: 50,
                               }
                           }}

                        >
                            {
                                data.map(temp => (
                                    <div className="carouselitem">
 <Typography variant="h3">{temp.position}</Typography>
 <p >{temp.title}</p>
 {/* <Typography variant="h3">{temp}</Typography> */}
                                    </div>
                                   

                                ))
                            }
                        </Carousel>
                        </Container>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default LoginScreen;