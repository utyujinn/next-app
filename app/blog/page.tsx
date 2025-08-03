import {getSortedPostsData} from "@/lib/Posts"
import Link from "next/link"
import BlogPanel from "@/Components/BlogPanel"

type Post = {
  id: string;
  title: string;
  tags: string[];
  date: Date;
};

export default async function blog(){
  const years = [2025, 2024];
  const postsGroupedByYear:Post[][] = await Promise.all(
    years.map(year =>
      getSortedPostsData({ postsDirectory: `app/blog/md/${year}` })
    )
  );

  return <>
  <h1>Blog</h1>
  {years.map((year,index) => (
    <div className="contents" key={year}>
      <h2>{year}</h2>
        {postsGroupedByYear[index].map(post => {
          const hrefPath = `/blog/${year}/${post.id}`;
          return (
            <Link href={hrefPath} key={post.id}>
              <BlogPanel
                date={post.date}
                title={post.title}
                tags={post.tags}
              />
            </Link>
          );
        })}
      </div>
     ))}
  </>
}
