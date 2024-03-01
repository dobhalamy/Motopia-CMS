import React from 'react';
import uuid from 'uuid';
import { renderFeatureDescription } from '../VehiclePage/PinCreator';

export const VIEWS = {
  interior: 'interior',
  exterior: 'exterior',
};

const renderPicture = hotspotData => {
  const picture = hotspotData.createTooltipArgs && hotspotData.createTooltipArgs.picture ? hotspotData.createTooltipArgs.picture : hotspotData.picture;
  return picture ? (
    <img
      src={picture}
      style={{
        height: 100,
        width: 140,
      }}
      alt="vehicle preview"
    />
  ) : (
    <p>No picture available</p>
  );
};

export const createInteriorTooltip = (hotSpotDiv, tooltipArgs, classes) => {
  const { type, title, description, picture } = tooltipArgs;
  const descriptionArr = description.split(',');
  const isDescriptionList = descriptionArr.length > 1;
  const h6 = document.createElement('h6');
  const desc = isDescriptionList ? document.createElement('ul') : document.createElement('p');
  const img = document.createElement('img');
  const wrapper = document.createElement('span');
  if (isDescriptionList) {
    descriptionArr.forEach(d => {
      const li = document.createElement('li');
      li.innerText = d;
      desc.appendChild(li);
    });
  } else {
    desc.innerHTML = description;
  }
  h6.innerText = title;

  if (picture) {
    img.src = picture;
    img.alt = title;
    img.classList.add(classes.hotSpotImage);
  }

  h6.classList.add(classes.hotSpotTitle);
  if (type === 'DAMAGE') {
    hotSpotDiv.classList.add(classes.hotSpotDamage);
  } else {
    hotSpotDiv.classList.add(classes.hotSpotFeature);
  }
  wrapper.classList.add(classes.hotSpotWrapper);
  wrapper.appendChild(h6);
  if (picture) {
    wrapper.appendChild(img);
  }
  wrapper.appendChild(desc);
  hotSpotDiv.appendChild(wrapper);
};

const exteriorTableColumns = [
  { title: 'Type', field: 'type' },
  {
    title: 'Layer',
    field: 'rowIndex',
    render: rowData => rowData.rowIndex + 1,
  },
  { title: 'Title', field: 'title' },
  {
    title: 'Picture',
    field: 'picture',
    render: rowData => renderPicture(rowData),
  },
  {
    title: 'Description',
    field: 'description',
    render: rowData => renderFeatureDescription(rowData.description),
  },
];
const interiorTableColumns = [
  { title: 'Type', field: 'createTooltipArgs.type' },
  { title: 'Title', field: 'createTooltipArgs.title' },
  {
    title: 'Picture',
    field: 'createTooltipArgs.picture',
    render: rowData => renderPicture(rowData),
  },
  {
    title: 'Description',
    field: 'createTooltipArgs.description',
    render: rowData => renderFeatureDescription(rowData.createTooltipArgs.description),
  },
];

export const getTableColums = view => (view === VIEWS.exterior ? exteriorTableColumns : interiorTableColumns);

export const generateInteriorHotspot = ({ pitch, yaw }, createTooltipArgs, classes) => ({
  pitch,
  yaw,
  id: createTooltipArgs.id || uuid(),
  sceneId: VIEWS.interior,
  cssClass: classes.hotSpot,
  createTooltipFunc: (hotspotDiv, args) => createInteriorTooltip(hotspotDiv, args, classes),
  createTooltipArgs,
});

export const interiorHotspotMapper = (hotspot, classes) => ({
  ...hotspot,
  sceneId: VIEWS.interior,
  cssClass: classes.hotSpot,
  createTooltipFunc: (hotspotDiv, args) => createInteriorTooltip(hotspotDiv, args, classes),
});
