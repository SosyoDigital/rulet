import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardTitle, CardBody, Button } from "shards-react";
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar';
import profileImage from '../../assets/person.png'
import { withRouter, Redirect } from 'react-router-dom';


function UserProfile(){
    const[userDetails, setUserDetails] = useState(null)
    const[isLoading, setisLoading] = useState(true)
    const[balance, setBalance] = useState(0)
    const[copied, setCopied] = useState('')
    const[referralId, setreferralId] = useState('')
    useEffect(() => {
        const token = localStorage.getItem('token')
        const getUser = async(token) => {
            await axios.get('http://localhost:4000/user', {
                headers: {
                    'x-auth-token': token
                }
            })
            .then(resp => {
                if(resp){}
                setUserDetails(resp.data); 
                getBalance(resp.data.address); 
                setreferralId(resp.data.referral.id);
                setisLoading(false)
            })
            .catch(err => console.log(err))
        }
        getUser(token)
    }, [])

    const handlePasswordChange = () => {
        console.log(typeof(userDetails.address))
    }

    const getBalance = async (address) => {
        const token = localStorage.getItem('token')
        const resp = await axios.get('http://127.0.0.1:4000/user/getbalance', {
            headers: {
            'x-auth-token': token
            }
        })
        setBalance(resp.data.balance)
    }
    const copyToClipboard = () => {
        navigator.clipboard.writeText("www.casualita.app Sign up with my referral id to win 100 bonus tokens! Referral Id: "+userDetails.referral.id)
        setCopied('Copied to clipboard!')
    }
    const copysvg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
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
                                        <Row>
                                            <CardTitle>Phone Number: {userDetails.username}</CardTitle>
                                        </Row>
                                        <Row>
                                            Email: {userDetails.email}
                                        </Row>
                                    </div>
                                </Row>
                                <Row style={{marginTop: '3%', textAlign: 'center'}}>
                                    <Col>
                                        <Button onClick={() => handlePasswordChange()} outline theme="warning" size="sm">Change Password</Button>
                                    </Col>
                                    <Col>
                                        <Button outline theme="info" size="sm">Export Private Key</Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Row><h6>Address: {userDetails.address}</h6> </Row>
                                <Row><h6>Available Balance: {balance} CASU</h6></Row>
                                <Row>
                                    <h6 style={{marginRight: '2%'}}>Referral Id: {referralId}</h6>
                                    <div onClick={() => copyToClipboard()} style={{marginRight:'2%'}}>{copysvg}</div>
                                    {copied}
                                </Row>
                                <hr/>
                                <Row style={{marginLeft: '10%'}}>
                                    <Col>
                                        <Button outline theme="success" onClick={() => getBalance()}>
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