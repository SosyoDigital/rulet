import React from 'react';
import { Row, Col, Card, CardBody, CardTitle, Button, Modal, ModalBody, ModalHeader, ModalFooter, Slider, Alert } from "shards-react";
import classes from './GamePanel.module.css'
import CancelIcon from '@material-ui/icons/Cancel';
import socketIOClient from 'socket.io-client'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
const ENDPOINT = 'https://casualita-api.app/'
const socket = socketIOClient(ENDPOINT);
export default class GamePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, numberOfTokens: 10, betChoice: null, betAmount: 10, multiplier: 1, disableButtons: false, isAuthenticated: null, minutes: 0, seconds: 0, balance: 0, roundId: 0, msg:'', showHowToPlay: false, placeBetIsLoading: false};
        this.handleSlide = this.handleSlide.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleHowToPlay = this.toggleHowToPlay.bind(this)
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
                this.setState({disableButtons: data.bool, roundId: data.roundId})
            })
            socket.on('balance-update', data => {
                this.getBalance()
            })
        } else {
            this.setState({isAuthenticated: false})
        }
    }

    getBalance = async() => {
        const token = localStorage.getItem('token')
        const resp = await axios.get('https://casualita-api.app/user/getbalance', {
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

    toggleHowToPlay = () => {
        this.setState({
            showHowToPlay: !this.state.showHowToPlay
        })
    }

    handleSlide(e) {
        this.setState({
          multiplier: parseInt(e[0])
        });
        this.setState({betAmount: this.state.numberOfTokens*parseInt(e[0])})
      }
    

    cancelBet() {
        this.toggle()
        this.setState({placeBetIsLoading: false})
    }
    async submitBet(roundId, betAmount, betChoice, token) {
        this.setState({placeBetIsLoading: true})
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
        const resp = await axios.post('https://casualita-api.app/user/addbet',{
            roundId: roundId,
            amount: betAmount,
            pick: p,
            },{
            headers: {
                'x-auth-token': token
            }
        }).catch(err => {
            console.log(err)
        })
        if(resp){
            this.toggle()
            this.getBalance()
            this.setState({msg: resp.data.msg})
            this.setState({placeBetIsLoading: false})
        }
        
    }

    render(){
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
                            <CardTitle><span style={{fontSize: '0.7em'}} onClick={this.toggleHowToPlay}>How to play?</span><br/><h5>Round Number: {this.state.roundId}</h5></CardTitle>
                            <CardTitle><h6>Account Balance: {this.state.balance} CASU <Button outline pill size="sm" disabled>Add Tokens</Button></h6><h2>0{this.state.minutes} : {this.state.seconds>=0 && this.state.seconds<10 ? '0'+this.state.seconds : this.state.seconds}</h2></CardTitle>
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
                            <span style={{fontWeight: '400'}}>Bet Number</span>
                            <CardBody style={{marginTop: '-5%'}}>
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
                    <span style={{fontSize: '1.2em', fontWeight: 'bold'}}>Total bet: {this.state.betAmount?this.state.betAmount:this.state.numberOfTokens}</span>
                </ModalBody>
                <ModalFooter>
                    {this.state.placeBetIsLoading ? <CircularProgress/> : null}
                    <Button outline theme="light" onClick={() => this.cancelBet()}>Cancel</Button>
                    <Button theme="success" onClick={() => this.submitBet(this.state.roundId, this.state.betAmount, this.state.betChoice, this.state.token)}>Place Bet</Button>
                </ModalFooter>
                </Modal>
            </div>
            <div>
                <Modal open={this.state.showHowToPlay} toggle={this.toggleHowToPlay}>
                    <ModalHeader>Rules of the game</ModalHeader>
                    <ModalBody>
                    <ol style={{textAlign: 'left'}}>
                        <li>Result for a round will be issued every 2 minutes. 1 minute and 30 seconds for users to place a bet and 30 seconds for drawing of result and distribution of funds.</li>
                        <li>The game will consist of 3 colors - Green, Black and Red and numbers from 0-9.</li>
                        <li>Numbers 1,3,7,9 will represent color Red, numbers 2,4,6,8 will represent color Black and numbers 0,5 will represent Green. The result drawn will be a number only.</li>
                        <li>For guessing the correct color the player will be rewarded with 2x the bet amount. But if the result is 5 and player had guessed Red or the result is 0 and the player guessed Black then he will be rewarded with 1x the bet amount.</li>
                        <li>If the user bets on color Green and the result is 0 or 5 then the user gets 4x the bet amount.</li>
                        <li>If the user guesses the correct number, irrespective of the color then he gets 8x the bet amount.</li>
                        <li>3% service fee is deducted for every bet.</li>
                    </ol>
                    <CancelIcon onClick={this.toggleHowToPlay}/>
                    </ModalBody>
                </Modal>
            </div>
        </div>
        )
    }
}
