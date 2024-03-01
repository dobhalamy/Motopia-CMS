import React from "react";
import MaterialTable from "material-table";
import PropTypes from "prop-types";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Radio from '@material-ui/core/Radio';
import { CategoryRoutes } from "client";
import { useToasts } from "react-toast-notifications";

import DeleteCategoryDialog from "./DeleteCategoryDialog";
import AddCategoryDialog from "./AddCategoryDialog";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    RadioPosition: {
        float: 'right',
    }
}));
export default function RideShare(props) {
    const [selectedValue, setSelectedValue] = React.useState('UBER BLACK');
    const { addToast } = useToasts();
    const classes = useStyles();
    const loadCategories = async () => {
        let data;
        try {
            data = await CategoryRoutes.getCategory(selectedValue);
            setState({
                ...state,
                data: [...data.data],
                deleteCategoryDialogOpen: false,
                newCategoryDialogOpen: false
            });
        } catch (err) {
            alert(err);
        }
    };

    React.useEffect(() => {
        loadCategories();
        // eslint-disable-next-line
    }, []);

    const handleChange = async event => {
        setSelectedValue(event.target.value);
        setState({ ...state, isLoading: true });
        let data;
        try {
            data = await CategoryRoutes.getCategory(event.target.value);
            setState({
                ...state,
                data: [...data.data],
                deleteCategoryDialogOpen: false,
                newCategoryDialogOpen: false,
                isLoading: false
            });
        } catch (err) {
            alert(err);
        }
    };

    const [state, setState] = React.useState({
        columns: [
            { title: "Category", field: "category" },
            { title: "Description", field: "description" },
        ],
        data: [],
        deleteCategoryDialogOpen: false,
        deletedCategory: {},
        newCategoryDialogOpen: false,
        isLoading: false
    });

    const deleteCategory = async rowData => {
        setState({ ...state, deleteCategoryDialogOpen: true, deletedCategory: rowData });
        try {
            setState({ ...state, isLoading: true, newCategoryDialogOpen: false });
            await CategoryRoutes.deleteCategory(rowData._id);
            addToast("Deleted Successfully");
        } catch (err) {
            alert(err);
        }
        setState({ ...state, isLoading: false });
        loadCategories();
    };

    const onCloseDeleteCategoryDialog = () =>
        setState({ ...state, deleteCategoryDialogOpen: false });

    const handleDeleteCategory = async () => {
        try {
            await CategoryRoutes.deleteCategory(state.deletedAdmin._id);
        } catch (err) {
            alert(err);
        }
        loadCategories();
    };

    const handleOpenNewCategoryDialog = () =>
        setState({ ...state, newCategoryDialogOpen: true });

    const handleCloseNewCategoryDialog = () =>
        setState({ ...state, newCategoryDialogOpen: false });
    
    const handleAddCategory = async formData => {
        try {
            setState({ ...state, isLoading: true, newCategoryDialogOpen: false });
            await CategoryRoutes.addNewCategory(formData);
            addToast("Successfully Added Description");
        } catch (err) {
            alert(err);
        }
        setState({ ...state, isLoading: false });
        loadCategories();
    };
    return (
        <GridContainer>
            <GridItem xs={12} style={{ margin: 10 }}>
                <Button onClick={handleOpenNewCategoryDialog} variant="contained">
                    Edit Rideshare Description
            </Button>
                <div className={classes.RadioPosition}>
                    <Radio
                        checked={selectedValue === 'UBER BLACK'}
                        onChange={handleChange}
                        value="UBER BLACK"
                        name="UBER BLACK"
                        inputProps={{ 'aria-label': 'UBER BLACK' }}
                        size="small"
                    />UBER BLACK
                    <Radio
                        checked={selectedValue === 'UBER COMFORT'}
                        onChange={handleChange}
                        value="UBER COMFORT"
                        name="UBER COMFORT"
                        inputProps={{ 'aria-label': 'UBER COMFORT' }}
                        size="small"
                    />UBER COMFORT
                    <Radio
                        checked={selectedValue === 'UBER SUV'}
                        onChange={handleChange}
                        value="UBER SUV"
                        name="UBER SUV"
                        inputProps={{ 'aria-label': 'UBER SUV' }}
                        size="small"
                    />UBER SUV
                    <Radio
                        checked={selectedValue === 'UBER X'}
                        onChange={handleChange}
                        value="UBER X"
                        name="UBER X"
                        inputProps={{ 'aria-label': 'UBER X' }}
                        size="small"
                    />UBER X
                    <Radio
                        checked={selectedValue === 'UBER XL'}
                        onChange={handleChange}
                        value="UBER XL"
                        name="UBER XL"
                        inputProps={{ 'aria-label': 'UBER XL' }}
                        size="small"
                    />UBER XL
                </div>
            </GridItem>
            <GridItem xs={12}>
                <MaterialTable
                    title="Rideshare Category"
                    columns={state.columns}
                    data={state.data}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    isLoading={state.isLoading}
                    actions={[
                        {
                            icon: "delete",
                            tooltip: "Delete Category",
                            onClick: (event, rowData) => deleteCategory(rowData)
                        }
                    ]}
                />
            </GridItem>
            <DeleteCategoryDialog
                deleteCategoryDialogOpen={state.deleteCategoryDialogOpen}
                onCloseDeleteCategoryDialog={onCloseDeleteCategoryDialog}
                categoryName={state.deletedCategory.highestCategory}
                handleDeleteCategory={handleDeleteCategory}
            />
            <AddCategoryDialog
                newCategoryDialogOpen={state.newCategoryDialogOpen}
                handleCloseNewCategoryDialog={handleCloseNewCategoryDialog}
                handleAddCategory={handleAddCategory}
            />
        </GridContainer>
    );
}
RideShare.propTypes = {
    isRideShare: PropTypes.bool.isRequired
};