import styles from './Footer.module.scss';
import {classNames} from "primereact/utils";

function Footer() {

  return (
    <>
      <section className={classNames(styles['footer'])}>Footer</section>
    </>

  );
}

export default Footer;