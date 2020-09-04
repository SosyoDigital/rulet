import React, {useState, Component} from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Button, Modal, ModalBody, ModalHeader, ModalFooter, Slider } from "shards-react";
import classes from './GamePanel.module.css'
export default class GamePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, numberOfTokens: 10, betChoice: null, betAmount: null, multiplier: 1, disableButtons: false};
        this.handleSlide = this.handleSlide.bind(this);
        this.toggle = this.toggle.bind(this);
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

    render(){
    const { open } = this.state;
    return(
        <div style={{margin: '10%', textAlign:"center"}}>
            <Row>
                <Col>
                    <Card className={classes.gamecard}>
                        <CardBody>
                            <CardTitle><h6>Account Balance: 15000 <Button outline pill size="sm">Add Tokens</Button></h6><h2>02:30</h2></CardTitle>
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
                        Submit Buttons
                </ModalFooter>
                </Modal>
            </div>
        </div>
        )
    }
}
