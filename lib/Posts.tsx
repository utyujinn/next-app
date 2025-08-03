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
  const markdown = await fsPromises.readFile(markdownFilePath, 'utf-8');
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
  const fileNames = await fsPromises.readdir(postsPath);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/,'');
      const fullPath = path.join(postsPath, fileName);
      const fileContents = await fsPromises.readFile(fullPath, 'utf-8');

      //const metadata = await extractMetadataFromMarkdown(fileContents);
      const matterResult = matter(fileContents);

      return {
        id,
        ...(matterResult.data),
        //...(metadata as {date: string; title: string; tags?: string[] }),
      };
    })
  );
  console.log(allPostsData);
  console.log(allPostsData.sort((a,b) => {
    if(a.date < b.date){
      return 1;
    }else {
      return -1;
    }
  }));
  return allPostsData.sort((a,b) => {
    if(a.date < b.date){
      return 1;
    }else {
      return -1;
    }
  });
}

export function deleteMetadataFromMarkdown(markdown){
  const metadataRegex = /^---([\s\S]*?)---\s*/;
  return markdown.replace(metadataRegex, "");
}

export async function extractMetadataFromMarkdown(markdown){
  const charactersBetweenGroupedHyphens = /^---([\s\S]*?)---/;
  const metadataMatched = markdown.match(charactersBetweenGroupedHyphens);

  if (!metadataMatched || !metadataMatched[1]){
    return {};
  }

  const metadata = metadataMatched[1];
  if (!metadata) {
    return {};
  }
  const metadataLines = metadata.split("\n");
  const metadataObject = metadataLines.reduce((accumulator, line) => {
    const [key, ...value] = line.split(":").map(part => part.trim());

    if(key) {
      accumulator[key] = value[1] ? value.join(":") : value.join("");
    }
    return accumulator;
  }, {});

   return metadataObject;
}
