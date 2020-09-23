import React from 'react';
import GamePanel from './GamePanel/GamePanel';
import RoundsPanel from './RoundsPanel/RoundsPanel';
import { Container, Row, Col } from "shards-react";
import { withRouter } from 'react-router-dom';

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
                <Col sm={{ size: 6, order: 2, offset: 3 }}>
                    <RoundsPanel/>
                    <br/>
                </Col>
            </Row>
        </Container>
        </div>
    )
}

export default withRouter(GameScreen)