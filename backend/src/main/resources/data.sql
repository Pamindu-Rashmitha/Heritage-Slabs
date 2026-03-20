UPDATE orders SET status = 'Pending' WHERE status = 'PENDING';
UPDATE orders SET status = 'Paid' WHERE status = 'PAID';
UPDATE orders SET status = 'Shipped' WHERE status = 'SHIPPED';
UPDATE orders SET status = 'Delivered' WHERE status = 'DELIVERED';
UPDATE orders SET status = 'Failed' WHERE status = 'FAILED';
