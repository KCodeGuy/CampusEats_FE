'use client';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import { getOrderByOrderId } from '@/api/OrderAPI';
import PayingItem from '@/components/PayingItem/PayingItem';
import styles from './Paying.module.scss';

const divStyle = {
  backgroundColor: '#DCDCDC',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px'
};
const cx = classNames.bind(styles);
const OrderHistory = ({ params }: { params: { id: string } }) => {
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState<OrderDTO>();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCustomer = localStorage.getItem('account');
      if (!storedCustomer) {
        router.push('/Login');
      }
    }
  }, []);

  const {
    isPending,
    isError,
    data: results,
    error
  } = useQuery({
    queryKey: ['orderHistory', params.id],
    queryFn: async () => {
      console.log(params.id);
      const data = await getOrderByOrderId(params.id);
      return data;
    }
  });

  if (!isPending && results?.data !== undefined && results?.data !== order) {
    setOrder(results?.data);

    let totalPrice = 0;

    if (results?.data?.details && results?.data?.details.length > 0) {
      totalPrice = results?.data?.details.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.price * currentItem.quantity;
      }, 0);
    }

    setTotal(totalPrice);
  }
  const formatPrice = (number: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(number);
  };
  return (
    <div className={cx('background-color')}>
      <div className={cx('container')}>
        <div className={cx('h-30')}></div>
        <Fragment>
          <div className={cx('col-md-12', 'card-info', 'border', 'rounded')}>
            <p className={cx('font-arial', 'f-bold')}>Mã đơn: {order?.code}</p>
            <p className={cx('font-arial', 'f-bold')}>Họ và tên: {order?.receiver}</p>
            <p className={cx('font-arial', 'f-bold')}>
              Số điện thoại: {order?.contactNumber}
            </p>
            <p className={cx('font-arial', 'f-bold')}>Địa chỉ: {order?.address}</p>
            <p className={cx('font-arial', 'f-bold')}>
              Thanh Toán :{' '}
              {order?.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </p>
            <p className={cx('font-arial', 'f-bold')}>
              Lịch hẹn:{' '}
              {order?.appointmentDate ? order.appointmentDate.toLocaleString() : ''}
            </p>
            <p className={cx('font-arial', 'f-bold')}>Ghi chú: {order?.note}</p>
          </div>
          <div>
            <h1
              className={cx(
                'd-flex',
                'align-items-center',
                'justify-content-center',
                'font-arial',
                'mt-4',
                'fs-xxl',
                'f-bold',
                'mb-3',
                'text-title-color'
              )}
            >
              Lịch sử mua hàng
            </h1>
          </div>
          {order?.details?.map((item, index) => (
            <Fragment key={index}>
              <PayingItem
                imageUrl={item.images ? item.images[0] : ''}
                name={item.fullName ? item.fullName : ''}
                price={item.price}
                productId={item.productId}
                quantity={item.quantity}
              />
              <br />
            </Fragment>
          ))}
          <Col className={cx('text-start', 'p-t-22')}>
            <h4 className={cx('font-arial', 'f-bold')}>Ghi chú:</h4>
          </Col>
          <hr />
          <Row className={cx('p-t-22')}>
            <Col md={6}></Col>
            <Col
              md={6}
              className={cx('d-flex', 'justify-content-center')}
            >
              <h4 className={cx('text-end', 'col-12', 'font-arial', 'f-bold')}>
                Tổng thanh toán: {formatPrice(total)}
              </h4>
            </Col>
          </Row>
          <Row
            className={cx(
              'd-flex',
              'align-items-center',
              'justify-content-between',
              'p-t-22',
              'p-2'
            )}
          ></Row>
        </Fragment>
      </div>
    </div>
  );
};

export default OrderHistory;
