import styles from './Footer.module.scss';
import { classNames } from "primereact/utils";
import logoDTIC from "../../assets/images/logoDTIC.svg";

function Footer() {
  return (
    <footer className={classNames(styles['footer'])}>
      <div className={styles.footerContent}>
        <div className={styles.logoSection}>
          <img src={logoDTIC} alt="Logo DTIC" className={styles.footerLogo} />
        </div>

        <div className={styles.contactSection}>
          <h3 className={styles.contactTitle}>Contáctanos</h3>
          <p className={styles.contactInfo}>DTIC, UMSS Campus central - Teléfono: 46894213 - 79333499</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;