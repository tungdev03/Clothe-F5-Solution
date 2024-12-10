import React, { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, DatePicker } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Column, Pie } from "@ant-design/plots";
import StatisticsService from "../../../Service/StatisticsService";

const { RangePicker } = DatePicker;

const StatisticsPage = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [orderStatusCounts, setOrderStatusCounts] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);

  const startDate = dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : "2024-01-01";
  const endDate = dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : "2024-12-31";
  const year = 2024;

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Lấy tổng doanh thu
        const revenue = await StatisticsService.getTotalRevenue(startDate, endDate);
        setTotalRevenue(revenue);

        // Lấy tổng số đơn hàng
        const orders = await StatisticsService.getTotalOrders(startDate, endDate);
        setTotalOrders(orders);

        // Lấy tổng số sản phẩm đã bán
        const productsSold = await StatisticsService.getTotalProductsSold(startDate, endDate);
        setTotalProductsSold(productsSold);

        // Lấy số lượng đơn hàng theo trạng thái
        const statusCounts = await StatisticsService.getOrderStatusCounts(startDate, endDate);
        setOrderStatusCounts(statusCounts);

        // Lấy doanh thu theo tháng
        const monthlyRevenueData = await StatisticsService.getMonthlyRevenue(year);
        setMonthlyRevenue(monthlyRevenueData);
      } catch (err) {
        setError(err);
      }
    };

    fetchStatistics();
  }, [startDate, endDate, year]);

  const columnConfig = {
    data: monthlyRevenue,
    xField: "month",
    yField: "revenue",
    smooth: true,
  };

  const pieConfig = {
    appendPadding: 10,
    data: Object.entries(orderStatusCounts).map(([status, count]) => ({
      type: status,
      value: count,
    })),
    angleField: "value",
    colorField: "type",
    radius: 0.8,
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card style={{ backgroundColor: "#e6f7ff" }}>
            <Statistic
              title="Tổng sản phẩm đã bán"
              value={totalProductsSold}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="Sản phẩm"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#f6ffed" }}>
            <Statistic
              title="Doanh thu"
              value={totalRevenue}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#fffbe6" }}>
            <Statistic
              title="Số đơn hàng"
              value={totalOrders}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#fff2f0" }}>
            <Statistic
              title="Số lượng khách hàng"
              value={93} // Bạn có thể thay giá trị này bằng thông tin từ API
              precision={0}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={15}>
          <Card title="Thống kê doanh thu theo tháng" bordered={false}>
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              style={{ marginBottom: "20px" }}
            />
            <Column {...columnConfig} />
          </Card>
        </Col>
        <Col span={9}>
          <Card title="Trạng thái đơn hàng" bordered={false}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default StatisticsPage;
