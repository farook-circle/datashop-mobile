import {useState} from 'react';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Platform} from 'react-native';
import {ReceiptTemplate} from '../lib';
import Share from 'react-native-share';
import {useSelector} from 'react-redux';

export const useReceipt = () => {
  const [status, setStatus] = useState(false);

  const whatsapp = useSelector(state => state.config.contact_info);

  const generateAndDownloadPDF = async receipt => {
    setStatus(true);

    try {
      const filename = `DATASHOP_${Date.now()}`;
      const options = {
        html: ReceiptTemplate({...receipt, whatsapp_number: whatsapp.number}),
        fileName: filename,
      };
      const {filePath} = await RNHTMLtoPDF.convert(options);

      const fullFilePath =
        Platform.OS === 'ios' ? filePath : 'file://' + filePath;
      setStatus(false);
      return fullFilePath;
    } catch (error) {
      setStatus(false);

      // handle error
    }

    setStatus(false);
  };

  return {
    status,
    generateAndDownloadPDF,
  };
};
