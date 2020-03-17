import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUsers, updateUserRole, updateUser } from "../../../store/User";
import { userSelector } from "../../../store/selectors/user";
import { Table, Select, Input } from "antd";
import { loadRoles } from "../../../store/Role";
import { roleSelector } from "../../../store/selectors/role";
import { Role } from "../../../@types/Entities/Role";
import { User } from "../../../@types/Entities/User";

const { Option } = Select;
const renderImage = (src) => <img height={75} src={`${process.env.API_URL}${src}`} alt='organization-logo'/>
const getColumns = (roles: Role[], onChangeRole: (userId: number, roleId: number) => void, onEdit: (userId: number, data: Partial<User>) => void) => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => <Input style={{ width: '100%' }} defaultValue={name} onBlur={(e) => onEdit(record.id, {displayName: e.target.value})} />,
    },
    {
      title: 'Twitch ID',
      dataIndex: 'twitchId',
      key: 'twitchId',
    },
    {
      title: 'Icon',
      dataIndex: 'avatar',
      key: 'icon',
      render: (text) => renderImage(text),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (roleId, record) => <Select defaultValue={roleId} onChange={(newRoleId) => onChangeRole(record.id, newRoleId)} style={{ width: 200 }}>
        {roles.map((role) => <Option key={role.id} value={role.id}>{role.name}</Option>)}
      </Select>,
    },
    {
      title: 'Custom Title',
      dataIndex: 'customTitle',
      key: 'customTitle',
      render: (title, record) => <Input style={{ width: '100%' }} defaultValue={title} onBlur={(e) => onEdit(record.id, {customTitle: e.target.value})} />,
    },
    {
      title: 'Profile Url',
      dataIndex: 'profileUrl',
      key: 'profileUrl',
      render: (profile, record) => <Input style={{ width: '100%' }} defaultValue={profile} onBlur={(e) => onEdit(record.id, {profileUrl: e.target.value})} />,
    },
  ];

export default function UserList(): ReactElement {
    const dispatch = useDispatch();
    const users = Object.values(useSelector(userSelector));
    const roles = Object.values(useSelector(roleSelector));

    useEffect(() => {
        dispatch(loadUsers());
        dispatch(loadRoles());
    }, []);

    const onChangeRole = (userId: number, roleId: number) => {
        dispatch(updateUserRole(userId, roleId));
    };

    const onEdit = (userId: number, data: Partial<User>) => {
      dispatch(updateUser(userId, data));
  };

    return <>
        <Table dataSource={users} columns={getColumns(roles, onChangeRole, onEdit)} rowKey={'id'}/>
    </>;
}