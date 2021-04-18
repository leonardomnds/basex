import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import fileDownload from "js-file-download";

import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  DialogActions,
} from '@material-ui/core';
import DownloadIcon from '@material-ui/icons/CloudDownloadRounded';

import Checkbox from '../FormControl/Checkbox';
import api from '../../util/Api';
import { NomeRelatorio } from '../../reports/nomesRelatorios';
import CustomButton from '../CustomButton';
import { format } from 'date-fns';

const { v4: uuidv4 } = require('uuid');

const useStyles = makeStyles((theme) => ({
  themeError: {
    color: theme.palette.background.paper,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
  },
  btn: {
    minWidth: 160,
  },
}));

type Props = {
  isOpen: boolean,
  relatorio: NomeRelatorio,
  onClose: () => void,
  filter: string
}

function ExportarCSV(props: Props) {
  const classes = useStyles();
  const { addToast } = useToasts();

  const { isOpen, relatorio, onClose, filter } = props;

  const [isLoading, setLoading] = useState<boolean>(false);
  
  const [items, setItems] = useState<{
    id: string,
    checked: boolean,
    tabela: string,
    coluna: string
  }[]>([]);

  const handleCheckbox = (id: string) => {    
    let newItem;
    const newItems = [];

    items.map((item) => {
      newItem = item;
      if (newItem.id === id) newItem.checked = !newItem.checked;
      newItems.push(newItem);
    });

    setItems(newItems);
  }

  const getCsvData = async () => {
    setLoading(true);
    const dados = [];
    try {

      const bodyData = [];

      items.filter((i) => i.checked).map((i) => {
        bodyData.push({ tabela: i.tabela, coluna: i.coluna });
      });

      if (bodyData.length <= 0) {
        addToast("Nenhuma coluna foi selecionada!", { appearance: 'warning' });
        setLoading(false);
        return;
      }

      const response = await api.post(`/utils/exportar-csv?ref=${(relatorio || 0)}&filter=${filter}`, bodyData);

      if (response?.status === 200) {
        fileDownload(response.data, `Relatorio-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.csv`);
        onClose();
      } else if (response?.status === 403) {
        addToast(response.data.error, { appearance: 'warning' });
      } else {
        throw new Error(response.data.error)
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
    setLoading(false);
  }

  useEffect(() => {
    const getData = async () => {
      const dados = [];
      try {
        const response = await api.get('/utils/campos-exportar?ref='+(relatorio || 0));

        if (!response?.data?.error) {
          response.data.forEach((i) => {
            dados.push({
              id: uuidv4(),
              checked: true,
              tabela: i.tabela,
              coluna: i.coluna
            });
          });
        } else {
          throw new Error(response.data.error)
        }
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
      setItems(dados);
    }

    getData();    
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Selecione as colunas</DialogTitle>
      <DialogContent>
        <List>
          {items.map((value) => {
            return (
              <ListItem key={uuidv4()} dense button onClick={() => handleCheckbox(value.id)}>
                <ListItemIcon>
                  <Checkbox
                    checked={value.checked}
                    label=""
                    onChange={() => {}}
                  />
                </ListItemIcon>
                <ListItemText id={uuidv4()} primary={`${value.tabela}.${value.coluna}`} />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <CustomButton
          className={classes.btn}
          label={isLoading ? "Exportando" : "Exportar"}
          icon={<DownloadIcon/>}
          color='primary'
          isLoading={isLoading}
          func={() => getCsvData()}
        />
      </DialogActions>
    </Dialog>
  );
}

export default ExportarCSV;
