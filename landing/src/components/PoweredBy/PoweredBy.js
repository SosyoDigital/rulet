import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CompanyCard from './CompanyCard/CompanyCard';
import companies from '../../static/companies';
import Grid from '@material-ui/core/Grid';
import useWindowPosition from '../../hook/useWindowPosition';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        //display: 'flex',
        // justifyContent: 'center',
        //alignItems: 'center',
        //flexWrap: 'wrap'
        flexGrow: 1,
        marginTop: '2%'
    },
    hr: {
      borderTop: '3px double #8c8b8b',
      marginLeft: '5%',
      marginRight: '5%'
    },
    poweredTitle: {
        fontSize: '3em',
        fontFamily: 'Bungee',
    }
}));

export default function PoweredBy(){
    const classes = useStyles();
    const checked = useWindowPosition('header');
    return(
        <div id="poweredBy">
        <Grid container className={classes.root} spacing={1}>
            <Grid item xs={12} style={{textAlign: 'center'}}>
                <span className={classes.poweredTitle}>Powered By</span>
                <hr className={classes.hr}/>
            </Grid>
            <Grid item xs>
                <CompanyCard company={companies[0]} checked={checked}/>
            </Grid>
            <Grid item xs>
                <CompanyCard company={companies[1]} checked={checked}/>
            </Grid>
            <Grid item xs>
                <CompanyCard company={companies[2]} checked={checked}/>
            </Grid>
        </Grid>
        </div>
    )
}