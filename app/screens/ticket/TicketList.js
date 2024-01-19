import React, {useCallback, useEffect, useRef, useState} from 'react';
import {MainLayout} from '../../components';
import {
  Button,
  Box,
  HStack,
  Avatar,
  VStack,
  Badge,
  Pressable,
  Text,
  Actionsheet,
  FormControl,
  Input,
  FlatList,
  Image,
  Spinner,
} from 'native-base';
import {AppConstant, ROUTES, Storage, pickImage} from '../../lib';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Alert, RefreshControl, TouchableOpacity} from 'react-native';
import {createTickets, getTickets} from '../../api';
import moment from 'moment-timezone';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useIsFocused} from '@react-navigation/native';
import {formatMessageTime} from '../../utils/formatter';

const createTicketValidation = yup.object().shape({
  title: yup.string().required('Please provide ticket title'),
  descriptions: yup.string().required('Please provide ticket descriptions'),
});

const TicketBadge = ({status}) => {
  if (status === true) {
    return (
      <Badge
        _text={{color: 'white', fontSize: '10'}}
        rounded={'full'}
        bgColor={'primary.500'}>
        New
      </Badge>
    );
  } else {
    return <></>;
  }
};

export const TicketListScreen = ({navigation, route}) => {
  const formRef = useRef();

  const [toggleTicket, setToggleTicket] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [filtered, setFiltered] = useState('active');

  const [lastViewTicket, setLastViewTicket] = useState([]);

  const [userClosedTicket, setUserClosedTicket] = useState([]);
  const [userActiveTicket, setUserActiveTicket] = useState([]);

  const [createTicketLoading, setCreateTicketLoading] = useState(false);

  const isFocused = useIsFocused();

  const handleNavigateTicket = ticket => {
    const filteredViewTicket = lastViewTicket.filter(
      item => item.id !== ticket.id,
    );

    const newViewTicket = [
      ...filteredViewTicket,
      {id: ticket.id, last_message: ticket.last_message},
    ];

    setLastViewTicket(newViewTicket);
    // save it on local storage
    Storage.save(
      AppConstant.STORAGE_KEYS.TICKET_LIST_VIEW,
      JSON.stringify(newViewTicket),
    );

    navigation.navigate(ROUTES.TICKET_MESSAGE_SCREEN, {ticket});
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUserTickets();
    setRefreshing(false);
  }, [getUserTickets]);

  const getUserTickets = useCallback(async () => {
    const request = await getTickets();
    if (request.ok) {
      createFilterTicket(request.data);
    }
  }, []);

  const createFilterTicket = data => {
    let activeTicket = [];
    let closedTicket = [];

    data.forEach(item => {
      if (item.is_closed) {
        closedTicket = [...closedTicket, item];
      } else {
        activeTicket = [...activeTicket, item];
      }

      setTickets(data);
    });

    setUserActiveTicket(activeTicket);
    setUserClosedTicket(closedTicket);
  };

  const handleInitiateUserTicket = useCallback(async () => {
    setLoading(true);
    await getUserTickets();
    setLoading(false);
  }, [getUserTickets]);

  useEffect(() => {
    if (isFocused) {
      handleInitiateUserTicket();
    }
  }, [handleInitiateUserTicket, isFocused]);

  const handleCreateTicket = async payload => {
    setCreateTicketLoading(true);

    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('descriptions', payload.descriptions);
    if (attachment) {
      formData.append('attachment', {
        name: attachment.fileName,
        type: attachment.type,
        uri: attachment.uri,
      });
    }

    const request = await createTickets(formData);

    if (request.ok) {
      setTickets([request.data, ...tickets]);
      setCreateTicketLoading(false);
      formRef.current.resetForm();
      setToggleTicket(false);

      return;
    }

    setCreateTicketLoading(false);
    Alert.alert(
      'Error ',
      request.data?.message ||
        'Unable to create your ticket at the moment please try again',
    );
  };

  const handleAddAttachment = async () => {
    const image = await pickImage();
    if (image) {
      setAttachment(image);
    }
  };

  const handleTicketStatus = (ticketId, lastMessage) => {
    const lastViewTicketItem = lastViewTicket.find(
      item => item.id === ticketId,
    );

    if (lastViewTicketItem && lastViewTicketItem.last_message === lastMessage) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (filtered === 'active') {
      setFilteredTickets(userActiveTicket);
    } else {
      setFilteredTickets(userClosedTicket);
    }
  }, [filtered, userActiveTicket, userClosedTicket, tickets.length]);

  useEffect(() => {
    handleGetSavedTicketList();
  }, [isFocused]);

  const handleGetSavedTicketList = async () => {
    const savedTicketList = await Storage.get(
      AppConstant.STORAGE_KEYS.TICKET_LIST_VIEW,
    );

    if (savedTicketList) {
      setLastViewTicket(JSON.parse(savedTicketList));
    }
  };

  return (
    <MainLayout headerTitle={'Your tickets'} showHeader={true}>
      {loading ? (
        <Box flex={'1'} justifyContent={'center'} alignItems={'center'}>
          <Spinner />
        </Box>
      ) : (
        <>
          <Box flex={1}>
            {tickets.length < 1 ? (
              <Text textAlign={'center'} mt={'20'}>
                You don't have any tickets.
              </Text>
            ) : (
              <>
                <HStack px={'4'} space={'2'} py={'3'} pb={'4'}>
                  <Button
                    onPress={() => setFiltered('active')}
                    borderBottomWidth={filtered === 'active' ? '2' : '0'}
                    _text={{
                      color: filtered === 'active' ? 'primary.500' : 'black',
                    }}
                    borderBottomColor={'primary.500'}
                    flex={1}
                    variant={'ghost'}>
                    Active
                  </Button>
                  <Button
                    onPress={() => setFiltered('closed')}
                    borderBottomColor={'primary.500'}
                    _text={{
                      color: filtered === 'closed' ? 'primary.500' : 'black',
                    }}
                    borderBottomWidth={filtered === 'closed' ? '2' : '0'}
                    variant={'ghost'}
                    flex={1}>
                    Closed
                  </Button>
                </HStack>
                <FlatList
                  data={filteredTickets}
                  keyExtractor={(item, index) => index.toString()}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  renderItem={({item, index}) => (
                    <Pressable onPress={() => handleNavigateTicket(item)}>
                      {({isPressed}) => (
                        <HStack
                          borderBottomWidth={1}
                          borderBottomColor={'gray.200'}
                          py={'2'}
                          bgColor={isPressed ? 'primary.100' : 'white'}
                          space={2}
                          px={'4'}
                          alignItems={'center'}>
                          <Avatar bgColor={'primary.100'} size={'lg'}>
                            <Avatar bgColor={'primary.500'} size={'md'}>
                              <Fontisto
                                name={'ticket-alt'}
                                size={20}
                                color={'white'}
                              />
                            </Avatar>
                          </Avatar>
                          <VStack flex={1}>
                            <Text
                              numberOfLines={1}
                              fontSize={'md'}
                              fontWeight={'semibold'}>
                              {item?.title}
                            </Text>
                            <Text numberOfLines={1}>
                              {item?.last_message
                                ? item?.last_message
                                : item?.descriptions}
                            </Text>
                          </VStack>
                          <VStack alignItems={'flex-end'}>
                            <Text>{formatMessageTime(item.updated_at)}</Text>
                            {item.is_closed ? (
                              <Badge
                                _text={{color: 'white', fontSize: '10'}}
                                rounded={'full'}
                                bgColor={'red.500'}>
                                Closed
                              </Badge>
                            ) : (
                              <TicketBadge
                                status={handleTicketStatus(
                                  item.id,
                                  item.last_message,
                                )}
                              />
                            )}
                          </VStack>
                        </HStack>
                      )}
                    </Pressable>
                  )}
                />
              </>
            )}
          </Box>
          <Box px={'4'} pb={'2'} pt={'3'}>
            <Button
              size={'lg'}
              py={'3'}
              onPress={() => setToggleTicket(!toggleTicket)}>
              Create new Ticket
            </Button>
          </Box>
          <Actionsheet
            isOpen={toggleTicket}
            onClose={() => setToggleTicket(!toggleTicket)}>
            <Actionsheet.Content>
              <Formik
                innerRef={formRef}
                initialValues={{
                  title: '',
                  descriptions: '',
                }}
                validationSchema={createTicketValidation}
                onSubmit={data => handleCreateTicket(data)}>
                {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                }) => (
                  <Box
                    height={'500px'}
                    width={'100%'}
                    bgColor={'white'}
                    px={'2'}>
                    <VStack space={'2'} pb={'4'}>
                      <FormControl isInvalid={touched.title && errors.title}>
                        <FormControl.Label>Subject</FormControl.Label>
                        <Input
                          isDisabled={createTicketLoading}
                          value={values.title}
                          onChangeText={handleChange('title')}
                          onBlur={handleBlur('title')}
                          placeholder={'Subject'}
                          size={'lg'}
                          py={'3'}
                        />
                        <FormControl.ErrorMessage
                          leftIcon={<Feather name="info" size={10} />}>
                          {errors.title}
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl>
                        <FormControl.Label>Descriptions</FormControl.Label>
                        <Input
                          isDisabled={createTicketLoading}
                          value={values.descriptions}
                          onChangeText={handleChange('descriptions')}
                          onBlur={handleBlur('descriptions')}
                          textAlignVertical={'top'}
                          multiline={true}
                          placeholder={'Descriptions'}
                          size={'lg'}
                          py={'3'}
                          height={'150px'}
                          numberOfLines={3}
                        />
                        <FormControl.ErrorMessage
                          leftIcon={<Feather name="info" size={10} />}>
                          {errors.descriptions}
                        </FormControl.ErrorMessage>
                      </FormControl>
                    </VStack>
                    <VStack space={'2'}>
                      {attachment && (
                        <TouchableOpacity onPress={() => setAttachment(null)}>
                          <Image
                            source={{uri: attachment?.uri}}
                            width={'80px'}
                            height={'80px'}
                            alt={'attachment'}
                          />
                        </TouchableOpacity>
                      )}
                      <Button
                        onPress={handleAddAttachment}
                        startIcon={
                          <Feather color={'black'} size={25} name={'plus'} />
                        }
                        variant={'outline'}>
                        {attachment ? 'Change Attachment' : 'Add Attachment'}
                      </Button>
                      <Button
                        isLoading={createTicketLoading}
                        onPress={handleSubmit}
                        size={'lg'}
                        py={'3'}>
                        Create Ticket
                      </Button>
                    </VStack>
                  </Box>
                )}
              </Formik>
            </Actionsheet.Content>
          </Actionsheet>
        </>
      )}
    </MainLayout>
  );
};
