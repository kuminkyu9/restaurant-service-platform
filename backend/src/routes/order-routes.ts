import { Router, Request, Response } from 'express';
import prisma from '@/utils/prisma';

const router = Router();

// 주문 접수 (POST /orders) - 손님용 (인증 X)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { restaurantId, tableNumber, items } = req.body;

    // 1. 필수 값 체크
    if (!restaurantId || !tableNumber || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: '주문 정보가 올바르지 않습니다.' });
    }

    // items 예시: [{ menuId: 1, quantity: 2 }, { menuId: 3, quantity: 1 }]

    // 2. 가격 검증 및 총액 계산 로직 (★ 핵심 보안 로직)
    // 프론트에서 가격을 보내줘도 무시하고, DB에서 직접 조회해야 안전함.
    
    // 2-1. 주문한 메뉴 ID만 추출
    const menuIds = items.map((item: any) => item.menuId);

    // 2-2. DB에서 실제 메뉴 정보 조회
    const dbMenus = await prisma.menu.findMany({
      where: {
        id: { in: menuIds },
        category: { restaurantId: Number(restaurantId) } // 해당 식당 메뉴가 맞는지 확인
      }
    });

    if (dbMenus.length !== menuIds.length) {
      return res.status(400).json({ success: false, message: '존재하지 않는 메뉴가 포함되어 있습니다.' });
    }

    // 2-3. 주문 내역(OrderItems) 데이터 준비 및 총액(TotalPrice) 계산
    let totalPrice = 0;
    const orderItemsData = items.map((item: any) => {
      const menu = dbMenus.find(m => m.id === item.menuId);
      if (!menu) throw new Error('Menu not found'); // 이론상 안 일어남

      const itemTotalPrice = menu.price * item.quantity;
      totalPrice += itemTotalPrice;

      return {
        menuId: menu.id,
        quantity: item.quantity,
        price: menu.price // ★ 스냅샷 저장 (나중에 가격 올라도 이 주문은 이 가격으로 박제됨)
      };
    });

    // 3. 트랜잭션으로 주문 생성 (Order + OrderItems)
    const newOrder = await prisma.$transaction(async (tx) => {
      // 3-1. Order 생성
      const order = await tx.order.create({
        data: {
          restaurantId: Number(restaurantId),
          tableNumber: Number(tableNumber),
          totalPrice: totalPrice,
          status: 'PENDING', // 기본 상태: 접수 대기
          // 3-2. OrderItem 동시 생성 (createMany 대신 create의 items 옵션 활용)
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: {
            include: { menu: true } // 응답 줄 때 메뉴 이름까지 보여주기 위해
          }
        }
      });

      return order;
    });

    return res.status(201).json({
      success: true,
      message: '주문이 성공적으로 접수되었습니다.',
      data: newOrder
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    return res.status(500).json({ success: false, message: '주문 처리 중 오류 발생' });
  }
});

// 주문 목록 조회 (GET /orders?restaurantId=10&tableNumber=3&status=pending) - 주방/홀 스태프용 (인증 X 또는 간소화)
// 실제 서비스라면 스태프 로그인이 필요하지만, 지금은 테스트 편의상 restaurantId 쿼리로 조회하게끔
// (비회원)손님이 주문한 목록 확인하기 위한 api(그래서 #$이거 표시된 조건 추가함) !! 위에꺼 일부 취소
router.get('/', async (req: Request, res: Response) => {
  try {
    const { restaurantId, tableNumber, status } = req.query;

    if (!restaurantId) {
      return res.status(400).json({ success: false, message: '식당 ID가 필요합니다.' });
    }

    // 조건부 필터링 (status가 있으면 status로 필터, 없으면 전체)
    const whereCondition: any = {
      restaurantId: Number(restaurantId),
    };

    if(tableNumber) { // 테이블 번호 조건 추가 #$,  이거 있음 손님용에서 쓰는거
      whereCondition.tableNumber = Number(tableNumber);  
    }
    if (status) {
      whereCondition.status = String(status);
    } else {
      // status가 없으면 보통 '완료(COMPLETED)'된 건 안 보고 싶어 함 (주방 화면이니까)
      // whereCondition.status = { not: 'COMPLETED' }; // 필요하면 주석 해제
    }

    const orders = await prisma.order.findMany({
      where: whereCondition,
      include: {
        orderItems: {
          include: { menu: true }
        }
      },
      orderBy: { createdAt: 'desc' } // 최신 주문이 위로
    });

    return res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Get Orders Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러' });
  }
});


// 이거 orderId 여서 스태프쪽에서는 orderId 알수가 없어서 생각해보니깐 이거 못쓸듯 staff에 새로 만들거임
// 주문 상태 변경 (PATCH /orders/:orderId/status) - "조리중", "서빙완료" 등
router.patch('/:orderId/status', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // 유효한 상태 값인지 확인 (타입 안전성)
    const validStatuses = ['PENDING', 'COOKING', 'SERVED', 'COMPLETED', 'CANCELED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: '올바르지 않은 주문 상태입니다.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status }
    });

    return res.status(200).json({
      success: true,
      message: `주문 상태가 ${status}(으)로 변경되었습니다.`,
      data: updatedOrder
    });

  } catch (error) {
    console.error('Update Order Status Error:', error);
    return res.status(500).json({ success: false, message: '상태 변경 실패' });
  }
});

export default router;
