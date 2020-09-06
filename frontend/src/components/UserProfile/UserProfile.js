import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardTitle, CardBody, Button } from "shards-react";
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar';
import profileImage from '../../assets/person.png'
import { withRouter } from 'react-router-dom';


function UserProfile(){
    const[userDetails, setUserDetails] = useState(null)
    const[isLoading, setisLoading] = useState(true)
    useEffect(() => {
        const token = localStorage.getItem('token')
        const getUser = async(token) => {
            await axios.get('http://localhost:4000/user', {
                headers: {
                    'x-auth-token': token
                }
            })
            .then(resp => {setUserDetails(resp.data); setisLoading(false)})
            .catch(err => console.log(err))
        }
        getUser(token)
    })

    const handlePasswordChange = () => {
        console.log(typeof(userDetails.address))
    }
    return(
        isLoading ? <div/> :
        <div>
        <Container className="dr-example-container">
            <Row>
                <Col sm="12" md="4" lg="3"/>
                    <Col sm="12" md="4" lg="6">
                        <Card style={{marginTop:'10%'}}>
                            <CardHeader>
                                <Row>
                                    <Avatar alt="avatar" src={profileImage} style={{marginLeft:'5%'}}/>
                                    <div style={{marginLeft: '10%'}}>
                                        <CardTitle>Phone Number: {userDetails.username}</CardTitle>
                                    </div>
                                </Row>
                                <Row style={{marginTop: '3%'}}>
                                    <Col>
                                        Email: {userDetails.email}
                                    </Col>
                                    <Col>
                                        <Button onClick={() => handlePasswordChange()} outline theme="warning" size="sm"  style={{marginLeft: '20%'}}>Change Password</Button>
                                        <Button outline theme="info" size="sm" style={{marginLeft: '20%', marginTop: '5%'}}>
                                            Export private key
                                            </Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                        <Row><h6>Address: {userDetails.address}</h6> 
                                        </Row>
                                        <Row><h6>Available Balance: 1000 CASU</h6></Row>
                                        <hr/>
                                        <Row style={{marginLeft: '10%'}}>
                                            <Col>
                                                <Button outline theme="success">
                                                    Deposit
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button outline theme="secondary">
                                                    Withdraw
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row style={{marginTop: '5%'}}>
                                            <Button block>View Bet History</Button>
                                        </Row>
                            </CardBody>
                        </Card>
                    </Col>
                <Col sm="12" md="4" lg="3"/>
            </Row>
        </Container>
        </div>
    )
}

export default withRouter(UserProfile)