import Posts from "@/lib/Posts"
import "./layout.css"

export default async function Page({
  params,
}: {
  params: { 
    slug: string[];
  }
}) {
  const { slug } = params;
  const decodedSlug = slug.map(segment => decodeURIComponent(segment));
  const postPath = decodedSlug.join("/");
  return <>
  <h1>{decodedSlug[slug.length-1]}</h1>
  <div className="container">
  <Posts filename={postPath}/>
  </div>
  </>
}

