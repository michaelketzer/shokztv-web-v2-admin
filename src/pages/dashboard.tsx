import React, { ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { currentUserSelector } from '../store/selectors/currentuser';
import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import PageFrame from '../components/PageFrame';

export default function Dashboard(): ReactElement {
  const currentUser = useSelector(currentUserSelector);

  const hasRoles = useMemo(() => currentUser && currentUser.roles.length > 0, [currentUser]);
  
  return <PageFrame title={'Dashboard'}>
    {!hasRoles &&  <Result
      icon={<SmileOutlined />}
      title="Yeah! Dein Boarding beginnt gerade. Wir müssen dir nur noch eine maßgeschneiderte Rolle zuweisen. Melde dich doch einfach im Discord, dass du es hierhin geschafft hast."
    />}
  </PageFrame>;
}
