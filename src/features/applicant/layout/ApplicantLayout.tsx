import { Outlet } from 'react-router-dom';

function ApplicantLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default ApplicantLayout;
