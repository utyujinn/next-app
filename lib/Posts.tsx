import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';
//import fs from 'fs/promises';
import path from 'path';
const fs = require('fs');
const fsPromises = require('fs').promises;


export default async function Posts({
  filename
}: {
  filename: string
}) {
  const markdownFilePath = path.join(process.cwd(),'app/blog/md', `${filename}.md`);
  const markdown:string = await fsPromises.readFile(markdownFilePath, 'utf-8');
  console.log(markdownFilePath);
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {deleteMetadataFromMarkdown(markdown)}
      </ReactMarkdown>
    </div>
  );
}

export async function getSortedPostsData({
  postsDirectory
}:{
  postsDirectory: string
}){
  const postsPath = path.join(process.cwd(), postsDirectory);
  const fileNames:string[] = await fsPromises.readdir(postsPath);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/,'');
      const fullPath = path.join(postsPath, fileName);
      const fileContents = await fsPromises.readFile(fullPath, 'utf-8');

      //const metadata = await extractMetadataFromMarkdown(fileContents);
      const matterResult = matter(fileContents);
      const data = matterResult.data;

      return {
        id,
        title: data.title as string,
        date: data.date as Date,
        tags: data.tags || [],
        //tags: [],
        //...(matterResult.data as {date: Date; title: string; tags?: string[] }),
        //...(metadata as {date: string; title: string; tags?: string[] }),
      };
    })
  );
  return allPostsData.sort((a,b) => {
    if(a.date < b.date){
      return 1;
    }else {
      return -1;
    }
  });
}

export function deleteMetadataFromMarkdown(markdown:string){
  const metadataRegex = /^---([\s\S]*?)---\s*/;
  return markdown.replace(metadataRegex, "");
}

