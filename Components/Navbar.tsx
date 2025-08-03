'use client';

import { usePathname } from 'next/navigation';
import Icon from "@/Components/Icon";
import styles from '@/Components/Navbar.module.css';
import Link from 'next/link';

export default function Navbar(){
  const pathname = usePathname();
  return <>
    <div className={styles.Navbar}>
      <nav className="navbar">
      <div className={styles.container}>
        <div className="navbar-collapse">
          <ul className={styles.navbarNav}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                <Icon />
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/" className={`${styles.navLink} ${pathname==='/' ? styles.active : ''}`}>
              Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about" className={`${styles.navLink} ${pathname.startsWith('/about') ? styles.active : ''}`}>
              About
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/blog" className={`${styles.navLink} ${pathname.startsWith('/blog') ? styles.active : ''}`}>
              Blog
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/work" className={`${styles.navLink} ${pathname.startsWith('/work') ? styles.active : ''}`}>
              Work
              </Link>
            </li>
          </ul>
        </div>
      </div>
      </nav>
    </div>
  </>
};
