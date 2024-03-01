import React from 'react';
import LabeledTextField from 'views/RideShareCities/LabeledTextField';
import { FormHelperText } from '@material-ui/core';

export const SeoSection = ({ metaTitle, metaKeywords, metaDescription, h1, h2, h3, handleTextField }) => {
  return (
    <>
      <LabeledTextField title="Title (max 60 characters)" value={metaTitle} onChange={handleTextField('metaTitle')} maxLength={60} />
      <LabeledTextField
        title="Meta Keywords (max 255 characters)"
        value={metaKeywords}
        onChange={handleTextField('metaKeywords')}
        helperText={
          <FormHelperText>
            <strong>Separated by comma</strong>
          </FormHelperText>
        }
        maxLength={255}
      />
      <LabeledTextField title="Meta description (max 170 characters)" value={metaDescription} onChange={handleTextField('metaDescription')} maxLength={170} />
      <LabeledTextField title="H1 (max 80 characters)" value={h1} onChange={handleTextField('h1')} maxLength={80} />
      <LabeledTextField title="H2 (max 80 characters)" value={h2} onChange={handleTextField('h2')} maxLength={80} />
      <LabeledTextField title="H3 (max 80 characters)" value={h3} onChange={handleTextField('h3')} maxLength={80} />
    </>
  );
};
