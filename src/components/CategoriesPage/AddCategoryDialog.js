import React from "react";
import { useForm } from 'react-hook-form';
import PropTypes from "prop-types";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import { CategoryRoutes } from "client";

const useStyles = makeStyles((theme) => ({
    formField: {
        margin: 5,
        fontSize: 15,
        fontWeight: 400,
        color: "black"
    },
    left: {
        width: '100%',
        float: 'left'
    },
    right: {
        width: '50%',
        float: 'right'
    },
    inputTypes: {
        width: 140,
        float: 'right'
    },
    selectTypes: {
        float: 'right',
        marginTop: '5',
        width: 147
    },
    selectNumber: {
        float: 'right',
        marginRight: '42%'
    },
    textTypes: {
        float: 'right',
        width: '79%',
        overflow: 'auto',
        minHeight: 100
    },
    submitButton: {
        width: '50%',
        float: 'right',
    },
    buttonClass: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        fontWeight: 600,
        borderColor: '#e0e0e0',
        padding: '6px 14px',
        marginTop: 7,
        fontFamily: 'Arial'
    }
}));
export default function SimpleDialog(props) {
    const { register, handleSubmit } = useForm();
    const categoryData = [
        { value: 'UBER BLACK', name: 'UBER BLACK' },
        { value: 'UBER COMFORT', name: 'UBER COMFORT' },
        { value: 'UBER SUV', name: 'UBER SUV' },
        { value: 'UBER X', name: 'UBER X' },
        { value: 'UBER XL', name: 'UBER XL' },
    ]
    const [selectedCat, setSelectedCat] = React.useState('UBER BLACK');
    const [description, setDescription] = React.useState('');
    const loadDescription = async category => {
        try {
            let data = await CategoryRoutes.getCategoryDescription(category);
            setDescription(data.data);
        } catch (err) {
            alert(err);
        }
    }
    React.useEffect(() => {
        loadDescription(selectedCat);
        // eslint-disable-next-line
    }, []);
    const classes = useStyles();
    const {
        handleCloseNewCategoryDialog,
        handleAddCategory,
        newCategoryDialogOpen
    } = props;

    const handleCategoryChange = (event) => {
        setSelectedCat(event.target.value);
        loadDescription(event.target.value)
    }
    const handleDescChange = (event) => {
        setDescription(event.target.value);
    }
    const onSubmit = data => {
        loadDescription(selectedCat)
        handleAddCategory(data)
    }
    return (
        <Dialog open={newCategoryDialogOpen} onClose={handleCloseNewCategoryDialog}>
            <DialogTitle>Edit description for "{selectedCat}" Category</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={classes.left}>
                        <label className={classes.formField}>
                            Category :
                        </label>
                        <select ref={register} value={selectedCat} onChange={handleCategoryChange} className={classes.selectTypes} name="category" >
                            {categoryData.map((e, key) => {
                                return <option key={key} value={e.value}>{e.name}</option>;
                            })}
                        </select>
                        <br></br>
                        <br></br>
                    </div>
                    <label className={classes.formField}>
                        Description :
                        </label>
                    <textarea
                        type="textArea"
                        ref={register}
                        name="description"
                        required='true'
                        className={classes.textTypes}
                        placeholder="Enter description of car"
                        value={description}
                        onChange={handleDescChange} />
                    <div className={classes.submitButton}>
                        <button className={classes.buttonClass} type="submit">Submit</button>
                    </div>
                </form>

            </DialogContent>

        </Dialog>
    );
}

SimpleDialog.propTypes = {
    handleCloseNewCategoryDialog: PropTypes.func.isRequired,
    handleAddCategory: PropTypes.func.isRequired,
    newCategoryDialogOpen: PropTypes.bool.isRequired
};
