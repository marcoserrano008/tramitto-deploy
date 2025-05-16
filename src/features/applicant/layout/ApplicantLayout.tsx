import { Outlet } from 'react-router-dom';
import styles from './ApplicantLayout.module.scss';

function ApplicantLayout() {
  return (
    <article className={styles.outletContainer}>
      <section  className="outlet-container">
        <Outlet/>
      </section>
    </article>
  );
}

export default ApplicantLayout;
