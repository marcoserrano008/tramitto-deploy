import { Outlet } from 'react-router-dom';

function AdministratorLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdministratorLayout;
