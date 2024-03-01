import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import MaterialTable from 'material-table';

import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import { Button, Switch } from '@material-ui/core';

import { BlogPosts } from 'client';
import { useToasts } from 'react-toast-notifications';

const newPostRoute = '/admin/blog/new-post';

export default function Admins() {
  const { addToast } = useToasts();
  const [state, setState] = useState({
    columns: [
      { title: 'Title', field: 'title' },
      { title: 'URL', field: 'url' },
      { title: 'Category', field: 'category' },
      {
        title: 'Active',
        field: 'isActive',
        render: rowData => <Switch checked={rowData.isActive} inputProps={{ 'aria-label': 'controlled' }} color="primary" />,
      },
    ],
    data: [],
    deleteAdminDialogOpen: false,
    deletedAdmin: {},
    newAdminDialogOpen: false,
  });
  const [isLoading, setLoading] = useState();
  const [postCategories, setPostCategories] = useState([]);
  const history = useHistory();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const {
      data: { list, categories },
    } = await BlogPosts.getAll();
    setState({ ...state, data: list });
    setPostCategories(categories);
    setLoading(false);
  }, [state]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (event, rowData) => {
    history.push(newPostRoute, { ...rowData, categories: postCategories });
  };
  const handleDeleteData = async (e, { _id }) =>
    BlogPosts.deleteBlogPost(_id).then(() => {
      addToast('Deleted');
      return fetchData();
    });

  return (
    <GridContainer>
      <GridItem xs={12} style={{ margin: 10 }}>
        <Button onClick={() => history.push(newPostRoute, { categories: postCategories })} variant="contained">
          Add new post
        </Button>
      </GridItem>
      <GridItem xs={12}>
        <MaterialTable
          title="Posts"
          columns={state.columns}
          data={state.data}
          isLoading={isLoading}
          options={{
            actionsColumnIndex: -1,
            padding: 'dense',
          }}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit Post',
              onClick: handleEdit,
            },
            {
              icon: 'delete',
              tooltip: 'Delete Post',
              onClick: handleDeleteData,
            },
          ]}
        />
      </GridItem>
    </GridContainer>
  );
}
