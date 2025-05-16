import {Outlet} from "react-router-dom";

function ArchivesManagerLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default ArchivesManagerLayout;
