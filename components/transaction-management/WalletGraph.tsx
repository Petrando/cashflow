import React, {useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'
import { Grid, Typography } from '@material-ui/core/';
import fetchJson from '../../lib/fetchJson';
import Piechart from '../globals/charts/Piechart';
import BarChart from '../globals/charts/Barchart';
import LoadingBackdrop, {LoadingDiv} from '../../components/globals/LoadingBackdrop';
import TimeFilter from '../globals/filterComponents/TimeFilter';
import {graphDataI, walletGraphI} from "../../types";
import {useCommonStyles} from "../../styles/material-ui.styles";

let componentLoaded = false;

const WalletGraph = ({changeSelectedCategory, filter, dispatchFilter}:walletGraphI):JSX.Element => {      
      const router = useRouter();

      const [myGraphData, setMyGraphData] = useState<graphDataI[]>([]);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [isFirstLoad, setFirstLoad] = useState<boolean>(true);
      
      useEffect(()=>{        
        componentLoaded = true;
        return ()=>{
          componentLoaded = false;
        }
      }, [])

      useEffect(()=>{     
          getGraphData();        
          
      }, [filter]);      
      
      const getGraphData = async () => {          
        const {_id } = router.query;

        setIsLoading(true);

        try {
          const categoryGraphData = await fetchJson("/api/transactions/graph-data", {
            method: "POST",            
            headers: {
              Accept: 'application/json',
              "Content-Type": "application/json"
            },
            body: JSON.stringify({walletId:_id, filterData:filter})
          });                
          
          const graphData = categoryGraphData.length > 0?categoryGraphData.map((d)=>{
            return {
              name:d.name,
              layers:d.layers,
              total:d.total
            }
          })
          :
          [];
                                                                          
          setMyGraphData(graphData);
          setFirstLoad(false);
        } catch (error) {
          console.error("An unexpected error happened:", error);
          
        } finally {
          setIsLoading(false)
        }
    }
    
    return ( 
        <>
          {isLoading && <LoadingBackdrop isLoading={isLoading} />} 
          <TimeFilter 
            transactionFilter={filter} 
            dispatchFilter={dispatchFilter} 
          />         
          <Grid container>
            {              
              
              myGraphData.map((d, i)=><GraphContainer 
                                            key={i}                                            
                                            data={d} 
                                            isLoading={isLoading}
                                            isFirstLoad={isFirstLoad}
                                          />)
                
              
            }
          </Grid>
        </>
    )
}

const GraphContainer = (
                        {data, isLoading, isFirstLoad}:
                        { data:graphDataI, isLoading:boolean, isFirstLoad:boolean}
                      ):JSX.Element => {
  const classes = useCommonStyles();
  const graphRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(()=>{
    listenToResize();
    window.addEventListener("resize", listenToResize);

    return ()=>window.removeEventListener("resize", listenToResize);
  }, []);

  const listenToResize = ():void => {
    setWidth(graphRef!==null?(graphRef.current!==null?graphRef.current.offsetWidth:0):0);
  }

  const chartContent = () => (
    <>    
      {
        isLoading && <LoadingBackdrop isLoading={isLoading} />
      }
      <Typography variant={"h6"} component={"h6"} className={classes.leftText}>
        {data.name}{" "}{data.total === 0 && " : no data."}
      </Typography>
      <>
      {
        width > 0 &&
        data.total > 0 &&
        <Piechart width={width} graphData={data} />
      }
      </>    
    </>
  )

  return (
    <Grid item xs={12} sm={6} id="income" className={classes.flexColumnStart} ref={graphRef} >
      {
        isLoading && isFirstLoad && <LoadingDiv />
      }
      {
        !isFirstLoad && chartContent()
      }
      
    </Grid>
  )
}

export default WalletGraph;