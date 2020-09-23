import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';

const useStyles = makeStyles({
  root: {
    width: '100%',
    background: '#03324c'
  },
  icon: {
      color: '#fff',
      fontSize: '3em'
  }
});

export default function LabelBottomNavigation() {
  const classes = useStyles();

  return (
    <BottomNavigation className={classes.root}>
      <BottomNavigationAction  href="https://instagram.com/casualita.app" target="_blank" label="Instagram" icon={<InstagramIcon className={classes.icon}/>} />
      <BottomNavigationAction href="https://twitter.com/CasualitaA" target="_blank" label="Twitter" icon={<TwitterIcon className={classes.icon}/>} />
    </BottomNavigation>
  );
}
