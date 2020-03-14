import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUsers, updateUserRole } from "../../../store/User";
import { userSelector } from "../../../store/selectors/user";
import { Table, Select } from "antd";
import { loadRoles } from "../../../store/Role";
import { roleSelector } from "../../../store/selectors/role";
import { Role } from "../../../@types/Entities/Role";

const { Option } = Select;

const renderImage = (src) => <img height={75} src={`${process.env.API_URL}${src}`} alt='organization-logo'/>
const getColumns = (roles: Role[], onChangeRole: (userId: number, roleId: number) => void) => [
    {
      title: 'Name',
      dataIndex: 'display_name',
      key: 'display_name',
    },
    {
      title: 'Twitch ID',
      dataIndex: 'twitch_id',
      key: 'twitch_id',
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

    return <>
        <Table dataSource={users} columns={getColumns(roles, onChangeRole)} rowKey={'id'}/>
    </>;
}