import {GoogleSpreadsheet} from 'google-spreadsheet';
import moment from 'moment';
import credentials from '../../credentials.json';

const targetSheetFile = new GoogleSpreadsheet('1JjT7MCKJWVGvSQRWa9IqOTRins3eIUnfowrnp0ZI46Y');

const genCupom = () => {
  const code = parseInt(moment().format('YYMMDDHHmmssSSS')).toString(16).toUpperCase();

  return code.substr(0, 4) + '-' + code.substr(4, 4) + '-' + code.substr(8, 4);
}

export default async(req, res) => {
  try {
    await targetSheetFile.useServiceAccountAuth(credentials);
    await targetSheetFile.loadInfo();
    const dataForm = JSON.parse(req.body);
    const searchSheet = targetSheetFile.sheetsByIndex[1];

    const sheetConfig = targetSheetFile.sheetsByIndex[2];
    await sheetConfig.loadCells('A3:B3');

    const showPromotionCell = sheetConfig.getCell(2, 0);
    const textCell = sheetConfig.getCell(2, 1);
    let Promo = '';
    let Cupom = '';

    if (showPromotionCell.value === 'VERDADEIRO') {
      Cupom = genCupom();
      Promo = textCell.value;
    }

    //headers - Nome	E-mail	WhatsApp	Cupom	Promo
    await searchSheet.addRow({
      Nome: dataForm.Nome,
      'E-mail': dataForm.Email,
      WhatsApp: dataForm.Whatsapp,
      Nota: parseInt(dataForm.Nota),
      Cupom,
      Promo,
      'Data preenchimento': moment().format('DD/MM/YYYY HH:mm:ss')
    });

    res.end(JSON.stringify({
      showCupom: Cupom !== '',
      Cupom,
      Promo
    }));
  } catch (error) {
    console.log(error);
    res.end('error');
  }
};