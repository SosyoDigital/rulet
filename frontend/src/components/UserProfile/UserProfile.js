import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardTitle, CardBody, Button, Modal, ModalHeader, ModalBody, FormInput, FormGroup, Alert} from "shards-react";
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar';
import profileImage from '../../assets/person.png'
import { withRouter } from 'react-router-dom';


function UserProfile(props){
    const[userDetails, setUserDetails] = useState(null)
    const[isLoading, setisLoading] = useState(true)
    const[balance, setBalance] = useState(0)
    const[copied, setCopied] = useState('')
    const[referralId, setreferralId] = useState('')
    const[showPasswordModal, setPasswordModal] = useState(false)
    const[currentPassword, setCurrentPassword] = useState('')
    const[newPassword, setNewPassword] = useState('')
    const[passwordMsg, setPasswordMsg] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        const getUser = async(token) => {
            await axios.get('https://casualita-api.app/user', {
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

    const handlePasswordChange = async() => {
        const token = localStorage.getItem('token')
        const resp = await axios.post('https://casualita-api.app/user/changepassword',{
            currentPassword: currentPassword,
            newPassword: newPassword
        },{headers: {
            'x-auth-token': token
        }})
        if(resp.data.success){
            setPasswordMsg(resp.data.msg)
        } else {
            setPasswordMsg(resp.data.msg)
        }
    }

    const getBalance = async (address) => {
        const token = localStorage.getItem('token')
        const resp = await axios.get('https://casualita-api.app/user/getbalance', {
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

    const getPrivateKey = async() => {
        const token = localStorage.getItem('token')
        const resp = await axios.get('https://casualita-api.app/user/getprivatekey',{
            headers: {
            'x-auth-token': token
            }
        })
        const element = document.createElement("a");
        const data = JSON.stringify({'address': userDetails.address, 'privateKey' : resp.data.privateKey})
        const file = new File([data], {type: 'text/plain;charset=utf-8'})
        element.href = URL.createObjectURL(file)
        element.download = 'Casualita-Acc.txt'
        document.body.appendChild(element)
        element.click()
    }

    const copysvg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
    const changePasswordModal = <Modal open={showPasswordModal}>
                                <ModalHeader>Change Password</ModalHeader>
                                   <ModalBody>
                                   {passwordMsg!=='' ? <Alert theme="secondary">{passwordMsg}</Alert> : null}
                                    <FormGroup>
                                        <label htmlFor="#currentpassword">Enter your current password</label>
                                        <FormInput type="password" onChange={e => setCurrentPassword(e.target.value)} id="#currentpassword" placeholder="Current password"/>                               
                                    </FormGroup>
                                    <FormGroup>
                                        <label htmlFor="#newpassword">Enter new password</label>
                                        <FormInput type="password" onChange={e => setNewPassword(e.target.value)} id="#newpassword" placeholder="New password"/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button outline theme='light' onClick={() => {setPasswordModal(!showPasswordModal); setPasswordMsg('')}} style={{marginRight: '2%'}}>Cancel</Button>
                                        <Button onClick={handlePasswordChange}>Submit</Button>
                                    </FormGroup>
                                   </ModalBody>
                                </Modal>
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
                                        <Button onClick={() => setPasswordModal(!showPasswordModal)} outline theme="warning" size="sm">Change Password</Button>
                                    </Col>
                                    <Col>
                                        <Button outline theme="info" size="sm" onClick={getPrivateKey}>Export Private Key</Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Row><h6>Address: <span style={{fontSize: '0.7em'}}>{userDetails.address}</span></h6> </Row>
                                <Row><h6>Available Balance: {balance} CASU</h6></Row>
                                <Row>
                                    <h6 style={{marginRight: '2%'}}>Referral Id: {referralId}</h6>
                                    <div onClick={() => copyToClipboard()} style={{marginRight:'2%'}}>{copysvg}</div>
                                    {copied}
                                </Row>
                                <Row style={{marginTop: '1%'}}>
                                    <Button block href='/allbets'>View Bet History</Button>
                                </Row>
                                <hr/>
                                <Row>Withdrawals and deposits will be enabled once approved by the regulators.</Row>
                                <Row style={{alignSelf: 'center'}}>
                                    <Col></Col>
                                        <Col>
                                        <Button outline theme="success" disabled >
                                            Deposit
                                        </Button>
                                        </Col>
                                        <Col>
                                        <Button outline theme="secondary" disabled>
                                            Withdraw
                                        </Button>
                                        </Col>
                                    <Col></Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                <Col sm="12" md="4" lg="3"/>
            </Row>
        </Container>
        {changePasswordModal}
        </div>
    )
}

export default withRouter(UserProfile)