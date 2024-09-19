import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AppConstant} from '../lib';
import Feather from 'react-native-vector-icons/Feather';

const initialRequirementState = [
  {
    checked: false,
    type: 'lowercase',
    text: 'at least one lowercase letter',
  },
  {
    checked: false,
    type: 'uppercase',
    text: 'at least one uppercase letter',
  },
  {
    checked: false,
    type: 'number',
    text: 'at least one number',
  },
  {
    checked: false,
    type: 'character',
    text: 'at least one special character',
  },
  {
    checked: false,
    type: 'minmax',
    text: 'at least 8 - 20 characters',
  },
];

export const PasswordRequirementCheck = ({password}) => {
  const [requirements, setRequirements] = useState(initialRequirementState);

  useEffect(() => {
    if (password) {
      /**
       * Lowercase check
       */
      if (
        password.match(AppConstant.VALIDATION_REGEX.PASSWORD_PARTS.LOWERCASE)
      ) {
        const updatedPasswordRequirements = requirements.map(item => {
          if (item.type === 'lowercase') {
            item.checked = true;
          }
          return item;
        });
        setRequirements(updatedPasswordRequirements);
      } else {
        const updatedPasswordRequirements = requirements.map(item => {
          if (item.type === 'lowercase') {
            item.checked = false;
          }
          return item;
        });
        setRequirements(updatedPasswordRequirements);
      }

      /**
       * Uppercase check
       */
      if (
        password.match(AppConstant.VALIDATION_REGEX.PASSWORD_PARTS.UPPERCASE)
      ) {
        const updatedPasswordRequirements = requirements.map(item => {
          if (item.type === 'uppercase') {
            item.checked = true;
          }
          return item;
        });
        setRequirements(updatedPasswordRequirements);
      } else {
        const updatedPasswordRequirements = requirements.map(item => {
          if (item.type === 'uppercase') {
            item.checked = false;
          }
          return item;
        });
        setRequirements(updatedPasswordRequirements);
      }

      /**
       * Number check
       */
      if (password.match(AppConstant.VALIDATION_REGEX.PASSWORD_PARTS.NUMBER)) {
        const updatedPasswordRequirements = requirements.map(item => {
          if (item.type === 'number') {
            item.checked = true;
          }
          return item;
        });
        setRequirements(updatedPasswordRequirements);
      } else {
        const updatedPasswordRequirements = requirements.map(item => {
          if (item.type === 'number') {
            item.checked = false;
          }
          return item;
        });
        setRequirements(updatedPasswordRequirements);
      }

      /**
       * Character check
       */
      if (
        AppConstant.VALIDATION_REGEX.PASSWORD_PARTS.SPECIAL_CHAR.test(password)
      ) {
        const updatedPasswordRequirements = requirements.map(item => {
          if (item.type === 'character') {
            item.checked = true;
          }
          return item;
        });
        setRequirements(updatedPasswordRequirements);
      } else {
        const updatedPasswordRequirements = requirements.map(item => {
          if (item.type === 'character') {
            item.checked = false;
          }
          return item;
        });
        setRequirements(updatedPasswordRequirements);
      }

      /**
       * Min Max check
       */
      if (AppConstant.VALIDATION_REGEX.PASSWORD_PARTS.MIN_MAX.test(password)) {
        const updatedPasswordRequirements = requirements.map(item => {
          if (item.type === 'minmax') {
            item.checked = true;
          }
          return item;
        });
        setRequirements(updatedPasswordRequirements);
      } else {
        const updatedPasswordRequirements = requirements.map(item => {
          if (item.type === 'minmax') {
            item.checked = false;
          }
          return item;
        });
        setRequirements(updatedPasswordRequirements);
      }
    } else {
      setRequirements(initialRequirementState);
    }
  }, [password]);

  if (!password) {
    return <></>;
  }

  return (
    <View style={styles.passwordRequirementListView}>
      {requirements.map((requirement, index) => (
        <View key={index} style={styles.passwordRequirementListItem}>
          <Feather
            name={'check'}
            size={20}
            color={requirement.checked ? 'blue' : 'gray'}
          />

          <Text style={styles.passwordRequirementListViewText}>
            {requirement.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    marginRight: 9,
  },
  passwordRequirementTitle: {
    fontSize: 14,
    color: 'red',
    letterSpacing: 0.8,
    marginBottom: 9.5,
    fontFamily: 'Poppins-Light',
  },
  passwordRequirementListView: {
    marginTop: 5,
  },
  passwordRequirementListItem: {
    marginBottom: 8,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordRequirementListViewText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#333333',
    fontFamily: 'Poppins-Regular',
    marginLeft: 10
  },
  unchecked: {
    marginRight: 29,
  },
});
