/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {MainLayout} from '../../components';
import {
  Text,
  Box,
  HStack,
  ScrollView,
  Input,
  IconButton,
  Card,
  VStack,
  Spinner,
  Pressable,
  Image,
  Button,
  FormControl,
  FlatList,
} from 'native-base';
import {Alert, RefreshControl, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {closeTicket, createTicketMessages, getTicketMessages} from '../../api';
import {useSelector} from 'react-redux';
import {AppConstant, Storage, pickImage} from '../../lib';
import {GenerateUUID} from 'react-native-uuid';
import moment from 'moment-timezone';

const POLLING_INTERVAL = 5000;

export const TicketMessageScreen = ({navigation, route}) => {
  const ticket = route.params?.ticket;

  const [showDescriptionsCard, setShowDescriptionsCard] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [picture, setPicture] = useState('');
  const [closeTicketLoading, setCloseTicketLoading] = useState(false);
  const [pollingId, setPollingId] = useState(null);
  const [lastViewTicket, setLastViewTicket] = useState([]);

  const [attachment, setAttachment] = useState(null);

  const [message, setMessage] = useState('');

  const {user} = useSelector(state => state.auth);

  const handleGetTicketMessages = useCallback(async () => {
    const request = await getTicketMessages(ticket?.id);
    if (request.ok) {
      setTicketMessages(request.data);
    }
  }, [ticket?.id]);

  const startPolling = useCallback(() => {
    const pollingId = setInterval(() => {
      handleGetTicketMessages();
    }, POLLING_INTERVAL);

    // Store the pollingId in state for later cleanup
    setPollingId(pollingId);
  }, [handleGetTicketMessages]);

  useEffect(() => {
    return () => {
      clearInterval(pollingId);
    };
  }, [pollingId]);

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const scrollThreshold = 50;

    const isLastItemVisible =
      offsetY >=
      event.nativeEvent.contentSize.height -
        event.nativeEvent.layoutMeasurement.height -
        scrollThreshold;

    setShowDescriptionsCard(isLastItemVisible);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleGetTicketMessages();
    setRefreshing(false);
  }, [handleGetTicketMessages]);

  const handleInitiateTicketMessage = useCallback(async () => {
    setLoading(true);
    await handleGetTicketMessages();
    setLoading(false);
  }, [handleGetTicketMessages]);

  useEffect(() => {
    handleInitiateTicketMessage();
    startPolling();
  }, [handleInitiateTicketMessage, startPolling]);

  const handleSendTicketMessage = async () => {
    const formData = new FormData();

    formData.append('ticket', ticket.id);
    formData.append('message', message);
    formData.append('sender', user.username);

    if (attachment) {
      formData.append('attachment', {
        uri: attachment.uri,
        type: attachment.type,
        name: attachment.fileName,
      });
    }

    const oldMessages = ticketMessages;

    setTicketMessages([
      ...ticketMessages,
      {
        id: -1,
        ticket: ticket.id,
        message: message,
        sender: user.username,
        attachment: attachment ? attachment.uri : null,
      },
    ]);

    setMessage('');
    setAttachment(null);

    const request = await createTicketMessages(ticket.id, formData);

    if (request.ok) {
      handleGetTicketMessages();
      return;
    }

    setTicketMessages(oldMessages);

    Alert.alert(
      'Send Error',
      request.data?.message
        ? request.data?.message
        : 'Unable to send your ticket message',
    );
  };

  const handleAddAttachment = async () => {
    const image = await pickImage();
    if (image) {
      setAttachment(image);
    }
  };

  const handleCloseTicket = () => {
    Alert.alert(
      'Close Ticket?',
      'You are about to close this ticket are you sure you want to continue',
      [{text: 'Cancel'}, {text: 'Continue', onPress: () => closeUserTicket()}],
    );
  };

  const closeUserTicket = async () => {
    setCloseTicketLoading(true);
    const request = await closeTicket(ticket.id);
    if (request.ok) {
      setCloseTicketLoading(false);
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Close ticket',
      request.data?.message
        ? request.data?.message
        : 'Unable to close your ticket please try again',
    );
    setCloseTicketLoading(false);
  };

  const handleGetSavedTicketList = useCallback(async () => {
    const savedTicketList = await Storage.get(
      AppConstant.STORAGE_KEYS.TICKET_LIST_VIEW,
    );

    if (savedTicketList) {
      // save but remove the one we have
      const parseData = JSON.parse(savedTicketList);
      setLastViewTicket(parseData.filter(item => item.id !== ticket.id));
    }
  }, [ticket.id]);

  useEffect(() => {
    handleGetSavedTicketList();
  }, [handleGetSavedTicketList]);

  useEffect(() => {
    handleUpdateLastViewTicket();
  }, [handleUpdateLastViewTicket, ticketMessages.length]);

  const handleUpdateLastViewTicket = useCallback(async () => {
    const lastMessage = ticketMessages[ticketMessages.length - 1];

    if (lastMessage) {
      await Storage.save(
        AppConstant.STORAGE_KEYS.TICKET_LIST_VIEW,
        JSON.stringify([
          ...lastViewTicket,
          {id: ticket?.id, last_message: lastMessage.message},
        ]),
      );
    }
  }, [lastViewTicket, ticket?.id, ticketMessages]);

  return (
    <>
      {picture ? (
        <Box
          safeArea
          zIndex={100}
          width={'100%'}
          height={'100%'}
          bgColor={'rgba(0,0,0,0.5)'}
          position={'absolute'}>
          <HStack px={'4'} pt={'2'} justifyContent={'flex-end'}>
            <IconButton
              rounded={'full'}
              variant={'solid'}
              onPress={() => setPicture('')}
              icon={<Feather name={'x'} color={'white'} size={20} />}
            />
          </HStack>
          <Box flex={1} justifyContent={'center'} alignItems={'center'}>
            <Image
              alt="selected-image"
              source={{uri: picture}}
              width={'90%'}
              height={'90%'}
              resizeMode="contain"
            />
          </Box>
        </Box>
      ) : (
        <></>
      )}
      <MainLayout showHeader={true} headerTitle={`Ticket # ${ticket?.id}`}>
        {loading ? (
          <Box flex={1} justifyContent={'center'} alignItems={'center'}>
            <Spinner />
          </Box>
        ) : (
          <>
            <Box flex={1}>
              {showDescriptionsCard ||
                (ticketMessages.length < 1 && (
                  <Box px={'4'}>
                    <Card
                      mb={'2'}
                      borderWidth={'1'}
                      borderColor={'primary.500'}>
                      <VStack pb={'2'}>
                        <Text
                          fontSize={'md'}
                          color={'primary.500'}
                          fontWeight={'semibold'}>
                          Title:
                        </Text>
                        <Text>{ticket?.title}</Text>
                      </VStack>
                      <VStack>
                        <Text
                          fontSize={'md'}
                          color={'primary.500'}
                          fontWeight={'semibold'}>
                          Descriptions:
                        </Text>
                        <Text>{ticket?.descriptions}</Text>
                      </VStack>
                    </Card>
                  </Box>
                ))}
              <Box flex={1} px={'4'}>
                <FlatList
                  onScroll={handleScroll}
                  data={ticketMessages.slice().reverse()}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <Pressable key={index} my={'2'}>
                      <Pressable my={'2'}>
                        {({isPressed}) => (
                          <VStack
                            maxWidth={'90%'}
                            p={'2'}
                            bgColor={
                              item.sender !== user.username
                                ? 'gray.100'
                                : 'primary.100'
                            }
                            alignSelf={
                              item.sender !== user.username
                                ? 'flex-start'
                                : 'flex-end'
                            }>
                            <Text
                              color={
                                item.sender !== user.username
                                  ? 'red.500'
                                  : 'primary.500'
                              }>
                              {item.sender === user.username
                                ? 'You'
                                : item.sender}
                            </Text>
                            {item?.attachment && (
                              <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => setPicture(item.attachment)}>
                                <Image
                                  source={{
                                    uri: item?.attachment,
                                  }}
                                  alt="attachment image"
                                  width={400}
                                  height={300}
                                  resizeMode="contain"
                                />
                              </TouchableOpacity>
                            )}
                            <Text fontSize={'md'} lineHeight={'xl'}>
                              {item?.message}
                            </Text>
                            <Text color={'secondary.300'} textAlign={'right'}>
                              {moment(item.created_at).calendar()}
                            </Text>
                          </VStack>
                        )}
                      </Pressable>
                    </Pressable>
                  )}
                  inverted={true}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                  }}
                />
              </Box>
            </Box>
            <Box
              px={'4'}
              bgColor={'white'}
              py={'3'}
              borderTopRadius={'10'}
              borderWidth={1}
              borderBottomWidth={0}>
              {attachment && (
                <TouchableOpacity onPress={() => setAttachment(null)}>
                  <Image
                    source={{uri: attachment?.uri}}
                    alt={'attachment'}
                    width={'70px'}
                    height={'70px'}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              {!ticket?.is_closed ? (
                <HStack alignItems={'center'} space={'2'} mt={2}>
                  <IconButton
                    isDisabled={closeTicketLoading}
                    onPress={handleAddAttachment}
                    rounded={'full'}
                    variant={'solid'}
                    size={'sm'}
                    icon={
                      <Feather name={'paperclip'} size={16} color={'white'} />
                    }
                  />
                  <Input
                    flex={1}
                    size={'lg'}
                    py={'3'}
                    isDisabled={closeTicketLoading}
                    value={message}
                    onChangeText={text => setMessage(text)}
                    placeholder="Reply"
                    InputRightElement={
                      <HStack px={'2'}>
                        <IconButton
                          onPress={handleSendTicketMessage}
                          isDisabled={message.length < 1 || closeTicketLoading}
                          rounded={'full'}
                          variant={'solid'}
                          size={'sm'}
                          icon={
                            <Feather name={'send'} size={16} color={'white'} />
                          }
                        />
                      </HStack>
                    }
                  />
                </HStack>
              ) : (
                <></>
              )}

              <HStack pt={'2'}>
                {ticket?.is_closed && (
                  <Button
                    isLoading={closeTicketLoading}
                    onPress={handleCloseTicket}
                    py={'3'}
                    size={'lg'}
                    isDisabled={ticket?.is_closed}
                    flex={1}>
                    {ticket?.is_closed ? 'Ticket is Closed' : 'Close Ticket'}
                  </Button>
                )}
              </HStack>
            </Box>
          </>
        )}
      </MainLayout>
    </>
  );
};
