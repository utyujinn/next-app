import Link from 'next/link';
import Image from 'next/image';
import styles from './style.module.css';

export default function Page() {
  return <>
  <h1>Home</h1>
  <div className="contents">
  <h2>自己紹介</h2>
  <p>
  宇宙から来ました。<br/>
  いろいろなものに興味があります。<br/>
  よろしくお願いします。<br/>
  </p>
  <Image
    src="/icon.jpg"
    width={200}
    height={200}
    alt="Picture of the author"
  />
  </div>
  <div className="contents">
  <h2>経歴</h2>
  <p>
  2025年3月豊田高専情報工学科卒業<br/>
  2025年4月東京大学EEIC編入学<br/>
  </p>
  </div>
  <div className="contents">
  <h2>Links</h2>
  <ul className={styles.ul}>
  <li><Link href="https://x.com/nktssbat">X</Link></li>
  <li><Link href="https://github.com/utyujinn">Github</Link></li>
  <li><Link href="https://vrchat.com/home/user/usr_1a4742e8-5632-487c-b165-5332764d9115">VRChat</Link></li>
  <li><Link href="https://atcoder.jp/users/Utyujin">Atcoder</Link></li>
  </ul>
  </div>
  </>
}
