import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import React, {useEffect} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getMomoAGentNumber} from '../redux/actions/wallet';

export default function MomoAgent({amount}) {
  const dispatch = useDispatch();
  const momo_agent = useSelector(state => state.wallet.momo_agent_number);
  const ussd = `${momo_agent.ussd}${
    momo_agent !== undefined ? momo_agent.phone_number : '070xxx'
  }*${amount}#`;

  useEffect(() => {
    dispatch(getMomoAGentNumber());
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(ussd);
    alert('Copied');
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/momo_logo.png')}
        style={styles.momoAgentLogo}
      />
      <Text style={styles.infoText}>
       {momo_agent !== undefined ? momo_agent.instruction : ''}
      </Text>
      <TouchableOpacity onPress={copyToClipboard}>
        <Text style={styles.ussdText}>{ussd}</Text>
      </TouchableOpacity>
      <Text style={styles.noteText}>Click the ussd to copy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  momoAgentLogo: {
    marginTop: hp('3.90'),
    width: '80%',
    height: hp('26.0'),
  },
  infoText: {
    marginTop: hp('2.5'),
    fontFamily: 'Poppins-Regular',
    fontSize: hp('2.5'),
    paddingHorizontal: 35,
  },
  ussdText: {
    marginTop: hp('5%'),
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp('2.5'),
    color: colors.primary,
  },
  noteText: {
    fontFamily: 'Poppins-Regular',
  },
});
