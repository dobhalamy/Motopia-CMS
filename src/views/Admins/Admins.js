import React from "react";
import { useStore } from "react-redux";
import MaterialTable from "material-table";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import DeleteAdminDialog from "components/AdminsPage/DeleteAdminDialog";
import AddAdminDialog from "components/AdminsPage/AddAdminDialog";

import { AdminsRoutes } from "client";
import Button from "@material-ui/core/Button";

export default function Admins() {
  const store = useStore().getState();
  const { email } = store.auth.currentUser;
  const [state, setState] = React.useState({
    columns: [
      { title: "Status", field: "status" },
      { title: "Role", field: "role" },
      { title: "Email", field: "email" }
    ],
    data: [],
    deleteAdminDialogOpen: false,
    deletedAdmin: {},
    newAdminDialogOpen: false
  });

  const loadAdmins = async () => {
    let data;
    try {
      data = await AdminsRoutes.getAdmins();
      setState({
        ...state,
        data: [...data.data.filter(user => user.email !== email)],
        deleteAdminDialogOpen: false,
        newAdminDialogOpen: false
      });
    } catch (err) {
      alert(err);
    }
  };

  React.useEffect(() => {
    loadAdmins();
    // eslint-disable-next-line
  }, []);

  const deleteUser = async rowData => {
    setState({ ...state, deleteAdminDialogOpen: true, deletedAdmin: rowData });
  };

  const onCloseDeleteAdminDialog = () =>
    setState({ ...state, deleteAdminDialogOpen: false });

  const handleOpenNewAdminDialog = () =>
    setState({ ...state, newAdminDialogOpen: true });

  const handleCloseNewAdminDialog = () =>
    setState({ ...state, newAdminDialogOpen: false });

  const handleDeleteAdmin = async () => {
    try {
      await AdminsRoutes.deleteAdmin(state.deletedAdmin._id);
    } catch (err) {
      alert(err);
    }
    loadAdmins();
  };

  const handleAddAdmin = async newAdminEmail => {
    try {
      await AdminsRoutes.addNewAdmin(newAdminEmail);
    } catch (err) {
      alert(err);
    }
    loadAdmins();
  };

  return (
    <GridContainer>
      <GridItem xs={12} style={{ margin: 10 }}>
        <Button onClick={handleOpenNewAdminDialog} variant="contained">
          Add new admin
        </Button>
      </GridItem>
      <GridItem xs={12}>
        <MaterialTable
          title="Admins"
          columns={state.columns}
          data={state.data}
          options={{
            actionsColumnIndex: -1
          }}
          actions={[
            {
              icon: "delete",
              tooltip: "Delete User",
              onClick: (event, rowData) => deleteUser(rowData)
            }
          ]}
        />
      </GridItem>
      <DeleteAdminDialog
        deleteAdminDialogOpen={state.deleteAdminDialogOpen}
        onCloseDeleteAdminDialog={onCloseDeleteAdminDialog}
        adminName={state.deletedAdmin.login}
        handleDeleteAdmin={handleDeleteAdmin}
      />
      <AddAdminDialog
        newAdminDialogOpen={state.newAdminDialogOpen}
        handleCloseNewAdminDialog={handleCloseNewAdminDialog}
        handleAddAdmin={handleAddAdmin}
      />
    </GridContainer>
  );
}
