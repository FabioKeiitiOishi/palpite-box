import {GoogleSpreadsheet} from 'google-spreadsheet';
import {fromBase64} from '../../utils/base64';

const targetSheetFile = new GoogleSpreadsheet(process.env.SHEET_DOC_ID);

export default async(req, res) => {

  try {
    await targetSheetFile.useServiceAccountAuth({
      client_email: process.env.SHEET_CLIENT_EMAIL,
      private_key: fromBase64(process.env.SHEET_PRIVATE_KEY)
    });
    await targetSheetFile.loadInfo();
    
    const sheetConfig = targetSheetFile.sheetsByIndex[2];
    await sheetConfig.loadCells('A3:B3');
    
    const showPromotionCell = sheetConfig.getCell(2, 0);
    const textCell = sheetConfig.getCell(2, 1);
    
    res.end(JSON.stringify({
      showCoupon: showPromotionCell.value === 'VERDADEIRO',
      message: textCell.value
    }));
  } catch (error) {
    res.end(JSON.stringify({
      showCoupon: false,
      message: ''
    }));
  }
};