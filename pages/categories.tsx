import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import Layout from '../components/layout'
import { Container } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import InitializeCategory from '../components/category-management/InitializeCategory';
import LoadingBackdrop from '../components/globals/LoadingBackdrop';
import Category from '../components/category-management/Category';
import ShowAlert from '../components/globals/Alert';
import { useCategoryStyles } from '../styles/material-ui.styles';

const Categories = () => {	
	const classes = useCategoryStyles();

  const { data, mutate, error } = useSWR('/api/categories/category-list', fetcher);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [refreshMe, setRefresh] = useState<boolean>(false);

  useEffect(()=>{
    if(data && isLoading){
      setIsLoading(false);
    }
  }, [data, error])

  useEffect(()=>{
    if(refreshMe){
      mutate();
      setRefresh(false);
    }
  }, [refreshMe]);

	return (
		<Layout>      
      		<Head>
        		<title>
          			Category Management
        		</title>
      		</Head>
      		<Container>
			  	{
        			isLoading &&
        			<LoadingBackdrop isLoading={isLoading} />
      			} 
				{
					!isLoading &&			
          !data.error &&		
					<Typography variant="h5" className={classes.pageTitle} >
						{
							data.length > 0?
							'Category Management':
							'To start, please enter initial sub category data.'
						}
					</Typography>
				}				      			      				     							      			
      	{
      		!isLoading &&					
          !data.error &&
					<>
					  {
              data &&
						  data.length > 0?
						  data.map((d,i)=><Category key={d._id} 
														categoryData={d} 
														refresh={()=>{setRefresh(true)}} />)
						  :
						  <InitializeCategory refresh={()=>{setRefresh(true)}} />
					  }
					</>      				
      	}
				{
					!isLoading &&
					(error || data.error) &&  
					<ShowAlert severity={"error"} label={`ERROR : ${error?error:"Please check your connection"}`} />
				}  
      		</Container>
      	</Layout>
	)
}

export default Categories;