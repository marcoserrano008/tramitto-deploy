import { Outlet } from 'react-router-dom';

function ApplicantLayout() {
  return (
    <article className="outlet-container">
      <section className="outlet-container">
        <Outlet/>
      </section>
    </article>
  );
}

export default ApplicantLayout;
