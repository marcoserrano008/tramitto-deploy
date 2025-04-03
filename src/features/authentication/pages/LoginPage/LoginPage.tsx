import styles from './LoginPage.module.scss';
import {classNames} from "primereact/utils";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {useState} from "react";
import * as React from "react";
import {Button} from "primereact/button";

const LoginPage = () => {
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const load = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  return (
    <div className={classNames(styles['login-container'])}>
      <article className={classNames(styles['login-form'])}>
        <h2 className={classNames(styles['login-form-title'])}>Ingresar</h2>

        <section className={classNames(styles['login-form-data'])}>
          <div className={classNames(styles['login-form-field'])}>
            <label htmlFor="username">Usuario</label>
            <InputText
              id="username"
              aria-describedby="username-help"
              className={classNames(styles['login-form-field-input'])}
            />
          </div>

          <div className={classNames(styles['login-form-field'])}>
            <label htmlFor="password">Contraseña</label>
            <Password
              id="password"
              className={classNames(styles['login-form-field-input'])}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
            />
          </div>


        </section>

        <section className={classNames(styles['login-form-actions'])}>
          <section>
            <label>¿No tienes cuenta? <a href={''}>Registrate</a></label>
          </section>
          <Button label="Iniciar Sesion" loading={loading} onClick={load}/>
          <Button label="Iniciar Sesión con Google" icon="pi pi-google" onClick={load}/>

        </section>

      </article>
    </div>
  );
};
export default LoginPage;