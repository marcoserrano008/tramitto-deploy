import {Outlet} from "react-router-dom";

function GeneralSecretaryLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default GeneralSecretaryLayout;
