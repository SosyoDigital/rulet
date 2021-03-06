import React from "react";
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  Modal,
  ModalHeader,
  ModalBody,
  Form, FormInput, FormGroup,
  Button,
  Alert,
  Row
} from "shards-react";
import {Redirect, withRouter} from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import axios from 'axios'
import Logo from '../../assets/logo2.png'
import CircularProgress from '@material-ui/core/CircularProgress';
import 'react-telephone-input/css/default.css'
const ENDPOINT = 'https://casualita-api.app/'
const socket = socketIOClient(ENDPOINT);


class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.openSignupModal = this.openSignupModal.bind(this);
    this.openloginModal = this.openloginModal.bind(this);
    this.otpOpen = this.sendOtp.bind(this);
    this.state = {
      dropdownOpen: false,
      collapseOpen: false,
      signUpModalShow: false,
      signUpUsernameInput: '',
      signUpPasswordInput: '',
      signUpConfirmPasswordInput: '',
      signUpEmailInput: '',
      loginModalShow: false,
      loginUsernameInput: '',
      loginPasswordInput: '',
      msg: null,
      isAuthenticated: false,
      userToken: null,
      username: '',
      isError: false,
      referralId: '',
      otpOpen: false,
      signupOtpSession: null,
      otpInput: '',
      loader: false,
      loginloader: false
    };
  }

  componentDidMount(){
    this.usertoken = localStorage.getItem('token')
    this.username = localStorage.getItem('user')
    console.log(this.username)
    if(this.usertoken && this.username){
      this.setState({isAuthenticated: true, userToken: this.usertoken, username: this.username})
    } else {
      this.setState({msg: 'User not logged in!'})
    }
    console.log(this.state.username)
  }

  toggleNavbar() {
    this.setState({
      ...this.state,
      ...{
        collapseOpen: !this.state.collapseOpen
      }
    });
  }

  openSignupModal(){
    this.setState({
      signUpModalShow: !this.state.signUpModalShow
    });
  }

  openloginModal(){
    this.setState({
      loginModalShow: !this.state.signUpModalShow
    });
  }

  async handleLoginSubmit(){
    this.setState({loginloader: true})
    const resp = await axios.post('https://casualita-api.app/user/login', {
      username: this.state.loginUsernameInput,
      password: this.state.loginPasswordInput
    })
    console.log(resp.status)
    if(resp.data.user){
      await localStorage.setItem('token', resp.data.token)
      await localStorage.setItem('user', resp.data.user.username)
      await localStorage.setItem('email', resp.data.user.email)
      this.setState({username: resp.data.user.username, isAuthenticated: true, loginModalShow: !this.state.loginModalShow, msg: resp.data.msg})
      socket.emit('login')
      this.setState({loginloader: false})
      window.location.reload(false);
    } else {
      this.setState({isError: true, msg: resp.data.msg})
    }
  }

  async handleSignupSubmit(){
    this.setState({otpOpen: !this.state.otpOpen})
      await axios.post('https://casualita-api.app/user/register', {
        username: this.state.signUpUsernameInput,
        password: this.state.signUpPasswordInput,
        email: this.state.signUpEmailInput,
        refId: this.state.referralId
      })
      .then(resp => {
        if(resp.data.success){
        this.setState({msg: resp.data.msg})
        localStorage.setItem('token', resp.data.token)
        localStorage.setItem('user', resp.data.user.username)
        this.setState({signUpModalShow: !this.state.signUpModalShow, isAuthenticated: true, loader: false})
        socket.emit('login')
        window.location.reload();
        }
      })
      .catch(err => {
        this.setState({msg: err.msg})
      })
  }

  async sendOtp(){
    const resp = await axios.post('https://casualita-api.app/user/register/sendotp', {
      phoneNumber: this.state.signUpUsernameInput
    })
    if(resp.data.success){
      this.setState({signupOtpSession: resp.data.sessionId})
    } else {
      this.setState({msg: 'Some error has occured. Please try again later.', otpOpen: !this.state.otpOpen})
    }
    this.setState({otpOpen: !this.state.otpOpen})
  }

  async verifyOtp(){
    const resp = await axios.post('https://casualita-api.app/user/register/verifyotp', {
      sessionId: this.state.signupOtpSession,
      otp: this.state.otpInput
    })
    if(resp.data.success){
      this.setState({loader: true})
      this.handleSignupSubmit()
    } else {
      this.setState({msg: 'Some error has occured. Please try again later.', otpOpen: !this.state.otpOpen})
    }
  }

  async getUser(){
    const userR = await localStorage.getItem('token')
    console.log(userR)
  }

  handleLogout(){
    this.setState({isAuthenticated: false, username: ''})
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    socket.emit('logout')
    window.location.reload();
    return(
      <Redirect to='/'/>
    )
  }
  msg(m){
    return(
      <Alert theme="danger">
        {m}
      </Alert>
    )
  }

  render() {
    const otpModal = <Modal open={this.state.otpOpen} toggle={this.sendOtp}>
                      <ModalHeader>Enter OTP</ModalHeader>
                      <ModalBody>
                          <FormGroup>
                            <label htmlFor="#otp">Enter OTP sent to {this.state.signUpUsernameInput}</label>
                            <FormInput onChange={e => this.setState({otpInput: e.target.value})} id="#otp" placeholder="Enter OTP"/>
                          </FormGroup>
                          <Button onClick={() => this.verifyOtp()}>Verify</Button>
                        </ModalBody>
                      </Modal>
    const signupmodal = <Modal open={this.state.signUpModalShow} toggle={this.openSignupModal}>
                            <ModalHeader>Sign Up</ModalHeader>
                            <ModalBody>
                              {this.state.loader ? <CircularProgress/> : null}
                                <FormGroup>
                                  <label htmlFor="#username">Phone number  (OTP will be sent to this number for verification)</label>
                                  <FormInput onChange={e => this.setState({signUpUsernameInput: e.target.value})} id="#username" placeholder="Phone number (Country code if residing outside IN)"/>
                                </FormGroup>
                                <FormGroup>
                                  <label htmlFor="#email">Email</label>
                                  <FormInput onChange={e => this.setState({signUpEmailInput: e.target.value})} id="#email" placeholder="Email" />
                                </FormGroup>
                                <FormGroup>
                                  <label htmlFor="#password">Password</label>
                                  <FormInput onChange={e => this.setState({signUpPasswordInput: e.target.value})} type="password" id="#password" placeholder="Password" />
                                </FormGroup>
                                <FormGroup>
                                  <label htmlFor="#referralId">Referral Id (Optional)</label>
                                  <FormInput onChange={e => this.setState({referralId: e.target.value})} type="text" id="#referralId" placeholder="Referral Id (Optional)" />
                                </FormGroup>
                                <FormGroup>
                                  <Button onClick={() => this.sendOtp()}>Proceed</Button>
                                  <span style={{marginLeft: '5%'}} onClick={() => this.setState({signUpModalShow:false})}>Cancel</span>
                                </FormGroup>
                                {otpModal}
                          </ModalBody>
                        </Modal>
    const loginmodal = <Modal open={this.state.loginModalShow} toggle={this.openSignupModal}>
                        <ModalHeader>Login</ModalHeader>
                        <ModalBody>
                        {this.state.isError ? this.msg(this.state.msg) : null}
                          <Form>
                            <FormGroup>
                              <label htmlFor="#username">Username</label>
                              <FormInput onChange={e => this.setState({loginUsernameInput: e.target.value})} id="#username" placeholder="Username" />
                            </FormGroup>
                            <FormGroup>
                              <label htmlFor="#password">Password</label>
                              <FormInput onChange={e => this.setState({loginPasswordInput: e.target.value})} type="password" id="#password" placeholder="Password" />
                            </FormGroup>
                            <FormGroup>
                              <Button onClick={() => this.handleLoginSubmit()}>Login</Button>
                              <span style={{marginLeft: '5%'}} onClick={() => this.setState({loginModalShow:false})}>Cancel</span>
                            </FormGroup>
                            {this.state.loginloader ? <div style={{textAlign: 'center'}}>{<CircularProgress/>}</div> : null}
                        </Form>
                      </ModalBody>
                    </Modal>
    return (
      <div>
      <Navbar type="dark" theme="primary" expand="md">
        <NavbarBrand href="/"><img src={Logo} style={{height: 40}} alt='logo'/></NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} />

        <Collapse open={this.state.collapseOpen} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink active href="/">
                Play!
              </NavLink>
            </NavItem>
            {localStorage.getItem('user')?
            <NavItem>
              <NavLink href="/leaderboard">
                Leaderboard
              </NavLink>
            </NavItem>
            : null}
          </Nav>
          {this.state.isAuthenticated ? 
          <Nav navbar className="ml-auto">
            <NavItem>
                <NavLink active href="/profile">
                    {this.state.username}
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink onClick={() => this.handleLogout()}>
                    Log Out
                </NavLink>
            </NavItem> 
          </Nav> : <Nav navbar className="ml-auto">
          <NavItem>
              <NavLink active onClick={this.openloginModal}>
                  Login
              </NavLink>
          </NavItem>
          <NavItem>
              <NavLink active onClick={this.openSignupModal}>
                  Sign up
              </NavLink>
          </NavItem></Nav>
        }
        </Collapse>
      </Navbar>
      {signupmodal}
      {loginmodal}
      {localStorage.getItem('user')?null:<Redirect to='/'/>}
      </div>
    );
  }
}


export default withRouter(NavBar)