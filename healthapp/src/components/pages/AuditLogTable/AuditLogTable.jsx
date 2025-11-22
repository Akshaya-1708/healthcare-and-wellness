import React from 'react'
import { Card, Table, Typography, Tag } from 'antd'
import { useSelector } from 'react-redux'

const { Title, Text } = Typography

function AuditLogTable() {
  const logs = useSelector((state) => state.audit.logs)
  console.log(logs, "logs")

  const columns = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 200,
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 180,
      render: (action) => <Tag color="blue">{action}</Tag>,
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (value) =>
        value ? value : <Text type="secondary">–</Text>,
    },
  ]

  return (
    <Card>
      <Title level={4} style={{ marginBottom: 4 }}>
        Audit Log
      </Title>
      <Text type="secondary">
        Logs of user actions related to goal updates and data access.
      </Text>
      <Table
        style={{ marginTop: 16 }}
        dataSource={[...logs].reverse()}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 8 }}
      />
    </Card>
  )
}

export default AuditLogTable
