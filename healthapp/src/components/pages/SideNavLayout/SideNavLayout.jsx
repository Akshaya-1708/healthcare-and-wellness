import React from "react";
import { Layout, Menu, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title } = Typography;

const SideNavLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "/dashboard", label: "Dashboard" },
    { key: "/goalTracker", label: "Wellness Goals" },
    { key: "/auditLog", label: "Audit Log" },
  ];

  const handleClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Left sidenav */}
      <Sider
        width={200}
        style={{
          background: "#0099e6",
          padding: "16px 12px",
        }}
      >
        <Title
          level={4}
          style={{
            color: "#fff",
            margin: 0,
            marginBottom: 24,
            fontWeight: 600,
          }}
        >
          Health
        </Title>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleClick}
          items={items}
          theme="dark"
          style={{
            background: "transparent",
            borderRight: "none",
          }}
        />
      </Sider>

      {/* Right content area */}
      <Content
        style={{
          background: "#f5f5f5",
          padding: 24,
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default SideNavLayout;
