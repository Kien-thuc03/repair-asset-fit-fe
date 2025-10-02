import { IUserWithRoles, UserStatus } from "@/types";
import { Modal, Button, Avatar, Typography, Space } from 'antd';
import { UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface UserConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: IUserWithRoles;
  action: "toggle-status" | "delete";
}

export default function UserConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  action,
}: UserConfirmModalProps) {
  const getModalContent = () => {
    switch (action) {
      case "toggle-status":
        return {
          title: user.status === UserStatus.ACTIVE ? "Khóa tài khoản" : "Mở khóa tài khoản",
          message: user.status === UserStatus.ACTIVE 
            ? `Bạn có chắc chắn muốn khóa tài khoản của "${user.fullName}"? Người dùng này sẽ không thể đăng nhập vào hệ thống.`
            : `Bạn có chắc chắn muốn mở khóa tài khoản của "${user.fullName}"? Người dùng này sẽ có thể đăng nhập vào hệ thống.`,
          confirmText: user.status === UserStatus.ACTIVE ? "Khóa tài khoản" : "Mở khóa",
          confirmType: user.status === UserStatus.ACTIVE ? "default" : "primary",
          danger: user.status === UserStatus.ACTIVE,
        };
      case "delete":
        return {
          title: "Xóa tài khoản",
          message: `Bạn có chắc chắn muốn xóa tài khoản của "${user.fullName}"? Hành động này không thể hoàn tác.`,
          confirmText: "Xóa tài khoản",
          confirmType: "primary",
          danger: true,
        };
      default:
        return {
          title: "Xác nhận",
          message: "Bạn có chắc chắn muốn thực hiện hành động này?",
          confirmText: "Xác nhận",
          confirmType: "primary",
          danger: false,
        };
    }
  };

  const content = getModalContent();

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: content.danger ? '#ff4d4f' : '#faad14' }} />
          {content.title}
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      centered
      width={480}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="confirm"
          type={content.confirmType as "default" | "primary"}
          danger={content.danger}
          onClick={onConfirm}
        >
          {content.confirmText}
        </Button>,
      ]}
    >
      <div className="py-4">
        <Text className="text-gray-700 block mb-4">
          {content.message}
        </Text>
        
        {/* User info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <Space align="center">
            <Avatar 
              size="large" 
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            >
              {user.fullName.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {user.fullName}
              </Title>
              <Text type="secondary">@{user.username}</Text>
              <br />
              <Text type="secondary">{user.email}</Text>
            </div>
          </Space>
        </div>
      </div>
    </Modal>
  );
}