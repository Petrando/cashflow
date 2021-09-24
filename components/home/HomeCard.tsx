import React from 'react';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ForwardIcon from '@material-ui/icons/Forward';
import { walletCardI } from '../../types';
import { useHomeCardStyles } from "../../styles/material-ui.styles"

export default function HomeCard({title, about, avatar, linkTo}:walletCardI):JSX.Element {
  const classes = useHomeCardStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar className={classes.avatar}>
            {avatar}
          </Avatar>
        }        
        title={title}        
      />      
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {about}
        </Typography>
      </CardContent>
      <CardActions disableSpacing className={classes.cardActions}>
        <Link href={linkTo}>
          <Button color="primary" endIcon={<ForwardIcon />} aria-label="go">
            Go
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
