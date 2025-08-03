import fs from 'fs';
import path from 'path';
import Posts from "@/lib/Posts"
import "./layout.css"

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'app/blog/md');

  const getFiles = (dir: string): string[] => {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files = dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    });
    return Array.prototype.concat(...files);
  };

  const allFiles = getFiles(postsDirectory);

  return allFiles.map((file) => {
    const slugArray = file
      .substring(postsDirectory.length + 1)
      .replace(/\.md$/, '')
      .split(path.sep);

    const encodedSlugArray = slugArray.map(segment => encodeURIComponent(segment));

    return {
      slug: encodedSlugArray,
    };
  });
}


export default async function Page({
  params,
}: {
  params: { 
    slug: string[];
  }
}) {
  const { slug } = await params;
  const decodedSlug = slug.map(segment => decodeURIComponent(segment));
  const postPath = decodedSlug.join("/");
  return <>
  <div className="container">
  <Posts filename={postPath}/>
  </div>
  </>
}
