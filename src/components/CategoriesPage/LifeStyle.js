import React from "react";
import MaterialTable from "material-table";
import PropTypes from "prop-types";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { LifeStyleRoutes } from "client";
import { useToasts } from "react-toast-notifications";

import DeleteCategoryDialog from "./DeleteCategoryDialog";
import AddLifeStyleDialog from "./AddLifeStyleDialog";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    DropDownPosition: {
        minHeight: 35,
        fontSize: 15,
        boxSizing: 'border-box',
        borderRadius: 6,
        float: 'right'
    }
}));
export default function LifeStyle(props) {
    const selectData = [
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
    const [selectedData, setSelectedData] = React.useState('Deluxe Drive');
    const classes = useStyles();
    const { addToast } = useToasts();

    const loadCategories = async categoryName => {
        setState({ ...state, isLoading: true });
        let data;
        try {
            data = await LifeStyleRoutes.getLifeStyleCategory(categoryName);
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

    React.useEffect(() => {
        loadCategories(selectedData);
        // eslint-disable-next-line
    }, []);

    const handleSelect = (event) => {
        setSelectedData(event.target.value);
        loadCategories(event.target.value)
    }

    const [state, setState] = React.useState({
        columns: [
            { title: "Category", field: "category", editable: 'never' },
            {
                title: "Description",
                field: "description",
                cellStyle: {
                    width: '100%'
                },
                editComponent: props => (
                    <TextField
                      fullWidth
                      value={props.rowData.description}
                      onChange={event => {
                        props.onChange(event.target.value, props.rowData);
                      }}
                    />
                  )
            },
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
            await LifeStyleRoutes.deleteLifeStyleCategory(rowData._id);
            addToast("Deleted");
            loadCategories(selectedData);
        } catch (err) {
            alert(err);
        }
        setState({ ...state, isLoading: false });
    };

    const onCloseDeleteCategoryDialog = () =>
        setState({ ...state, deleteCategoryDialogOpen: false });

    const handleDeleteCategory = async () => {
        try {
            // await LifeStyleRoutes.deleteLifeStyleCategory(state.deletedAdmin._id);
        } catch (err) {
            alert(err);
        }
        loadCategories(selectedData);
    };

    const handleOpenNewCategoryDialog = () =>
        setState({ ...state, newCategoryDialogOpen: true });

    const handleCloseNewCategoryDialog = () =>
        setState({ ...state, newCategoryDialogOpen: false });

    const handleAddCategory = async formData => {
        try {
            setState({ ...state, isLoading: true, newCategoryDialogOpen: false });
            await LifeStyleRoutes.addNewLifeStyleCategory(formData);
            addToast("Description Added Successfully")
        } catch (err) {
            alert(err);
        }
        setState({ ...state, isLoading: false });
        loadCategories(selectedData);
    };
    const handleEdit = async newData => {
        setState({ ...state, isLoading: true });
        try {
            await LifeStyleRoutes.updateLifeStyleCategory(newData);
            addToast("Update Success");
            loadCategories(selectedData);
        } catch (err) {
            alert(err);
        }
        setState({ ...state, isLoading: false });

    }
    return (
        <GridContainer>
            <GridItem xs={12} style={{ margin: 10 }}>
                <Button onClick={handleOpenNewCategoryDialog} variant="contained">
                    Add LifeStyle Description
            </Button>
                <select className={classes.DropDownPosition} onChange={event => handleSelect(event)} name="Category" >
                    {selectData.map((e, key) => {
                        return <option key={key} value={e.value} >{e.name}</option>;
                    })}
                </select>
            </GridItem>
            <GridItem xs={12}>
                <MaterialTable
                    title="LifeStyle Category"
                    columns={state.columns}
                    data={state.data}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    isLoading={state.isLoading}
                    editable={{
                        onRowUpdate: newData => handleEdit(newData)
                    }}
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
            <AddLifeStyleDialog
                newCategoryDialogOpen={state.newCategoryDialogOpen}
                handleCloseNewCategoryDialog={handleCloseNewCategoryDialog}
                handleAddCategory={handleAddCategory}
            />
        </GridContainer>
    );
}
LifeStyle.propTypes = {
    isRideShare: PropTypes.bool.isRequired
};