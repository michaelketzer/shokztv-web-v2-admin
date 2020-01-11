import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { rightsSelector } from '../../store/selectors/right';
import Checkbox from 'antd/lib/checkbox';
import { Role } from '../../@types/Entities/Role';

export default function RoleCardContent({role}: {role: Role}): ReactElement {
  const rights = useSelector(rightsSelector);
  const [, setActiveRights] = useState<number[]>(role.rights);

  return <Checkbox.Group style={{ width: '100%' }} onChange={(checked) => setActiveRights(checked as number[])} defaultValue={role.rights}>
    {Object.values(rights).map((right) => <div key={`${role.id}-${right.id}`}>
        <Checkbox value={right.id}>{right.name}</Checkbox>
    </div>
    )}
  </Checkbox.Group>;
}