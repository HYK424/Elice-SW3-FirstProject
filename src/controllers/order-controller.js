import { AppError, commonErrors } from '../middlewares';
import { OrderService } from '../services';

export const orderController = {
  createOrder: async (req, res, next) => {
    const orderInfo = { ...req.body };
    const newOrder = await OrderService.createOrder(orderInfo);

    return res.status(201).json(newOrder);
  },

  getOrders: async (req, res, next) => {
    const orders = await OrderService.getOrders();
    return res.status(200).json(orders);
  },
  // 이건 비회원을 위한 API임
  getOrderById: async (req, res, next) => {
    const { orderId } = req.body;
    const order = await OrderService.getOrderById(orderId);
    res.status(200).json(order);
  },

  getMyOrders: async (req, res, next) => {
    const { userId } = req;
    console.log(userId);
    const orders = await OrderService.getMyOrders(userId);
    return res.status(200).json(orders);
  },

  getOrder: async (req, res, next) => {
    const { orderId } = req.params;
    const { userId, role } = req;
    const order = await OrderService.getOrder(orderId);
    if (currentUserId !== order.userId && role === 'basic-user') {
      throw new AppError(
        commonErrors.authorizationError,
        403,
        '해당 주문은 고객님의 주문이 아니에요!',
      );
    }
    return res.status(200).json(order);
  },

  updateOrder: async (req, res, next) => {
    const { orderId } = req.params;
    const { orderItems, totalPrice, address, request } = req.body;
    const updateInfo = {
      ...(orderItems && { orderItems }),
      ...(address && { address }),
      ...(totalPrice && { totalPrice }),
      ...(request && { request }),
    };
    await OrderService.updateOrder(orderId, updateInfo);
    return res.status(200).json('주문 정보가 정상적으로 수정되었습니다 😊');
  },

  cancelOrder: async (req, res, next) => {
    const { orderId } = req.params;
    const updateInfo = { status: 'canceled' };
    const result = await OrderService.cancelOrder(orderId, updateInfo);
    return res.send(200).json('주문이 정상적으로 취소되었습니다 :)');
  },

  updateOrderStatus: async (req, res, next) => {
    const { orderIds, status } = req.body;
    if (['배송 중', '배송 완료'].indexOf(status) === -1) {
      throw new AppError(
        commonErrors.businessError,
        400,
        '올바른 배송 상태를 지정하여 다시 요청해주세요 :(',
      );
    }
    await OrderService.updateOrderStatus(orderIds, status);
    res.status(200).json('배송 상태가 정상적으로 수정되었습니다 😊');
  },

  deleteMyOrder: async (req, res, next) => {
    const { orderId } = req.params;
    const result = await OrderService.deleteMyOrder(orderId);

    res.status(200).json(result);
  },

  deleteOrder: async (req, res, next) => {
    const { orderId } = req.params;
    const result = await OrderService.deleteOrder(orderId);

    res.status(200).json(result);
  },

  unknownUserOrder: async (req, res) => {
    console.log(req.body);
    const { orderCode, phoneNumber } = req.body;
    console.log(orderCode);
    console.log(phoneNumber);
    const status = 200;
    const message = '데이터 조회 성공';
    const data = {
      orderItems: [
        { productId: '제품1', quantity: 123 },
        { productId: '제품2', quantity: 456 },
        { productId: '제품3', quantity: 789 },
      ],
      status: 'standby',
      address: {
        postalCode: 123,
        address1: '너거집 주소1',
        address2: '너거집 주소2',
      },
      request: '배송요청사항',
    };
    res.status(status).json({ message: message, data: data });
  },

  unknownUserOrderCancel: async (req, res) => {
    console.log(req.body);
    const { orderCode } = req.body;
    console.log(orderCode);
    const status = 200;
    const message = '주문 취소 성공';
    res.status(status).json({ message: message });
  },
};
