import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea'
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    maxWidth: '100%',
    background: '#03324c',
    textAlign: 'center',
    margin: '20px'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  title: {
    fontFamily: 'Bungee',
    fontWeight: 'bold',
    fontSize: '2em'
  },
  name: {
    color: 'white',
    fontFamily: 'Bungee',
  }
});

export default function CompanyCard({company, checked}) {
  const classes = useStyles();

  return (
    <Collapse in={checked} {...(checked?{timeout: 1000}:{})}>
    <CardActionArea href={company.url} target='_blank'>
      <Card className={classes.root}>
          <CardContent style={{textAlign: 'center'}}>
          <img className={classes.media} src={company.image} alt={company.name}/>
          </CardContent>
          <Button href={company.url} target='_blank'>
            <span className={classes.name}>{company.name}</span>
          </Button>
      </Card>
      </CardActionArea>
    </Collapse>
  );
}
