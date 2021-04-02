import React from 'react';
import PropTypes from 'prop-types';

import {
  makeStyles,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
  Input,
  InputLabel,
  Box,
} from '@material-ui/core';

import { ToBase64 } from '../../util/functions';

const { v4: uuidv4 } = require('uuid');

const useStyles = makeStyles({
  root: {},
  boxMedia: {
    width: '100%',
    height: 140,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxWidth: '100%',
    maxHeight: 140,
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    justifyItems: 'flex-end',
  },
  input: {
    display: 'none',
  },
});

function CardUploadMedia({ title, image, setValue }) {
  const classes = useStyles();
  const uuid = uuidv4();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Typography variant="subtitle2">{title}</Typography>
        </CardContent>
        <Box className={classes.boxMedia}>
          {image ? (
            <img className={classes.image} src={image} alt={title} />
          ) : (
            'Nenhuma imagem selecionada'
          )}
        </Box>
      </CardActionArea>
      <CardActions className={classes.buttons}>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            setValue(null);
          }}
          component="span"
          disabled={!image}
        >
          Remover
        </Button>
        <InputLabel htmlFor={uuid}>
          <Input
            id={uuid}
            name={uuid}
            type="file"
            className={classes.input}
            onChange={async (evt) => {
              if (evt.target.files.length > 0) {
                const imgbase64 = await ToBase64(evt.target.files[0]);
                setValue(imgbase64);
              }
            }}
          />
          <Button size="small" color="primary" component="span">
            Nova Imagem
          </Button>
        </InputLabel>
      </CardActions>
    </Card>
  );
}

CardUploadMedia.prototypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};

CardUploadMedia.defaultProps = {
  image: null,
};

export default CardUploadMedia;
