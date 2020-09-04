import React from 'react';
import GamePanel from './GamePanel/GamePanel'
import { Container, Row, Col } from "shards-react";

function GameScreen(){
    return(
        <div>
        <Container className="dr-example-container">
            <Row>
                <Col sm="12" md="4" lg="3"/>
                    <Col sm="12" md="4" lg="6">
                        <GamePanel/>
                    </Col>
                <Col sm="12" md="4" lg="3"/>
            </Row>

            <Row>
                <Col sm={{ size: 8, order: 2, offset: 2 }}>
                    Previous Bets
                </Col>
            </Row>
        </Container>
        </div>
    )
}

export default GameScreen