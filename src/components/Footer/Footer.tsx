import styles from './Footer.module.scss';
import {classNames} from "primereact/utils";

function Footer() {
  return (
    <footer className={classNames(styles['footer'])}>
      <div className={styles.footerContent}>
        <div className={styles.logoSection}>
          <strong>Code Solutions © </strong>
        </div>

        <div className={styles.contactSection}>
          <h3 className={styles.contactTitle}>Contáctanos</h3>
          <p className={styles.contactInfo}>Teléfonos: (+591 4)46894213 - (+591)79333499</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;