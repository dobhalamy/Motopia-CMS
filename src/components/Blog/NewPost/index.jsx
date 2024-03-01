import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import createStyles from 'draft-js-custom-styles';
import { stateToHTML } from 'draft-js-export-html';
import { useToasts } from 'react-toast-notifications';

import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import createToolbarPlugin, { Separator } from '@draft-js-plugins/static-toolbar';
import createImagePlugin from '@draft-js-plugins/image';
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createTextAlignmentPlugin from '@draft-js-plugins/text-alignment';
import createLinkPlugin from '@draft-js-plugins/anchor';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons';

import ImageAdd from './ImageAdd';
import GridItem from 'components/Grid/GridItem';
import { Button, MenuItem, Select, TextField, Grid, Typography, Switch } from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { BlogPosts } from 'client';
import ColorPicker from './ColorPicker';

import editorStyles from './editorStyles.module.css';
import buttonStyles from './buttonStyles.module.css';
import toolbarStyles from './toolbarStyles.module.css';
import linkStyles from './linkStyles.module.css';
import blockTypeSelectStyles from './blockTypeSelectStyles.module.css';

import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/focus/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/alignment/lib/plugin.css';
import '@draft-js-plugins/text-alignment/lib/plugin.css';
import '@draft-js-plugins/anchor/lib/plugin.css';
import { MediaLibraryDialog } from '../../Cloudinary/MediaLibraryDialog';
import CloudinaryUploadWidget from 'components/Cloudinary/UploadWidget';

const filter = createFilterOptions();

const HeadlinesPicker = props => {
  const onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    props.onOverrideContent(undefined);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.addEventListener('click', onWindowClick);
    });

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      window.removeEventListener('click', onWindowClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
  return (
    <div>
      {buttons.map((
        Button,
        i // eslint-disable-next-line
      ) => (
        // eslint-disable-next-line react/no-array-index-key
        <Button key={i} {...props} />
      ))}
    </div>
  );
};

const HeadlinesButton = ({ onOverrideContent }) => {
  const onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    onOverrideContent(HeadlinesPicker);

  return (
    <div className={buttonStyles.buttonWrapper}>
      <button onClick={onClick} className={buttonStyles.button}>
        H
      </button>
    </div>
  );
};

const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color', 'text-align', 'font-weight', 'float', 'position']);
const FONT_SIZES = ['12px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '34px', '36px', '50px', '72px'];

const NewPost = () => {
  const { addToast } = useToasts();
  const history = useHistory();
  const { location } = history;
  const [isEditMode, setEditMode] = useState(false);
  const [plugins, Toolbar, AlignmentTool, addImage, TextAlignment, LinkButton] = useMemo(() => {
    const toolbarPlugin = createToolbarPlugin({ theme: { buttonStyles, toolbarStyles } });
    const focusPlugin = createFocusPlugin();
    const resizeablePlugin = createResizeablePlugin();
    const blockDndPlugin = createBlockDndPlugin();
    const alignmentPlugin = createAlignmentPlugin();
    const textAlignmentPlugin = createTextAlignmentPlugin();
    const linkPlugin = createLinkPlugin({
      theme: linkStyles,
      placeholder: 'https://…',
      linkTarget: '_blank',
    });

    const decorator = composeDecorators(resizeablePlugin.decorator, alignmentPlugin.decorator, focusPlugin.decorator);
    const imagePlugin = createImagePlugin({ decorator });
    return [
      [toolbarPlugin, blockDndPlugin, focusPlugin, alignmentPlugin, resizeablePlugin, imagePlugin, textAlignmentPlugin, linkPlugin],
      toolbarPlugin.Toolbar,
      alignmentPlugin.AlignmentTool,
      imagePlugin.addImage,
      textAlignmentPlugin.TextAlignment,
      linkPlugin.LinkButton,
    ];
  }, []);
  const editor = useRef();
  const galleryRef = useRef();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [form, setForm] = useState({
    category: '',
    html: '',
    isActive: null,
    metaDescription: '',
    metaKeywords: '',
    metaTitle: '',
    seoTags: {
      h1: '',
      h2: '',
      h3: '',
    },
    title: '',
    url: '',
    metaCanonical: '',
    callToActionLink: '',
    callToActionText: '',
    previewDescription: '',
  });
  const [formErrors, setFormErrors] = useState([]);
  const [selectedFontSize, setFontSize] = useState('16px');
  const onChange = state => {
    setEditorState(state);
  };

  const focus = () => {
    editor.current.focus();
  };

  useEffect(() => {
    if (editorState) {
      const inlineStyles = exporter(editorState);
      setForm({
        ...form,
        html: stateToHTML(editorState.getCurrentContent(), {
          inlineStyles,
          inlineStyleFn: styles => {
            const divElement = { style: { display: 'inline-block', width: '100%' } };
            const textAlignKeys = ['center', 'right'];
            const textAlign = styles.filter(value => textAlignKeys.includes(value)).first();

            if (textAlign) {
              divElement.style.textAlign = textAlign;
              return divElement;
            }
          },
          entityStyleFn: entity => {
            const entityType = entity.get('type').toLowerCase();

            if (entityType === 'link') {
              const data = entity.getData();
              return {
                element: 'a',
                attributes: {
                  target: '_blank',
                  href: data.url,
                },
                style: {
                  color: '#001C5E',
                  textDecoration: 'underline',
                },
              };
            }

            if (entityType === 'image') {
              const data = entity.getData();
              const style = {
                position: 'relative',
                cursor: 'default',
                display: 'block',
                width: `${data.width}%`,
                height: 'auto',
                minWidth: '200px',
              };
              switch (data.alignment) {
                case 'left':
                case 'right':
                  style.float = data.alignment;
                  style.padding = '0px 5px';
                  break;

                case 'center':
                  style.margin = 'auto';
                  break;

                default:
                  break;
              }
              return {
                element: 'img',
                attributes: {
                  src: data.src,
                  alt: 'blog-image',
                },
                style,
              };
            }
          },
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  useEffect(() => {
    if (location.state && location.state._id) {
      setEditMode(true);
      setForm({
        category: location.state.category || '',
        html: location.state.html || '',
        isActive: location.state.isActive,
        metaDescription: location.state.metaDescription || '',
        metaKeywords: location.state.metaKeywords || '',
        metaTitle: location.state.metaTitle || '',
        seoTags: {
          h1: location.state?.seoTags?.h1 || '',
          h2: location.state?.seoTags?.h2 || '',
          h3: location.state?.seoTags?.h3 || '',
        },
        title: location.state.title || '',
        url: location.state.url || '',
        metaCanonical: location.state.metaCanonical || '',
        callToActionLink: location.state.callToActionLink || '',
        callToActionText: location.state.callToActionText || '',
        previewDescription: location.state.previewDescription || '',
      });

      if (location.state.content) {
        setEditorState(EditorState.createWithContent(convertFromRaw({ entityMap: {}, ...location.state.content })));
      }
    }

    return () => {
      setEditMode(false);
    };
  }, [location.state]);

  const toggleColor = color => {
    const newEditorState = styles.color.toggle(editorState, color);
    return onChange(newEditorState);
  };

  const toggleFontSize = fontSize => {
    const newEditorState = styles.fontSize.toggle(editorState, fontSize);
    setFontSize(fontSize);
    return onChange(newEditorState);
  };

  const fontSizeOptions = x =>
    x.map(fontSize => (
      <MenuItem key={fontSize} value={fontSize}>
        {fontSize}
      </MenuItem>
    ));

  const handleChangeInput = ({ target: { name, value, checked } }) => {
    const basePath = '/blog';
    let categoryPath = '';
    let postPath = '';
    let link = '';
    const linkArray = [basePath];
    switch (name) {
      case 'h1':
        setForm({
          ...form,
          seoTags: {
            ...form.seoTags,
            [name]: value,
          },
        });
        break;
      case 'h2':
        setForm({
          ...form,
          seoTags: {
            ...form.seoTags,
            [name]: value,
          },
        });
        break;
      case 'h3':
        setForm({
          ...form,
          seoTags: {
            ...form.seoTags,
            [name]: value,
          },
        });
        break;
      case 'isActive':
        setForm({ ...form, [name]: checked });
        break;

      case 'title':
        categoryPath =
          form.category
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll(/([.,*+?^=!:${}()|[\]/\\])/g, '') || '';
        postPath = value
          .toLowerCase()
          .replaceAll(' ', '-')
          .replaceAll(/([.,*+?^=!:${}()|[\]/\\])/g, '');
        if (categoryPath) {
          linkArray.push(categoryPath);
        }
        linkArray.push(postPath);
        link = linkArray.join('/');
        setForm({ ...form, url: link, [name]: value });
        break;

      case 'category':
        if (!value) return;
        categoryPath = value
          .toLowerCase()
          .replaceAll(' ', '-')
          .replaceAll(/([.,*+?^=!:${}()|[\]/\\])/g, '');
        postPath =
          form.title
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll(/([.,*+?^=!:${}()|[\]/\\])/g, '') || '';
        linkArray.push(categoryPath);
        if (postPath) {
          linkArray.push(postPath);
        }
        link = linkArray.join('/');
        setForm({ ...form, url: link, [name]: value });
        break;

      default:
        setForm({ ...form, [name]: value });
        break;
    }
  };

  const autoCompleteFilterOptions = (options, params) => {
    const filtered = filter(options, params);

    // Suggest the creation of a new value
    if (params.inputValue !== '') {
      filtered.push(params.inputValue);
    }

    return filtered;
  };

  const handleSave = async () => {
    if (formErrors.length > 0) {
      return;
    }
    const content = editorState.getCurrentContent();
    const data = { ...form, html: form.html, content: convertToRaw(content) };

    try {
      if (isEditMode) {
        data._id = location.state._id;
        await BlogPosts.updateBlogPost(data);
        addToast('The post was successfully updated');
      } else {
        await BlogPosts.addBlogPost(data);
        addToast('The post was successfully created');
      }
    } catch (error) {
      addToast(error.status || error.message, { severity: 'error' });
    }
    history.push('/admin/blog');
  };

  const checkInputFilled = ({ target: { name, value } }) => {
    if (!value) {
      setFormErrors([...formErrors, name]);
    } else {
      setFormErrors(formErrors.filter(fieldName => fieldName !== name));
    }
  };

  const isFieldHaveError = fieldName => formErrors.includes(fieldName);

  const openMediaLibrary = () => {
    galleryRef && galleryRef.current && galleryRef.current.show();
  };

  return (
    <>
      <Grid container justifyContent="space-between" style={{ marginBottom: 10, padding: '0 15px' }}>
        <Grid item xs={12} sm={5}>
          <MediaLibraryDialog galleryRef={galleryRef} handleOpenGallery={openMediaLibrary} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <CloudinaryUploadWidget preset="blog" onUpload={openMediaLibrary} />
        </Grid>
      </Grid>
      <Grid container style={{ marginBottom: 10, padding: 0 }}>
        <GridItem xs={4}>
          <TextField
            required
            error={isFieldHaveError('title')}
            label="Title"
            fullWidth
            name="title"
            value={form.title}
            onChange={handleChangeInput}
            onBlurCapture={checkInputFilled}
            variant="outlined"
            margin="dense"
            helperText={isFieldHaveError('title') && 'Title is required'}
          />
        </GridItem>
        <GridItem xs={4}>
          <Autocomplete
            id="category"
            name="category"
            options={location.state.categories}
            value={form.category}
            autoHighlight
            autoComplete
            freeSolo
            onChange={(e, value) => handleChangeInput({ target: { name: 'category', value } })}
            blurOnSelect
            filterOptions={autoCompleteFilterOptions}
            renderInput={params => (
              <TextField
                margin="dense"
                required
                error={isFieldHaveError('category')}
                helperText={isFieldHaveError('category') && 'Category is required'}
                label="Category"
                name="category"
                value={form.category}
                variant="outlined"
                onBlurCapture={checkInputFilled}
                {...params}
              />
            )}
          />
        </GridItem>
        <GridItem xs={4}>
          <TextField margin="dense" label="URL" disabled placeholder="blog/[category]/[post]" fullWidth name="url" value={form.url} onChange={handleChangeInput} variant="outlined" />
        </GridItem>
      </Grid>

      <Grid container style={{ marginBottom: 10, padding: 0 }}>
        <GridItem xs={4}>
          <TextField
            margin="dense"
            required
            error={isFieldHaveError('metaTitle')}
            helperText={isFieldHaveError('metaTitle') && 'Meta Title is required'}
            label="Meta Title"
            fullWidth
            name="metaTitle"
            value={form.metaTitle}
            onChange={handleChangeInput}
            onBlurCapture={checkInputFilled}
            variant="outlined"
          />
        </GridItem>
        <GridItem xs={4}>
          <TextField
            margin="dense"
            required
            error={isFieldHaveError('metaDescription')}
            helperText={isFieldHaveError('metaDescription') && 'Meta Description is required'}
            label="Meta Description"
            fullWidth
            name="metaDescription"
            value={form.metaDescription}
            onChange={handleChangeInput}
            onBlurCapture={checkInputFilled}
            variant="outlined"
          />
        </GridItem>
        <GridItem xs={4}>
          <TextField
            margin="dense"
            required
            error={isFieldHaveError('metaKeywords')}
            helperText={isFieldHaveError('metaKeywords') && 'Meta Keywords is required'}
            label="Meta Keywords"
            fullWidth
            name="metaKeywords"
            value={form.metaKeywords}
            onChange={handleChangeInput}
            onBlurCapture={checkInputFilled}
            variant="outlined"
          />
        </GridItem>
      </Grid>
      <Grid container style={{ marginBottom: 10, padding: 0 }}>
        <GridItem xs={4}>
          <TextField
            margin="dense"
            error={isFieldHaveError('h1')}
            helperText={isFieldHaveError('h1') && 'H1 tag is required'}
            label="H1"
            fullWidth
            name="h1"
            value={form.seoTags.h1}
            onChange={handleChangeInput}
            onBlurCapture={checkInputFilled}
            variant="outlined"
          />
        </GridItem>
        <GridItem xs={4}>
          <TextField
            margin="dense"
            error={isFieldHaveError('h2')}
            helperText={isFieldHaveError('h2') && 'H2 tag Description is required'}
            label="H2"
            fullWidth
            name="h2"
            value={form.seoTags.h2}
            onChange={handleChangeInput}
            onBlurCapture={checkInputFilled}
            variant="outlined"
          />
        </GridItem>
        <GridItem xs={4}>
          <TextField
            margin="dense"
            error={isFieldHaveError('h3')}
            helperText={isFieldHaveError('h3') && 'H3 tag is required'}
            label="H3"
            fullWidth
            name="h3"
            value={form.seoTags.h3}
            onChange={handleChangeInput}
            onBlurCapture={checkInputFilled}
            variant="outlined"
          />
        </GridItem>
      </Grid>

      <Grid container style={{ marginBottom: 10, padding: 0 }}>
        <GridItem xs={4}>
          <TextField margin="dense" label="Meta Canonical" fullWidth name="metaCanonical" value={form.metaCanonical} onChange={handleChangeInput} variant="outlined" />
        </GridItem>
        <GridItem xs={4}>
          <TextField
            margin="dense"
            label="Call to action URL"
            fullWidth
            name="callToActionLink"
            value={form.callToActionLink}
            onChange={handleChangeInput}
            variant="outlined"
            placeholder="/search-cars"
          />
        </GridItem>
        <GridItem xs={4}>
          <TextField
            margin="dense"
            label="Call to action text"
            fullWidth
            name="callToActionText"
            value={form.callToActionText}
            onChange={handleChangeInput}
            variant="outlined"
            placeholder="Go and Find"
          />
        </GridItem>
      </Grid>

      <Grid container style={{ marginBottom: 10, padding: 0 }}>
        <GridItem xs={12}>
          <TextField
            margin="dense"
            label="Preview description"
            fullWidth
            multiline
            name="previewDescription"
            value={form.previewDescription}
            onChange={handleChangeInput}
            variant="outlined"
            placeholder="This text will be displayed in a Post card on the search page"
          />
        </GridItem>
      </Grid>

      <Grid container style={{ padding: 0 }}>
        <GridItem xs={12}>
          <Toolbar>
            {externalProps => (
              <>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <LinkButton {...externalProps} />
                <Separator {...externalProps} />
                <HeadlinesButton {...externalProps} />
                <Select value={selectedFontSize} className={blockTypeSelectStyles.blockType} onChange={e => toggleFontSize(e.target.value)}>
                  {fontSizeOptions(FONT_SIZES)}
                </Select>
                <ColorPicker toggleColor={toggleColor} />
                <Separator {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
                <Separator {...externalProps} />
                <TextAlignment {...externalProps} />
                <Separator {...externalProps} />
                <ImageAdd editorState={editorState} onChange={onChange} modifier={addImage} />
              </>
            )}
          </Toolbar>
          <div className={editorStyles.editor} onClick={focus}>
            <Editor
              editorKey="editor"
              editorState={editorState}
              onChange={onChange}
              plugins={plugins}
              ref={element => {
                editor.current = element;
              }}
              customStyleFn={customStyleFn}
            />
            <AlignmentTool />
          </div>
        </GridItem>
        <GridItem container justifyContent="space-between">
          <Typography>Do you want to show this post on the website?</Typography>
          <Switch name="isActive" checked={form.isActive} onChange={handleChangeInput} color="primary" />
        </GridItem>
        <GridItem xs={12}>
          <Button fullWidth onClick={handleSave} variant="contained" color="primary" disabled={!!formErrors.length}>
            {isEditMode ? 'Update' : 'Save'} Blog Post
          </Button>
        </GridItem>
      </Grid>
    </>
  );
};

export default NewPost;
