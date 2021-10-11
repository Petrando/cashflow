import React, {useState, ChangeEvent} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import {Container, Typography, TextField, Paper} from '@material-ui/core';
import fetchJson from '../../lib/fetchJson';
import { useCommonStyles } from '../../styles/material-ui.styles';

function getSteps() {
  return ["Let's get started!", 'Create starter sub category for Income', 'Create starter sub category for Expenses'];
}

export default function InitializeCategory({refresh}:{refresh:()=>void}) {
  const classes = useCommonStyles();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [incomeSub, setIncomeSub] = useState<string>('');
  const [expenseSub, setExpenseSub] = useState<string>('');
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = ():void => {
    setExpenseSub('');
    setIncomeSub('');
    setActiveStep(0);
  };

  const submitInitialize = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()        

    try {
        const initResult = await fetchJson("/api/categories/initialize-categories", {
          method: "POST",            
          headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
          },
          body: JSON.stringify({incomeSub, expenseSub})
        });          
        console.log(initResult);
        const {acknowledged, insertedCount  } = initResult; 
        if(acknowledged && insertedCount === 2){
          refresh();
        }
        else{
          throw new Error("Category initialization failed");
        }
       
    } catch (error) {
        console.error("An unexpected error happened:", error);
        
    } 
  }

  return (
    <div className={classes.root}>      
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Finalize incomeSub={incomeSub} expenseSub={expenseSub} />
            <Typography className={classes.topBottomSpacing1}>All steps completed</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={(e)=>{submitInitialize(e)}}
            >
              Submit
            </Button>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            {
              activeStep===0 &&
              <Typography className={classes.topBottomSpacing1}>Begin intitializing transaction categories.</Typography>
            }
            {
              activeStep===1 &&
              <SubCategoryInput 
                value={incomeSub}
                changeHandler={(e)=>{setIncomeSub(e.target.value)}}
                label={'Income sub category'}
              />
            }
            {
              activeStep===2 &&
              <SubCategoryInput 
                value={expenseSub}
                changeHandler={(e)=>{setExpenseSub(e.target.value)}}
                label={'Expense sub category'}
              />
            }
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.themeSpacing1}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}
                disabled={
                  activeStep===1 && incomeSub===""?
                  true:
                  activeStep===2 && expenseSub===""?
                  true:
                  false
                }
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SubCategoryInput = ({value, changeHandler, label}:
                          {
                            value:string,
                            changeHandler:(e:ChangeEvent<HTMLInputElement>)=>void,
                            label:string
                          }) => {
  return (
    <TextField
      autoFocus       
      margin="dense"          
      label={label}
      type="text" 
      value={value}     
      onChange={changeHandler}
      fullWidth          
    />
  )
}

const Finalize = ({incomeSub, expenseSub}:{incomeSub:string, expenseSub:string}):JSX.Element => {
  return (  
    <Container>  
      <Button variant="contained" color="primary" fullWidth>
        Income
      </Button>    
      <Paper>
        {incomeSub} 
      </Paper>
      <Button variant="contained" color="primary" fullWidth>
        Expense
      </Button>
      <Paper>
        {expenseSub}
      </Paper>
    </Container>
  )
}