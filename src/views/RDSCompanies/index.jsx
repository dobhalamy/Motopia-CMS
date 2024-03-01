import React, { useState, useEffect, useCallback } from 'react';
import MaterialTable from 'material-table';

import Switch from '@material-ui/core/Switch';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import { getRdsCompaniesList } from 'client/rdsCompanies';
import { addRdsCompany } from 'client/rdsCompanies';
import { deleteRdsCompany } from 'client/rdsCompanies';
import { updateRdsCompany } from 'client/rdsCompanies';

const RDSCompany = () => {
  const [tableData, setTableData] = useState([]);

  const fetchData = useCallback(async () => {
    const data = await getRdsCompaniesList();
    setTableData(data);
  }, []);

  useEffect(() => {
    fetchData();
    return () => {
      setTableData([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddData = async newData => addRdsCompany(newData).then(() => fetchData());
  const handleUpdateData = async newData => updateRdsCompany(newData).then(() => fetchData());
  const handleDeleteData = async ({ _id }) => deleteRdsCompany(_id).then(() => fetchData());
  const columns = [
    {
      title: 'Name',
      field: 'name',
    },
    {
      title: 'Active',
      field: 'isActive',
      editComponent: ({ rowData, onChange }) => <Switch checked={rowData.isActive} inputProps={{ 'aria-label': 'controlled' }} color="primary" onChange={e => onChange(e.target.checked)} />,
      render: rowData => <Switch checked={rowData.isActive} inputProps={{ 'aria-label': 'controlled' }} color="primary" />,
    },
  ];

  return (
    <>
      <GridContainer>
        <GridItem xs={12}>
          <MaterialTable
            title="Companies"
            columns={columns}
            data={tableData}
            options={{
              actionsColumnIndex: -1,
              padding: 'dense',
              paging: false,
            }}
            editable={{
              onRowAdd: handleAddData,
              onRowUpdate: handleUpdateData,
              onRowDelete: handleDeleteData,
            }}
          />
        </GridItem>
      </GridContainer>
    </>
  );
};

export default RDSCompany;
