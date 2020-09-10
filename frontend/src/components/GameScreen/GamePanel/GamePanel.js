import React from 'react';
import { Row, Col, Card, CardBody, CardTitle, Button, Modal, ModalBody, ModalHeader, ModalFooter, Slider, Alert } from "shards-react";
import classes from './GamePanel.module.css'
import socketIOClient from 'socket.io-client'
import axios from 'axios'
const ENDPOINT = 'http://127.0.0.1:4000'
const socket = socketIOClient(ENDPOINT);
export default class GamePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, numberOfTokens: 10, betChoice: null, betAmount: 10, multiplier: 1, disableButtons: false, isAuthenticated: null, minutes: 0, seconds: 0, balance: 0, roundId: 10000, msg:''};
        this.handleSlide = this.handleSlide.bind(this);
        this.toggle = this.toggle.bind(this);
        }

    componentDidMount(){
        this.user = localStorage.getItem('token')
        if(this.user){
            this.setState({isAuthenticated: true, token: this.user})
            this.getBalance()
            socket.on('time-update', data => {
                this.setState({minutes: data.time.minute, seconds: data.time.second});
                if(this.state.roundId===0){
                    this.setState({roundId: data.roundId})
                }
            })
            socket.on('close-bets', data => {
              this.setState({disableButtons: data})
            })
            socket.on('open-bets', data => {
                this.setState({disableButtons: data})
            })
        } else {
            this.setState({isAuthenticated: false})
        }
    }

    getBalance = async() => {
        const token = localStorage.getItem('token')
        const resp = await axios.get('http://127.0.0.1:4000/user/getbalance', {
            headers: {
            'x-auth-token': token
            }
        })
        this.setState({balance: resp.data.balance})
    }

    choosebet = (choice) => {
        this.setState({betChoice: choice})
        this.toggle()
    }

    toggle = () => {
        this.setState({
          open: !this.state.open
        });
      }

    handleSlide(e) {
        this.setState({
          multiplier: parseInt(e[0])
        });
        this.setState({betAmount: this.state.numberOfTokens*parseInt(e[0])})
      }
    

    cancelBet() {
        this.toggle()
    }

    render(){
    async function submitBet(roundId, betAmount, betChoice, token) {
        let p = null
        switch(betChoice){
            case "Red":
                p = 11
                break
            case "Black":
                p = 12
                break
            case "Green":
                p=13
                break
            default:
                p=betChoice
        }
        await axios.post('http://127.0.0.1:4000/user/addbet',{
            roundId: roundId,
            amount: betAmount,
            pick: p,
            },{
            headers: {
                'x-auth-token': token
            }
        })
        .then(resp => {
            if(resp.data.txHash){
                this.toggle()
            }
            this.setState({msg: resp.data.msg})
        })
        .catch(err => {
            console.log(err)
        })
    }
    const { open } = this.state;
    return(
        <div style={{margin: '10%', textAlign:"center"}}>
            <Row>
                <Col>
                {this.state.isAuthenticated ?
                    <Card className={classes.gamecard}> 
                        <CardBody>
                        {this.state.msg===''?<div/>: 
                            <CardTitle>
                                <Alert theme="info" dismissible={() => this.setState({msg: ''})}>
                                    {this.state.msg}
                                </Alert>
                            </CardTitle>}
                            <CardTitle><h5>Round Number: {this.state.roundId}</h5></CardTitle>
                            <CardTitle><h6>Account Balance: {this.state.balance} CASU <Button outline pill size="sm">Add Tokens</Button></h6><h2>0{this.state.minutes} : {this.state.seconds>=0 && this.state.seconds<10 ? '0'+this.state.seconds : this.state.seconds}</h2></CardTitle>
                            <Button onClick={() => this.choosebet('Red')} squared theme="danger" style={{margin:'2%'}} disabled={this.state.disableButtons}>
                                Bet Red
                            </Button>
                            <Button onClick={() => this.choosebet('Green')} squared theme="success" style={{margin:'2%'}} disabled={this.state.disableButtons}>
                                Bet Green
                            </Button>
                            <Button onClick={() => this.choosebet('Black')} squared theme="dark" style={{margin:'2%'}} disabled={this.state.disableButtons}>
                                Bet Black
                            </Button>
                        </CardBody>
                        <Card className={classes.numbercard}>
                            <CardBody>
                                {[0,1,2,3,4,5,6,7,8,9].map(number => (
                                    <Button onClick={() => this.choosebet(number)} theme="info" style={{margin: '1%'}} disabled={this.state.disableButtons}>{number}</Button>
                                ))}
                            </CardBody>
                        </Card> 
                    </Card> 
                    :
                    <Card className={classes.gamecard}>
                        <CardBody>
                            <CardTitle><h2>You are not logged in!</h2></CardTitle>
                            Please login to play the game.
                        </CardBody>
                    </Card>
                }
                </Col>
            </Row>
            <div>
                <Modal open={open} toggle={this.toggle}>
                <ModalHeader>Bet on <span style={{color: this.state.betChoice}}>{this.state.betChoice}</span></ModalHeader>
                <ModalBody>
                    Select number of tokens <br/>
                    {[10,20,50,100,1000].map(number => (
                        <Button active onClick={() => this.setState({numberOfTokens: number, betAmount: number})} outline theme="light" style={{margin: '1%'}}>{number}</Button>
                    ))}
                    <br/>
                    Multiplier: {this.state.multiplier}<br/>
                    <Slider onSlide={this.handleSlide} pips={{ mode: "steps", stepped: true, density: 11 }} connect={[true, false]} start={[this.state.multiplier]} range={{ min: 1, max: 10 }} />
                    Total bet: {this.state.betAmount?this.state.betAmount:this.state.numberOfTokens}
                </ModalBody>
                <ModalFooter>
                    <Button outline theme="light" onClick={() => this.cancelBet()}>Cancel</Button>
                    <Button theme="success" onClick={() => submitBet(this.state.roundId, this.state.betAmount, this.state.betChoice, this.state.token)}>Place Bet</Button>
                </ModalFooter>
                </Modal>
            </div>
        </div>
        )
    }
}
