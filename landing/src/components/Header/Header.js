import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Collapse, IconButton, Toolbar, Button } from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link as Scroll } from 'react-scroll'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${process.env.PUBLIC_URL+"/assets/background.jpg"})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    },
    appbar: {
        background: 'none',
        fontFamily: 'Bungee'
    },
    appbarTitle: {
        flexGrow: '1'
    },
    appbarWrapper: {
       width: '80%',
       margin: '0 auto'
    },
    icon: {
        color: '#fff',
        fontSize: '2rem'
    },
    container: {
        textAlign: 'center'
    },
    goDown: {
        color: 'white',
        fontSize: '4rem',
    }
}));

export default function Header(){
    const classes = useStyles();
    const[checked, setChecked] = useState(false)
    useEffect(() => {
        setChecked(true)
    }, [])
    return(
        <div className={classes.root} id="header">
            <AppBar className={classes.appbar} elevation={0}>
                <Toolbar className={classes.appbarWrapper}>
                    <h1 className={classes.appbarTitle}><img src={process.env.PUBLIC_URL+'/assets/logo2.png'} alt='logo'/></h1>
                    <IconButton>
                        <SortIcon className={classes.icon}/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Collapse in={checked} {...(checked?{timeout: 1500}:{})} collapsedHeight={50}>
            <div className={classes.container}>
                <div>
                <h1 style={{color: '#fff', fontFamily: 'Bungee'}}>Mini Roulette is now live on Testnet!</h1>
                <h3 style={{color: '#fff', fontFamily: 'Bungee'}}>It might now function smoothly since its undergoing extensive testing.</h3>
                <Button variant="contained" color="primary" disableElevation size="large" href="https://beta.casualita.app" target="_blank">
                    Play on testnet!
                </Button>
                </div>
                <Scroll to="poweredBy" smooth={true}>
                    <IconButton style={{marginTop: '10%'}}>
                        <ExpandMoreIcon className={classes.goDown}/>
                    </IconButton>
                </Scroll>
            </div>
            </Collapse>
        </div>
    )
}
