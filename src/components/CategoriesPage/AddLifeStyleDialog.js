import React from "react";
import { useForm } from 'react-hook-form';
import PropTypes from "prop-types";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    formField: {
        margin: 5,
        fontSize: 15,
        fontWeight: 400,
        color: "black"
    },
    leftSide: {
        width: '100%',
        float: 'left'
    },
    submitButton: {
        width: '50%',
        float: 'right'
    },
    selectTypes: {
        float: 'right',
        marginTop: '5',
        width: 147
    },
    textTypes: {
        float: 'right',
        width: '75%',
        overflow: 'auto',
        minHeight: 100
    },
    buttonClass: {
        backgroundColor: '#e0e0e0',
        fontWeight: 600,
        borderRadius: 4,
        borderColor: '#e0e0e0',
        padding: '6px 14px',
        marginTop: 7,
        fontFamily: 'Arial'
    }
}));
export default function SimpleDialog(props) {
    const { register, handleSubmit } = useForm();
    const categoryData = [
        { value: 'Deluxe Drive', name: 'Deluxe Drive' },
        { value: `Commuter's Benefit`, name: `Commuter's Benefit` },
        { value: 'Family Owned', name: 'Family Owned' },
        { value: 'Almost New', name: 'Almost New' },
        { value: 'Tech Genius', name: 'Tech Genius' },
        { value: 'Conscious Cars', name: 'Conscious Cars' },
        { value: 'Fabulously Fast', name: 'Fabulously Fast' },
        { value: 'Convertible', name: 'Convertible' },
        { value: 'Smart Purchase', name: 'Smart Purchase' },
        { value: 'Petite & Powerful', name: 'Petite & Powerful' },
        { value: 'Spacious', name: 'Spacious' },
    ]
    const [selectedCat, setSelectedCat] = React.useState('Deluxe Drive');
    const [description, setDescription] = React.useState('');
    React.useEffect(() => {
        // eslint-disable-next-line
    }, []);
    const classes = useStyles();
    const {
        handleCloseNewCategoryDialog,
        handleAddCategory,
        newCategoryDialogOpen
    } = props;
    const handleCategoryChange = async event => {
        setSelectedCat(event.target.value)
    }
    const handleDescChange = event => {
        setDescription(event.target.value)
    }
    const onSubmit = data => {
        setSelectedCat("Deluxe Drive")
        handleAddCategory(data)
    }
    return (
        <Dialog open={newCategoryDialogOpen} onClose={handleCloseNewCategoryDialog}>
            <DialogTitle>Enter new description for "{selectedCat}"</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={classes.leftSide}>
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
                        Description* :
                        </label>
                    <textarea
                        type="textArea"
                        ref={register}
                        name="description"
                        required="true"
                        value={description}
                        onChange={handleDescChange}
                        className={classes.textTypes}
                        placeholder="Enter description of car"
                    />
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
