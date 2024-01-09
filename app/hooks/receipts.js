import {useState} from 'react';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Platform} from 'react-native';
import {ReceiptTemplate} from '../lib';
import Share from 'react-native-share';

export const useReceipt = () => {
  const [status, setStatus] = useState(false);

  const generateAndDownloadPDF = async receipt => {
    setStatus(true);
    try {
      const filename = `DATASHOP_${Date.now()}`;
      const options = {
        html: ReceiptTemplate(receipt),
        fileName: filename,
      };
      const {filePath} = await RNHTMLtoPDF.convert(options);

      const fullFilePath =
        Platform.OS === 'ios' ? filePath : 'file://' + filePath;

      const shareOptions = {
        title: 'Share via',
        message: `Share ${filename}`,
        url: fullFilePath,
      };

      await Share.open(shareOptions);
    } catch (error) {
      setStatus(false);
      console.log(error);
      // handle error
    }

    setStatus(false);
  };

  return {
    status,
    generateAndDownloadPDF,
  };
};
