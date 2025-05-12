import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Slider, { Settings } from "react-slick";
import styles from './ApplicantHomePage.module.scss';
import 'primeicons/primeicons.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logoTramitto from "../../../../assets/images/logoTramitto.svg";
import logoUMSS from "../../../../assets/images/logoUMSS.svg";

type WhyItem = {
  icon: string;
  title: string;
};

type ProcessItem = {
  title: string;
  subtitle: string;
};

const whyItems: WhyItem[] = [
  { icon: 'pi pi-lock', title: 'Rápido y seguro' },
  { icon: 'pi pi-check-square', title: '100% Digital' },
  { icon: 'pi pi-map-marker', title: 'Seguimiento en tiempo real' },
  { icon: 'pi pi-file-pdf', title: 'Reducción de Papel y Costos' },
  { icon: 'pi pi-shield', title: 'Seguridad y Privacidad' },
  { icon: 'pi pi-pencil', title: 'Firma Digital Legalmente Válida' },
];

const processItems: ProcessItem[] = [
  { title: 'Legalización', subtitle: 'Diploma de Bachiller' },
  { title: 'Legalización', subtitle: 'Diploma Académico' },
  { title: 'Legalización', subtitle: 'Título Provisión Nacional' },
];

const slickSettings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  swipeToSlide: true,
  centerMode: false,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: false,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: false,
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '40px',
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '20px',
      }
    }
  ]
};

const ApplicantHomePage = () => {
  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>Bienvenido a Tramitto</h1>
          <p>Digitaliza y gestiona tus documentos académicos de forma rápida y segura.</p>
        </div>
        <div className={styles.heroLogos}>
          <img src={logoTramitto} alt="Logo Tramitto" className={styles.logoImage}/>
          <img src={logoUMSS} alt="Logo UMSS" className={styles.logoImage}/>
        </div>
      </section>

      <section className={styles.whySection}>
        <h2 className={styles.processHeader}>¿Por qué usar Tramitto?</h2>
        <div className={styles.carouselWrapper}>
          <Slider {...slickSettings} className={styles.slickSlider}>
            {whyItems.map((item, index) => (
              <div key={`${item.title}-${index}`} className={styles.slickSlide}>
                <div className={styles.whyCard}>
                  <div className={styles.whyLeft}>
                    <i className={`${item.icon} ${styles.whyIcon}`}></i>
                  </div>
                  <div className={styles.whyRight}>
                    <p>{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <section className={styles.processSection}>
        <h2 className={styles.processHeader}>Trámites</h2>
        <div className={styles.processCards}>
          {processItems.map((item, index) => (
            <Card key={`${item.subtitle}-${index}`} className={styles.processCard}>
              <div className={styles.processCardTitle}>{item.title}</div>
              <div className={styles.processCardSubtitle}>{item.subtitle}</div>
              <Button label="Iniciar" icon="pi pi-play" severity="primary" />
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ApplicantHomePage;