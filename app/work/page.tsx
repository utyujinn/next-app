import Link from 'next/link'
import Image from 'next/image'

export default function Page() {
  return <>
  <h1>Work</h1>

  <div className="contents">
  <h2>マウスカーソル</h2>
  <p>
  原神の主人公、Lumineの動くマウスカーソルです。<br/>
  <Link href='https://utyujin.booth.pm/items/5570185'>
  <Image 
    src="/work/images/lumine_cursor.jpg"
    width={200}
    height={200}
    alt="Lumine_cursor"
  />
  </Link>
  </p>
  </div>
  </>
}
