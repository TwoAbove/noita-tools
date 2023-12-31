import "dotenv-flow/config";
import B2 from "backblaze-b2";
import fs from "fs";

import cliProgress from "cli-progress";

// Copied from src/services/SeedInfo/infoHandler/IRule.ts:
export interface IRule<T = any> {
  id: string;
  type: string;
  params?: any;
  path?: string;
  strict?: boolean;
  // val should be a supported type by the structured clone algorithm:
  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
  val?: T;
}

export enum RuleType {
  AND = "and",
  OR = "or",
  NOT = "not",
  RULES = "rules",
}

export interface ILogicRules {
  id: string;
  type: RuleType.AND | RuleType.OR | RuleType.NOT;
  rules: IRules[];
  selectedRule?: string; // used only in UI
}

export interface IRuleRules {
  id: string;
  type: RuleType.RULES;
  rules: IRule[];
}

export type IRules = IRuleRules | ILogicRules;

const bucketName = "noitool-seed-search";

const b2 = new B2({
  applicationKey: process.env.B2_APP_KEY!,
  applicationKeyId: process.env.B2_APP_KEY_ID!,
});

const getFile = async (fileId: string) => {
  const response = await b2.downloadFileById({
    fileId,
    responseType: "json",
  });

  return response;
};

async function* filesGen(bucketId: string) {
  let startFileName;
  let startFileId;

  while (true) {
    const files = await b2.listFileVersions({
      bucketId,
      startFileName,
      startFileId,
      maxFileCount: 100, // Adjust this number based on your need
    });

    if (!files.data.files.length) break;

    for (const file of files.data.files) {
      yield file;
    }

    startFileName = files.data.nextFileName;
    startFileId = files.data.nextFileId;

    if (!startFileName || !startFileId) break;
  }
}
const downloadFromB2 = async () => {
  await b2.authorize();
  const stats = await b2.getBucket({ bucketName });

  const bucket = stats.data.buckets[0];

  const fullJson: any[] = [];

  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  const fileIds: string[] = [];

  for await (const file of filesGen(bucket.bucketId)) {
    fileIds.push(file.fileId);
  }

  bar1.start(fileIds.length, 0);

  const download = async (fileId: string) => {
    const json = await getFile(fileId);
    fullJson.push(json.data);
  };

  const processInBatches = async (files: string[], batchSize: number): Promise<void> => {
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const promises = batch.map(fileId => download(fileId));
      await Promise.allSettled(promises);
      bar1.update(i);
    }
  };

  await processInBatches(fileIds, 40);

  bar1.stop();

  console.log(fullJson);

  const fullerJson = fullJson.map((json: string) => JSON.parse(json));

  fs.writeFileSync("./src/out/fullJson.json", JSON.stringify(fullerJson, null, 2));
};

const fileExistsSync = (path: string) => {
  try {
    fs.statSync(path);
    return true;
  } catch (e) {
    return false;
  }
};

const parseFiles = (fullJson: any): IRules[] => {
  if (fileExistsSync("./src/out/rules.json")) {
    return JSON.parse(fs.readFileSync("./src/out/rules.json", "utf8"));
  }
  // filter out {} and nulls from [{data}] and [{stats}]
  let filteredJson = fullJson
    .map((json: any) => {
      const filteredData = json.data
        ?.filter((data: any) => {
          return Object.keys(data).length !== 0;
        })
        .filter((d: any) => !d.lcIngredientsSelected);
      const filteredStats = json.stats?.filter((stats: any) => {
        return Object.keys(stats).length !== 0;
      });
      if (!filteredData && !filteredStats) {
        return null;
      }
      if (filteredData.length === 0 && filteredStats.length === 0) {
        return null;
      }
      return {
        data: filteredData,
        stats: filteredStats,
      };
    })
    .filter(Boolean)
    .reduce(
      (acc: any, curr: any) => {
        acc.data.push(...curr.data);
        acc.stats.push(...curr.stats);
        return acc;
      },
      { data: [], stats: [] },
    );

  fs.writeFileSync("./src/out/rules.json", JSON.stringify(filteredJson.data, null, 2));
  return filteredJson.data;
};

const getRuleStats = (rules: IRules[]) => {
  const ruleStats: { [ruleType: string]: number } = {};

  const getRuleStat = (rule: IRule<any> | IRules) => {
    // Count the number of rules of each type
    if (!ruleStats[rule.type]) {
      ruleStats[rule.type] = 0;
    }
    ruleStats[rule.type] += 1;
    if ("rules" in rule && rule.rules.length) {
      rule.rules.forEach(getRuleStat);
    }
  };

  rules.forEach(getRuleStat);

  return ruleStats;
};

(async () => {
  if (!fileExistsSync("./src/out/fullJson.json")) {
    await downloadFromB2();
  }

  const fullJson = JSON.parse(fs.readFileSync("./src/out/fullJson.json", "utf8"));

  const rules = parseFiles(fullJson);

  console.table(getRuleStats(rules));
})();

export {};
