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
    // 'app/blog/md/' の部分を削除し、拡張子 '.md' を取り除く
    const slugArray = file
      .substring(postsDirectory.length + 1)
      .replace(/\.md$/, '')
      .split(path.sep);
      
    return {
      slug: slugArray,
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
