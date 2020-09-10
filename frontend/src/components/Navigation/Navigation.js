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
  Alert
} from "shards-react";
import {withRouter, Redirect} from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import axios from 'axios'
const ENDPOINT = 'http://127.0.0.1:4000'
const socket = socketIOClient(ENDPOINT);


class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.openSignupModal = this.openSignupModal.bind(this);
    this.openloginModal = this.openloginModal.bind(this);
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
      isError: false
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
    const resp = await axios.post('http://localhost:4000/user/login', {
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
      window.location.reload(false);
    } else {
      this.setState({isError: true, msg: resp.data.msg})
    }
  }

  async handleSignupSubmit(){
    await axios.post('http://localhost:4000/user/register', {
      username: this.state.signUpUsernameInput,
      password: this.state.signUpPasswordInput,
      email: this.state.signUpEmailInput
    })
    .then(resp => {
      if(resp.data.success){
      this.setState({msg: resp.data.msg})
      localStorage.setItem('token', resp.data.token)
      localStorage.setItem('user', resp.data.user.username)
      this.setState({signUpModalShow: !this.state.signUpModalShow, isAuthenticated: true})
      socket.emit('login')
      window.location.reload(false);
      }
    })
    .catch(err => {
      this.setState({msg: err.msg})
    })
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
    window.location.reload(false);
  }
  msg(m){
    return(
      <Alert theme="danger">
        {m}
      </Alert>
    )
  }

  render() {
    const signupmodal = <Modal open={this.state.signUpModalShow} toggle={this.openSignupModal}>
                            <ModalHeader>Sign Up</ModalHeader>
                            <ModalBody>
                                <FormGroup>
                                  <label htmlFor="#username">Username</label>
                                  <FormInput onChange={e => this.setState({signUpUsernameInput: e.target.value})} id="#username" placeholder="Username" />
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
                                  <label htmlFor="#confirmpassword">Confirm Password</label>
                                  <FormInput onChange={e => this.setState({signUpConfirmPasswordInput: e.target.value})} type="confirmpassword" id="#confirmpassword" placeholder="Password" />
                                </FormGroup>
                                <FormGroup>
                                  <Button onClick={() => this.handleSignupSubmit()}>Submit</Button>
                                  <span style={{marginLeft: '5%'}} onClick={() => this.setState({signUpModalShow:false})}>Cancel</span>
                                </FormGroup>
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
                        </Form>
                      </ModalBody>
                    </Modal>
    return (
      <div>
      <Navbar type="dark" theme="primary" expand="md">
        <NavbarBrand href="#">Casualità</NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} />

        <Collapse open={this.state.collapseOpen} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink active href="/">
                Play!
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={this.getUser}>
                Get User
              </NavLink>
            </NavItem>
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
      </div>
    );
  }
}


export default withRouter(NavBar)