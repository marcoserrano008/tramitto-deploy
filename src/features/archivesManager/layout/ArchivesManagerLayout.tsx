import {Outlet} from "react-router-dom";

function ArchivesManagerLayout() {
  return (
    <div>
      {/* Example: applicant’s navigation bar */}
      <nav>
        <h2>Archives Manager Navigation</h2>
        {/* Links, menus, etc. */}
      </nav>

      {/* <Outlet> is where the nested routes will render */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default ArchivesManagerLayout;
