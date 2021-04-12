import React from 'react';

import DateFnsUtils from "@date-io/date-fns";
import ptBrLocale from "date-fns/locale/pt-BR";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

const { v4: uuidv4 } = require('uuid');

type Props = {
  label: string,
  disabled?: boolean,
  value: Date,
  minValue?: Date,
  maxValue?: Date,
  setValue?: (v: Date) => void,
  variant?: 'inline' | 'dialog'
}

function CustomTextField({
  label,
  disabled,
  value,
  minValue,
  maxValue,
  setValue = (v: Date) => {},
  variant = 'inline'
}: Props) {
  const uuid = uuidv4();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBrLocale}>
      <KeyboardDatePicker
        id={uuid}
        label={label}
        format="dd/MM/yyyy"
        disabled={disabled}
        variant={variant}
        value={value}
        onChange={setValue}
        fullWidth
        autoOk={variant === 'inline'}
        minDate={minValue || new Date(1900,1,1)}
        maxDate={maxValue || new Date(2100,1,1)}
        invalidDateMessage="Data inválida"
        minDateMessage="Data anterior à mínima permitida"
        maxDateMessage="Data posterior à máxima permitida"
      />
    </MuiPickersUtilsProvider>
  );
}

export default CustomTextField;
