import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem } from "shards-react";
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CircularProgress from '@material-ui/core/CircularProgress';

function AllPersonalBets(){
    const useStyles = makeStyles({
        blackbox: {
          height: 20,
          width: 20,
          border: '1px solid black',
          borderRadius: 7,
          backgroundColor: 'black',
          marginLeft: '50%'
        },
        redbox: {
          height: 20,
          width: 20,
          border: '1px solid red',
          borderRadius: 7,
          backgroundColor: 'red',
          marginLeft: '50%'
        },
        greenbox: {
          height: 20,
          width: 20,
          border: '1px solid green',
          backgroundColor: 'green',
          borderRadius: 7,
          alignSelf: 'right',
          marginLeft: '50%',
          marginTop: '5%'
        }
      })
    const[allPersonalBets, setPersonalBets] = useState([])
    const[isLoading, setisLoading] = useState(true)
    const boxes = useStyles();
    useEffect(() => {
        async function getAllBets(){
            const token = localStorage.getItem('token')
            const resp = await axios.get('https://casualita-api.app/user/getallbets',{
                headers: {
                'x-auth-token': token
                }
            })
            const arr = resp.data
            let obj = []
            for(let i = 0; i<arr.length; i++){
                    let object = {
                        amount: arr[i][1],
                        pick: arr[i][2],
                        roundId: arr[i][3]
                    }
                    obj.push(object)
            }
            setPersonalBets(obj)
            setisLoading(false)
        }
        getAllBets()
    })
    return(
        <Container className="dr-example-container">
            <ListGroup style={{margin: '5%', textAlign: 'center'}}>
                <ListGroupItem><Row><Col><span style={{fontSize: '1.2em', fontWeight: 'bold'}}>Round ID</span></Col><Col><span style={{fontSize: '1.2em', fontWeight: 'bold'}}>Bet Amount <AttachMoneyIcon/></span></Col><Col><span style={{fontSize: '1.2em', fontWeight: 'bold'}}>Pick</span></Col></Row></ListGroupItem>
                <ListGroupItem>{isLoading? <CircularProgress/>:null}</ListGroupItem>
                {allPersonalBets.map(bet => {
                    return(
                        <ListGroupItem><Row><Col>{bet.roundId}</Col><Col>{bet.amount}</Col><Col>{bet.pick==12?<div className={boxes.blackbox}/>: bet.pick==11 ? <div className={boxes.redbox}/>: bet.pick==13 ? <div className={boxes.greenbox}/> : bet.pick}</Col></Row></ListGroupItem>
                    )
                })}
            </ListGroup>
        </Container>
    );
}

export default withRouter(AllPersonalBets)