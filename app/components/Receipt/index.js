import React from 'react';
import {View, Text} from 'react-native';

import styles from './styles';

export const DisplayReceipt = ({receipt}) => {
  return (
    <View style={styles.receiptContainer}>
      <View style={styles.receiptContainerSummaryRow}>
        <Text style={styles.receiptContainerTotal}>Amount Paid</Text>
        <Text style={styles.receiptContainerTotalValue}>
          &#8358;{receipt.amount}
        </Text>
      </View>
      <View
        style={[styles.receiptContainerRow, styles.receiptContainerRowFirst]}>
        <Text style={styles.receiptContainerProperty}>Name</Text>
        <Text style={styles.receiptContainerValue}>{receipt.name}</Text>
      </View>
      <View style={styles.receiptContainerRow}>
        <Text style={styles.receiptContainerProperty}>Email Address</Text>
        <Text style={styles.receiptContainerValue}>{receipt.email}</Text>
      </View>
      <View style={styles.receiptContainerRow}>
        <Text style={styles.receiptContainerProperty}>RSA Pin</Text>
        <Text style={styles.receiptContainerValue}>{receipt.rsapin}</Text>
      </View>
      <View style={styles.receiptContainerRow}>
        <Text style={styles.receiptContainerProperty}>
          Pension Provider (PFA)
        </Text>
        <Text style={styles.receiptContainerValue}>{receipt.pfa}</Text>
      </View>
      <View style={styles.receiptContainerRow}>
        <Text style={styles.receiptContainerProperty}>Payment Type</Text>
        <Text style={styles.receiptContainerValue}>
          {receipt.recurringPayment ? 'Recurring' : 'Oneoff'}
        </Text>
      </View>
    </View>
  );
};
