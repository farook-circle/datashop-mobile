import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors/colors';

export default StyleSheet.create({
  receiptContainer: {
    marginBottom: 20,
  },
  receiptContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 16,
  },
  receiptContainerRowFirst: {
    borderTopWidth: 1,
    borderColor: 'gray',
  },
  receiptContainerSummaryRow: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 24,
  },
  receiptContainerProperty: {
    flexDirection: 'row',
    textAlign: 'left',
    color: '#888888',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 15,
  },
  receiptContainerValue: {
    textAlign: 'right',
    flexDirection: 'row',
    color: '#636363',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    lineHeight: 18,
  },
  receiptContainerTotal: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Poppins-Semibold',
    color: '#888888',
  },
  receiptContainerTotalValue: {
    fontSize: 40,
    lineHeight: 48,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
});
