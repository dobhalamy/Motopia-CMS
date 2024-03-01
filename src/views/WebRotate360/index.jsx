import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';

import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import WebRotate360Dialog from 'components/WebRotate360Dialog';
import { useSelector } from 'react-redux';
import { vehicles360Selector } from 'redux/selectors';

const WebRotate360 = () => {
  const [dialog, setDialog] = useState({
    isOpen: false,
    action: 'preview',
    stockid: null,
    rows: [],
    hotspots: [],
  });
  const storeList = useSelector(vehicles360Selector);
  const columns = [
    { title: 'Stock ID', field: 'stockid' },
    { title: '20° layer', field: 'degree20' },
    { title: '45° layer', field: 'degree45' },
    { title: '60° layer', field: 'degree60' },
  ];
  const [tableData, setTableData] = useState([]);

  const lowResPictures = array => array.map(({ lowRes }) => lowRes);

  const handleDialogOpen = (stockid, action = 'preview') => {
    const vehicle360 = storeList.find(el => el.stockid === stockid);
    setDialog({
      isOpen: true,
      action,
      stockid,
      rows: [
        lowResPictures(vehicle360.degree20),
        lowResPictures(vehicle360.degree45),
        lowResPictures(vehicle360.degree60),
      ],
      hotspots: vehicle360.hotspots,
    });
  };
  const handleCloseDialog = () =>
    setDialog({
      ...dialog,
      isOpen: false,
    });

  useEffect(() => {
    const transformedData = storeList.map(item => ({
      stockid: item.stockid,
      degree20: item.degree20.length,
      degree45: item.degree45.length,
      degree60: item.degree60.length,
    }));
    setTableData(transformedData);
    return () => {
      setTableData([]);
    };
  }, [storeList]);

  return (
    <>
      <GridContainer>
        <GridItem xs={12}>
          <MaterialTable
            title="Assets"
            columns={columns}
            data={tableData}
            options={{
              actionsColumnIndex: -1,
              padding: 'dense',
            }}
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit',
                onClick: (event, rowData) => handleDialogOpen(rowData.stockid),
              },
            ]}
          />
        </GridItem>
      </GridContainer>
      {dialog.isOpen && (
        <WebRotate360Dialog
          isOpen={dialog.isOpen}
          action={dialog.action}
          data={dialog.stockid}
          rows={dialog.rows}
          existingHotspots={dialog.hotspots}
          handleCloseDialog={handleCloseDialog}
        />
      )}
    </>
  );
};

export default WebRotate360;
