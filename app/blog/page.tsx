import {getSortedPostsData} from "@/lib/Posts"
import Link from "next/link"
import BlogPanel from "@/Components/BlogPanel"

export default async function blog(){
  const years = [2025, 2024];
  const allPostsData = await Promise.all(
    years.map(year =>
      getSortedPostsData({ postsDirectory: `app/blog/md/${year}` })
    )
  );
  const postsByYear = years.reduce((acc, year, index) => {
    acc[year] = allPostsData[index];
    return acc;
  }, {});

  return <>
  <h1>Blog</h1>
  {years.map(year => (
    <div className="contents" key={year}>
      <h2>{year}</h2>
        {postsByYear[year].map(post => {
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
