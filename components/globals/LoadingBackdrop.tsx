import React from 'react';
import { Backdrop, CircularProgress } from "@material-ui/core";
import { useLoadingStyles } from '../../styles/material-ui.styles';

const LoadingBackdrop = ({isLoading}:{isLoading:boolean}):JSX.Element => {
	const classes = useLoadingStyles();
	
	return(
		<Backdrop className={classes.backdrop} open={isLoading} >
        	<CircularProgress color="inherit" />
    	</Backdrop>
	)	
}

export const LoadingDiv = ():JSX.Element => {
	const classes = useLoadingStyles();

	return (
		<div className={classes.loadingDivStyle}>
			<CircularProgress />
		</div>
	)
}

export default LoadingBackdrop;