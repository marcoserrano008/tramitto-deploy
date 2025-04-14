import {Outlet} from "react-router-dom";

function GeneralSecretaryLayout() {
  return (
    <div>
      {/* Example: applicant’s navigation bar */}
      <nav>
        <h2>General Secretary Navigation</h2>
        {/* Links, menus, etc. */}
      </nav>

      {/* <Outlet> is where the nested routes will render */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default GeneralSecretaryLayout;
