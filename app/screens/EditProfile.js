/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  updateCollaboratorBank,
  updateCollaboratorWhatsapp,
} from '../redux/actions/collaborator';
import OverLayModel from '../components/OverLayModel';

export default function EditProfile({navigation}) {
  const dispatch = useDispatch();
  const [updateBank, setUpdateBank] = useState(false);
  const [updateWhatsapp, setUpdateWhatsapp] = useState(false);

  const isLoading = useSelector(
    state => state.collaborator.collaborator_loading,
  );

  const whatsapp = useSelector(
    state => state.collaborator.collaborator_whatsapp,
  );
  const bank = useSelector(state => state.collaborator.collaborator_bank);

  const [updatedBank, setUpdatedBank] = useState(bank);
  const [updatedWhatsapp, setUpdatedWhatsapp] = useState(whatsapp);

  // const collaborator_reference = useSelector(state => state.collaborator.collaborator_reference);

  useEffect(() => {}, []);

  const handleUpdateWhatsapp = () => {
    dispatch(updateCollaboratorWhatsapp({...updatedWhatsapp}));
    setUpdateWhatsapp(!updateWhatsapp);
  };

  const handleUpdateBank = () => {
    dispatch(updateCollaboratorBank({...updatedBank}));
    setUpdateBank(!updateBank);
  };

  return (
    <>
      {isLoading && (
        <OverLayModel>
          <ActivityIndicator size={'large'} color={colors.primary} />
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: hp(16),
              color: colors.textWhite,
            }}>
            Loading please wait...
          </Text>
        </OverLayModel>
      )}
      <KeyboardAwareScrollView style={styles.container}>
        <SafeAreaView>
          {/* Header */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather
                name="chevron-left"
                size={hp(35)}
                color={colors.textBlack}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitleText}>Edit Your Profile</Text>
            <Text>{'  '}</Text>
          </View>
          <View style={styles.headerUnderLine} />
        </SafeAreaView>

        <View
          style={{
            marginTop: hp(20),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.headerTitleText]}>Bank Account</Text>
          <TouchableOpacity />
        </View>
        <View style={styles.headerUnderLine} />
        <Text style={styles.textNote}>
          This is where you will receive your withdraw and also where your agent
          will manually send you deposit
        </Text>
        <View style={styles.informationWrapper}>
          <TouchableOpacity
            onPress={handleUpdateBank}
            style={styles.editButton}>
            <Text style={styles.editText}>
              {updateBank ? 'Update' : 'Edit'}
            </Text>
          </TouchableOpacity>
          {updateBank ? (
            <>
              <TextInput
                placeholder="Account Name"
                value={updateBank.name}
                style={styles.inputStyle}
                onChangeText={text =>
                  setUpdatedBank({...updatedBank, name: text})
                }
                autoFocus={true}
              />
              <TextInput
                placeholder="Bank"
                value={updateBank.bank}
                style={styles.inputStyle}
                onChangeText={text =>
                  setUpdatedBank({...updatedBank, bank: text})
                }
              />
              <TextInput
                placeholder="Account Number"
                value={updateBank.account_number}
                style={styles.inputStyle}
                onChangeText={text =>
                  setUpdatedBank({...updatedBank, account_number: text})
                }
              />
            </>
          ) : (
            <>
              <Text style={styles.labelText}>Account Name:</Text>
              <Text style={styles.valueText}>{bank.name}</Text>
              <Text style={styles.labelText}>Bank:</Text>
              <Text style={styles.valueText}>{bank.bank}</Text>
              <Text style={styles.labelText}>Account Number:</Text>
              <Text style={styles.valueText}>{bank.account_number}</Text>
            </>
          )}
        </View>

        {/* whatsapp */}
        <View
          style={{
            marginTop: hp(20),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.headerTitleText]}>Whatsapp</Text>
          <TouchableOpacity />
        </View>
        <View style={styles.headerUnderLine} />
        <Text style={styles.textNote}>
          This is how your agent will contact you
        </Text>
        <View style={styles.informationWrapper}>
          <TouchableOpacity
            onPress={handleUpdateWhatsapp}
            style={styles.editButton}>
            <Text style={styles.editText}>
              {updateWhatsapp ? 'Update' : 'Edit'}
            </Text>
          </TouchableOpacity>
          {updateWhatsapp ? (
            <>
              <TextInput
                placeholder="Whatsapp"
                value={updatedWhatsapp.whatsapp_number}
                keyboardType={'numeric'}
                onChangeText={text =>
                  setUpdatedWhatsapp({
                    ...updatedWhatsapp,
                    whatsapp_number: text,
                  })
                }
                autoFocus={true}
                style={styles.inputStyle}
              />
            </>
          ) : (
            <>
              <Text style={styles.labelText}>Whatsapp Number:</Text>
              <Text style={styles.valueText}>{whatsapp.whatsapp_number}</Text>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
    paddingHorizontal: 25,
  },
  headerWrapper: {
    marginTop: hp(3),
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
  },
  headerUnderLine: {
    marginTop: hp(10),
    height: hp(1),
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },

  textNote: {
    marginVertical: hp(10),
    fontFamily: 'Poppins-Regular',
    fontSize: hp(16),
  },
  informationWrapper: {
    padding: hp(20),
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.primary,
  },
  labelText: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(14),
  },
  valueText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textBlack,
  },
  editButton: {
    padding: hp(10),
    backgroundColor: colors.secondary,
    // width: 50,
    borderRadius: 50,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  editText: {
    fontFamily: 'Poppins-Regular',
    color: colors.textBlack,
  },
  inputStyle: {
    fontFamily: 'Poppins-Regular',
    backgroundColor: 'transparent',
    marginTop: hp(5),
    width: '80%',
    paddingHorizontal: wp(10),
  },
});
