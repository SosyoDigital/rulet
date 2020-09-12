import React from 'react';
import { Row, Col, Card, CardBody, CardTitle, Container } from "shards-react";
import ScoreCard from './ScoreCard/ScoreCard';
import { withRouter } from 'react-router-dom';

function LeaderBoard(){
    return(
        <div>
            <Container>
                <Row>
                    <Col sm="12" md="4" lg="2"/>
                        <Col sm="12" md="4" lg="8">
                            <Card style={{textAlign: 'center', marginTop: '3%'}}>
                                <CardTitle style={{margin:'2%'}}>Leaderboard</CardTitle>
                                <CardBody>
                                    <ScoreCard/>
                                </CardBody>
                            </Card>
                        </Col>
                    <Col sm="12" md="4" lg="3"/>
                </Row>
            </Container>
        </div>
    )
}

export default withRouter(LeaderBoard)