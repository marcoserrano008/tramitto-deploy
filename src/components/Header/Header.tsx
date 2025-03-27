import styles from './Header.module.scss'
import {classNames} from "primereact/utils";

function Header() {

  return (
    <>
      <section className={classNames(styles['header'])}>Header</section>
    </>
  )
}

export default Header;
