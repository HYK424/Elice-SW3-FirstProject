import { Router } from 'express';
import { adminController } from '../../controllers/admin-controller';
import { orderController } from '../../controllers/order-controller';
import { loginAuthenticator } from '../../middlewares/authentication';
import { checkRole } from '../../middlewares/authorization';

const adminRouter = Router();

adminRouter.use(loginAuthenticator.isLoggedIn, checkRole);

//모든 유저 검색
adminRouter.get('/allusers', adminController.getAllUsers);

//지정 유저 정보 확인
adminRouter.get('/allusers/:userId', adminController.getUserInfo);

//지정 유저 정보 강제 변경
adminRouter.put('/allusers/:userId', adminController.forceChangeUserInfo);

//지정 유저 비밀번호 초기화
adminRouter.get('/allusers/:userId/password', adminController.resetPassword);

adminRouter.get('/order', orderController.getOrders);

export { adminRouter };