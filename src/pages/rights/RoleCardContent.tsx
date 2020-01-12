import React, { ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { rightsSelector } from '../../store/selectors/right';
import Checkbox from 'antd/lib/checkbox';
import { Role } from '../../@types/Entities/Role';
import { addRight, removeRight } from '../../store/Role';

export default function RoleCardContent({role}: {role: Role}): ReactElement {
  const dispatch = useDispatch();
  const rights = useSelector(rightsSelector);
  const [activeRights, setActiveRights] = useState<number[]>(role.rights);

  const updateRgihts = (rights: number[]) => {
    const addedRight = rights.filter(id => !activeRights.includes(id));
    if(addedRight.length > 0) {
      dispatch(addRight(role.id, addedRight[0]));
    } else {
      const removedRight = activeRights.filter(id => !rights.includes(id));
      dispatch(removeRight(role.id, removedRight[0]));
    }

    setActiveRights(rights);
  };

  return <Checkbox.Group style={{ width: '100%' }} onChange={updateRgihts} defaultValue={role.rights}>
    {Object.values(rights).map((right) => <div key={`${role.id}-${right.id}`}>
        <Checkbox value={right.id}>{right.name}</Checkbox>
    </div>
    )}
  </Checkbox.Group>;
}