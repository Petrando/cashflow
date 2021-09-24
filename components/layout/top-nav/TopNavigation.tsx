import * as React from "react";
import { useRouter } from 'next/router';
import { Home,KeyboardArrowUp, ListAlt, AccountBalanceWallet  } from "@material-ui/icons";
import { 
          AppBar, 
          Avatar, 
          Container, 
          Fab, 
          Hidden, 
          IconButton, 
          List, 
          ListItem, 
          ListItemText, 
          ListItemAvatar, 
          Toolbar  
        } from "@material-ui/core";
import SideDrawer from "./SideDrawer";
import HideOnScroll from "./HideOnScroll";
import BackToTop from "./BackToTop";
import Link from "next/link";
import { navLinkI } from "../../../types";
import { useTopNavStyles } from "../../../styles/material-ui.styles";

const navLinks:navLinkI[] = [
  { title: `Wallets`, path: `/wallet-list`, icon:<AccountBalanceWallet />  },
  { title: `Income-Expenses`, path: `/categories`, icon:<ListAlt />}, 
]

const TopNavigation = ():JSX.Element => {
  const classes = useTopNavStyles();
  const router = useRouter();

  return (
  	<>
  	<HideOnScroll>
    <AppBar position="fixed">
      <Toolbar>
      	<Container maxWidth="md" className={classes.navbarDisplayFlex}>
            <Link href={"/"}>
      		    <IconButton edge="start" color="inherit" aria-label="home" >
          		    <Home fontSize="large" />
        	    </IconButton>
            </Link>
        	<Hidden smDown>            
        		<List component="nav" aria-labelledby="main navigation"
        			className={classes.navDisplayFlex}
        		>
    				  {navLinks.map(({ title, path, icon }:navLinkI):JSX.Element => (      					
                        <span key={path} className={classes.linkText}>
                            <Link href={path}>
        					            <ListItem button className={classes.listItem}>
                                {
                                  icon &&
                                  <ListItemAvatar className={classes.linkText}>
                                    <Avatar className={classes.avatar}>
                                      {icon}
                                    </Avatar>
                                  </ListItemAvatar>
                                }
                                <ListItemText 
                                  primary={title} 
                                  className={`${router.pathname===path && classes.activeLink}`}
                                />          						
        					            </ListItem>   
                            </Link>   					
                        </span>
    				  ))}            
  				</List>          
  			</Hidden>
  			<Hidden mdUp>
  				<SideDrawer navLinks={navLinks} currentPath={router.pathname} />
  			</Hidden>
  		</Container>
      </Toolbar>
    </AppBar>
    </HideOnScroll>
    <Toolbar id="back-to-top-anchor" />
    <BackToTop>
  		<Fab color="secondary" size="large" aria-label="scroll back to top">
    		<KeyboardArrowUp />
  		</Fab>
	</BackToTop>
    </>
  )
}

export default TopNavigation;