export default {
  vencimentosCalibracoes() {
    return `
    select * from (
      select
        i.id,
        i.pessoa_id,
        i.ativo,
        MAX(c.data_calibracao) as ultima_calibracao,
        date_add(max(c.data_calibracao), interval i.tempo_calibracao month) as vencimento_calibracao,
        coalesce(datediff(date_add(max(c.data_calibracao), interval i.tempo_calibracao month), current_date),-999) as dias_vencer
      from 
        instrumentos as i
        left join instrumentos_calibracoes as c on (i.id = c.instrumento_id)
      group by
        i.id,
        i.pessoa_id,
        i.ativo,
        i.tempo_calibracao
    ) As T
    `
  }
}