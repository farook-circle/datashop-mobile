/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useMemo} from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Checkbox,
  Button,
  Divider,
  ScrollView,
  Pressable,
  Badge,
  Actionsheet,
  useDisclose,
  Icon,
  Avatar,
  Spacer,
} from 'native-base';
import {MainLayout} from '../components';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function CartScreen({navigation}) {
  const {cart_items} = useSelector(state => state.wallet);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclose();

  // Sample data for development (remove when real data is available)
  const sampleCartItems = [
    {
      amount: 588,
      check_mtn_number: false,
      customer: '09066424203',
      customer_reference: null,
      product: {
        category: 9,
        created_at: '2024-07-09T00:45:24.431207+01:00',
        description: 'Get 1500mb MTN data. Valid for 2 days',
        id: 46,
        image:
          'https://firebasestorage.googleapis.com/v0/b/datashop-asset.appspot.com/o/provider-logo%2Fmtn.jpg?alt=media&token=aab9b893-0509-4e82-9a22-682a33e2124b',
        is_available: true,
        price: 588,
        quantity: '1.5GB',
        service: 'MTN',
        validity: '2 days',
      },
      product_type: 'data',
      remark: 'I love this Service',
    },
  ];

  const cartData = cart_items?.length > 0 ? cart_items : sampleCartItems;

  // Calculate totals
  const {selectedTotal, totalItems, selectedCount} = useMemo(() => {
    const selected =
      selectedItems.size > 0
        ? cartData.filter((_, index) => selectedItems.has(index))
        : cartData;

    return {
      selectedTotal: selected.reduce((sum, item) => sum + item.amount, 0),
      totalItems: cartData.length,
      selectedCount:
        selectedItems.size > 0 ? selectedItems.size : cartData.length,
    };
  }, [selectedItems, cartData]);

  const handleItemSelect = index => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === cartData.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartData.map((_, index) => index)));
    }
    setSelectAll(!selectAll);
  };

  const handlePayment = method => {
    onClose();
    // Handle payment logic here
    console.log(`Payment method selected: ${method}`);
    // Navigate to payment screen or process payment
  };

  const CartItem = ({item, index, isSelected, onSelect}) => (
    <Box
      bg="white"
      rounded="lg"
      shadow={1}
      mb={3}
      p={4}
      borderWidth={isSelected ? 2 : 1}
      borderColor={isSelected ? 'primary.500' : 'gray.200'}>
      <HStack space={3} alignItems="flex-start">
        <Checkbox
          value={`item-${index}`}
          isChecked={isSelected}
          onChange={() => onSelect(index)}
          colorScheme="primary"
          size="md"
        />

        <Image
          source={{uri: item.product.image}}
          alt={item.product.service}
          size="60px"
          rounded="md"
          fallbackElement={
            <Avatar bg="gray.300" size="60px">
              {item.product.service?.charAt(0)}
            </Avatar>
          }
        />

        <VStack flex={1} space={1}>
          <HStack alignItems="center" space={2}>
            <Badge colorScheme="primary" variant="solid" rounded="full">
              {item.product.service}
            </Badge>
            <Badge colorScheme="gray" variant="outline">
              {item.product_type.toUpperCase()}
            </Badge>
          </HStack>

          <Text fontSize="md" fontWeight="semibold" color="gray.800">
            {item.product.quantity}
          </Text>

          <Text fontSize="sm" color="gray.600" numberOfLines={2}>
            {item.product.description}
          </Text>

          <HStack alignItems="center" space={2} mt={1}>
            <Icon
              as={MaterialIcons}
              name="schedule"
              size="xs"
              color="gray.500"
            />
            <Text fontSize="xs" color="gray.500">
              Valid for {item.product.validity}
            </Text>
          </HStack>

          <HStack alignItems="center" space={2}>
            <Icon as={MaterialIcons} name="phone" size="xs" color="gray.500" />
            <Text fontSize="xs" color="gray.500">
              {item.customer}
            </Text>
          </HStack>

          {item.remark && (
            <HStack alignItems="center" space={2}>
              <Icon
                as={MaterialIcons}
                name="comment"
                size="xs"
                color="gray.500"
              />
              <Text fontSize="xs" color="gray.500" italic>
                "{item.remark}"
              </Text>
            </HStack>
          )}
        </VStack>

        <VStack alignItems="flex-end" space={1}>
          <Text fontSize="lg" fontWeight="bold" color="primary.600">
            ₦{item.amount.toLocaleString()}
          </Text>
          <Pressable
            onPress={() => {
              // Handle remove item
              console.log('Remove item', index);
            }}
            p={1}>
            <Icon
              as={MaterialIcons}
              name="delete-outline"
              size="sm"
              color="red.500"
            />
          </Pressable>
        </VStack>
      </HStack>
    </Box>
  );

  if (!cartData || cartData.length === 0) {
    return (
      <MainLayout showHeader={true} headerTitle={'Cart'}>
        <VStack flex={1} justifyContent="center" alignItems="center" space={4}>
          <Icon
            as={MaterialIcons}
            name="shopping-cart"
            size="4xl"
            color="gray.400"
          />
          <Text fontSize="lg" color="gray.500" textAlign="center">
            Your cart is empty
          </Text>
          <Button
            onPress={() => navigation.goBack()}
            variant="outline"
            colorScheme="primary">
            Continue Shopping
          </Button>
        </VStack>
      </MainLayout>
    );
  }

  return (
    <MainLayout showHeader={true} headerTitle={'Cart'}>
      <VStack flex={1} bg="gray.50">
        {/* Select All Header */}
        <Box bg="white" p={4} shadow={1}>
          <HStack alignItems="center" justifyContent="space-between">
            <HStack alignItems="center" space={3}>
              <Checkbox
                value="select-all"
                isChecked={selectAll}
                onChange={handleSelectAll}
                colorScheme="primary"
                size="md"
              />
              <Text fontSize="md" fontWeight="medium">
                Select All ({totalItems} items)
              </Text>
            </HStack>
            <Pressable
              onPress={() => {
                // Handle clear cart
                console.log('Clear cart');
              }}>
              <Text fontSize="sm" color="red.500">
                Clear Cart
              </Text>
            </Pressable>
          </HStack>
        </Box>

        {/* Cart Items */}
        <ScrollView flex={1} p={4} showsVerticalScrollIndicator={false}>
          {cartData.map((item, index) => (
            <CartItem
              key={`cart-item-${index}`}
              item={item}
              index={index}
              isSelected={selectedItems.has(index) || selectedItems.size === 0}
              onSelect={handleItemSelect}
            />
          ))}

          {/* Spacer for bottom content */}
          <Box h={20} />
        </ScrollView>

        {/* Bottom Summary and Payment */}
        <Box bg="white" p={4} shadow={3}>
          <VStack space={3}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="sm" color="gray.600">
                Selected Items ({selectedCount})
              </Text>
              <Text fontSize="sm" color="gray.600">
                Subtotal: ₦{selectedTotal.toLocaleString()}
              </Text>
            </HStack>

            <Divider />

            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                Total Amount
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="primary.600">
                ₦{selectedTotal.toLocaleString()}
              </Text>
            </HStack>

            <Button
              onPress={onOpen}
              colorScheme="primary"
              size="lg"
              isDisabled={selectedTotal === 0}
              leftIcon={<Icon as={MaterialIcons} name="payment" size="sm" />}>
              Proceed to Payment
            </Button>
          </VStack>
        </Box>

        {/* Payment Method Action Sheet */}
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Box w="100%" h={60} px={4} justifyContent="center">
              <Text
                fontSize="16"
                color="gray.500"
                textAlign="center"
                fontWeight="medium">
                Select Payment Method
              </Text>
            </Box>

            <Actionsheet.Item
              onPress={() => handlePayment('wallet')}
              startIcon={
                <Icon
                  as={MaterialIcons}
                  name="account-balance-wallet"
                  size="6"
                />
              }>
              <VStack alignItems="flex-start">
                <Text fontSize="md" fontWeight="medium">
                  Wallet Balance
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Pay from your wallet
                </Text>
              </VStack>
            </Actionsheet.Item>

            <Actionsheet.Item
              onPress={() => handlePayment('card')}
              startIcon={
                <Icon as={MaterialIcons} name="credit-card" size="6" />
              }>
              <VStack alignItems="flex-start">
                <Text fontSize="md" fontWeight="medium">
                  Debit/Credit Card
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Pay with your card
                </Text>
              </VStack>
            </Actionsheet.Item>

            <Actionsheet.Item
              onPress={() => handlePayment('bank')}
              startIcon={
                <Icon as={MaterialIcons} name="account-balance" size="6" />
              }>
              <VStack alignItems="flex-start">
                <Text fontSize="md" fontWeight="medium">
                  Bank Transfer
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Transfer to our account
                </Text>
              </VStack>
            </Actionsheet.Item>

            <Actionsheet.Item
              onPress={() => handlePayment('ussd')}
              startIcon={<Icon as={MaterialIcons} name="dialpad" size="6" />}>
              <VStack alignItems="flex-start">
                <Text fontSize="md" fontWeight="medium">
                  USSD
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Pay via USSD code
                </Text>
              </VStack>
            </Actionsheet.Item>

            <Actionsheet.Item onPress={onClose}>
              <Text color="red.500" fontSize="md">
                Cancel
              </Text>
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
    </MainLayout>
  );
}
