import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, DatePicker } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Column, Pie } from '@ant-design/plots';

const { RangePicker } = DatePicker;

const StatisticsPage = () => {
    const [columnData, setColumnData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        fetchColumnData();
        fetchPieData();
    }, []);

    const fetchColumnData = async () => {
        const dummyData = [
            { month: 'Jan', value: 100 },
            { month: 'Feb', value: 200 },
            { month: 'Mar', value: 300 },
            { month: 'Apr', value: 150 },
            { month: 'May', value: 400 },
            { month: 'Jun', value: 380 },
            { month: 'Jul', value: 430 },
            { month: 'Aug', value: 350 },
        ];
        setColumnData(dummyData);
    };

    const fetchPieData = async () => {
        const dummyPieData = [
            { type: 'Chờ xác nhận', value: 27 },
            { type: 'Xác nhận', value: 25 },
            { type: 'Chờ giao hàng', value: 18 },
            { type: 'Giao hàng', value: 15 },
            { type: 'Thành công', value: 10 },
            { type: 'Đã hủy', value: 5 },
        ];
        setPieData(dummyPieData);
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    const columnConfig = {
        data: columnData,
        xField: 'month',
        yField: 'value',
        smooth: true,
    };

    const pieConfig = {
        appendPadding: 10,
        data: pieData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16}>
                <Col span={6}>
                    <Card style={{ backgroundColor: '#e6f7ff' }}>
                        <Statistic
                            title="Tổng sản phẩm đã bán"
                            value={1128}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="Sản phẩm"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ backgroundColor: '#f6ffed' }}>
                        <Statistic
                            title="Doanh thu"
                            value={93128}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="VNĐ"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ backgroundColor: '#fffbe6' }}>
                        <Statistic
                            title="Số đơn hàng"
                            value={128}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ backgroundColor: '#fff2f0' }}>
                        <Statistic
                            title="Số lượng khách hàng"
                            value={93}
                            precision={0}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ArrowDownOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={15}>
                    <Card title="Thống kê doanh thu theo tháng" bordered={false}>
                        <RangePicker
                            value={dateRange}
                            onChange={handleDateChange}
                            style={{ marginBottom: '20px' }}
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
        </div>
    );
};

export default StatisticsPage;
