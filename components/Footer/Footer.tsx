import Link from 'next/link';
import css from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Milka</p>
          <p>
            Contact us: 
            <Link href="mailto: miladiachenko2404@gmail.com">miladiachenko2404@gmail.com</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;