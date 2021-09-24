import { useState, useEffect } from "react";
import { TextField, IconButton, Divider} from '@material-ui/core';
import { Check, Clear, Refresh } from "@material-ui/icons";
import { useCategoryStyles } from "../../styles/material-ui.styles";
import { editSubCategoryI } from "../../types";

const EditSubCategory = ({
							subCategoryData:{_id, name}, 
							submitEdit, 
							cancelEdit
						}:editSubCategoryI):JSX.Element => {
	const classes = useCategoryStyles();

	const [newName, setNewName] = useState<string>('');
	const [editDirty, setEditDirty] = useState<boolean>(false);

	useEffect(()=>{
		setEditDirty(newName!==name);
	}, [newName]);

	useEffect(()=>{
		initNewName();
	}, []);

	const initNewName = () => {
		setNewName(name);
	}

	return (
		<>
			<TextField
          		autoFocus	              
          		margin="dense"          		
          		label="New Name"
          		type="text" 
          		value={newName}           		
          		onChange={(e)=>setNewName(e.target.value)}
          		fullWidth          		
        	/>
      		<IconButton type="submit" color='primary' className={classes.iconButton} aria-label="ok"
      			onClick={(e)=>{
      					e.preventDefault(); 
      					if(!editDirty){cancelEdit();}
      					else{submitEdit(_id, {newName});}
      			}}     					
      		>
        		<Check />
      		</IconButton>
      		<Divider className={classes.divider} orientation="vertical" />
      		<IconButton color='primary' className={classes.iconButton} aria-label="refresh" disabled={!editDirty}
      			onClick={initNewName}
      		>
        		<Refresh />
      		</IconButton>
      		<Divider className={classes.divider} orientation="vertical" />
      		<IconButton color='secondary' className={classes.iconButton} aria-label="cancel"
      			onClick={cancelEdit}
      		>
        		<Clear />
      		</IconButton>
      	</>
	)
}

export default EditSubCategory;