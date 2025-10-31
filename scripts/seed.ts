// langchain loader 是RAG的基础功能 txt ,pdf,excel....
// 加载网页内容
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createOpenAI } from "@ai-sdk/openai";
import { embed } from "ai";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { platform } from "os";
import { AI_MODELS, TEXT_CHUNK_CONFIG } from "@/lib/constants";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
);

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

// supabase 去做向量化的知识库数据
console.log("开始向量化知识库数据");
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: TEXT_CHUNK_CONFIG.chunkSize,
  chunkOverlap: TEXT_CHUNK_CONFIG.chunkOverlap,
});

const scrapePage = async (url: string): Promise<string> => {
  // 自动检测系统并设置正确的 Chrome 路径
  const getChromePath = () => {
    const osPlatform = platform();
    switch (osPlatform) {
      case "win32":
        return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
      case "darwin":
        return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
      case "linux":
        return "/usr/bin/google-chrome";
      default:
        return undefined; // 让 puppeteer 自动查找
    }
  };

  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      executablePath: getChromePath(),
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });
  // gm 正则修饰符
  // ^在[^>] 表示不是>的字符
  return (await loader.scrape()).replace(/<[^>]*>?/gm, "");
};

const loadData = async (webpages: string[]) => {
  for (const url of webpages) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for (let chunk of chunks) {
      const { embedding } = await embed({
        model: openai.embedding(AI_MODELS.embedding),
        value: chunk,
      });
      console.log(`处理 chunk，来源: ${url}`);
      const { error } = await supabase.from("chunks").insert({
        content: chunk,
        vector: embedding,
        url: url,
      });
      if (error) {
        console.error("Error inserting chunk:", error);
      }
    }
  }
};

// 知识库的来源，可配置 - 羽毛球相关 Wikipedia 页面
loadData([
  "https://en.wikipedia.org/wiki/Badminton",
  "https://en.wikipedia.org/wiki/Badminton_rules",
  "https://en.wikipedia.org/wiki/Badminton_techniques",
  // 可以添加更多羽毛球相关页面，如：
  "https://en.wikipedia.org/wiki/Shuttlecock",
  "https://en.wikipedia.org/wiki/Badminton_at_the_Summer_Olympics",
  "https://en.wikipedia.org/wiki/List_of_badminton_players",
]);
