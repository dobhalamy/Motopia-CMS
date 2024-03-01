/* eslint-disable react/display-name */
import React from "react";
import PropTypes from "prop-types";
import MaterialTable from "material-table";
import TextField from "@material-ui/core/TextField";
import { useToasts } from "react-toast-notifications";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { MenuItemsRoutes } from "client";

const MenuItems = () => {
  const { addToast } = useToasts();
  const tableColumns = [
    {
      title: "Title",
      field: "title",
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          rowsMax="4"
          value={props.rowData.title}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      )
    },
    {
      title: "Link Path",
      field: "linkPath",
      editComponent: props => (
        <TextField
          value={props.rowData.linkPath}
          fullWidth
          multiline
          placeholder="https://example.com"
          onChange={event => {
            props.onChange(
              event.target.value,
              props.rowData
            );
          }}
        />
      )
    },
  ];

  const [state, setState] = React.useState({
    data: [],
  });

  const loadMenus = async () => {
    try {
      const response = await MenuItemsRoutes.getMenuItem();
      setState({
        ...state,
        data: response.data
      });
    } catch (err) {
      const message = err.response.data.message || err.response.message || err.message || err;
      addToast(message, { severity: "info" });
    }
  };

  React.useEffect(() => {
    loadMenus();
    // eslint-disable-next-line
  }, []);

  const handleChangeBanner = async (newData, oldData) => {
    try {
      const response = await MenuItemsRoutes.updateMenuItem(newData);
      if (response.status === 'success') {
        addToast(response.status);
        loadMenus();
    } else {
        addToast(response.status,  { severity: 'error' });
    }
    } catch (err) {
      addToast(err.response.data.message, { severity: 'error' });
    }
    loadMenus();
  };

  const handleDelete = async (data) => {
    const response = await MenuItemsRoutes.deleteMenuItem(data._id);
    if (response.status === 'deleted') {
        addToast(response.status);
        loadMenus();
    } else {
        addToast(response.status,  { severity: 'error' });
    }
  };

  const handleAddItem = async (newData) => {
    const response = await MenuItemsRoutes.addMenuItem(newData);
    if (response.status === 'success') {
        addToast(response.status);
        loadMenus();
    } else {
        addToast(response.status,  { severity: 'error' });
    }
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <MaterialTable
          title="Menu Items"
          columns={tableColumns}
          data={state.data}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  handleAddItem(newData);
                  resolve();
                }, 1000)
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                    handleChangeBanner(newData, oldData)
                  resolve();
                }, 1000)
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                    handleDelete(oldData);
                  resolve();
                }, 1000)
              }),
          }}
        />
      </GridItem>
    </GridContainer>
  );
}

MenuItems.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  rowData: PropTypes.object.isRequired
};

MenuItems.defaultProps = {
  value: ""
};

export default MenuItems;