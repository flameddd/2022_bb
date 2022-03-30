/**
 * 1. fetch google 的 javascript repo
 * 2. 找到 github 網址
 * 3. 找到 package.json raw file 網址
 * 4. 用 jq 找 dep or devdep
 * 5. 確認 npm 上是否存在！！
 */
const fs = require('fs');
const readline = require('readline');


const FILE_1 = 'scan_google_packagejson_1.txt';
const FILE_2 = 'scan_google_packagejson_2.txt';
const FILE_3 = 'scan_google_packagejson_3.txt';

async function fetchGoogleJavaScriptRepos () {

  // handle manunally download files
  return await quiet($`cat ./scan_google_repos.txt |\
    jq -r '.[] | select(.language=="JavaScript").full_name' > ./${FILE_1}`)

  return await quiet($`curl \
 -H "Accept: application/vnd.github.v3+json" \
 https://api.github.com/orgs/google/repos?per_page=100 | \
 jq -r '.[] | select(.language=="JavaScript").full_name' > ./${FILE_1}`)
}


// curl \
// -H "Accept: application/vnd.github.v3+json" \
// https://api.github.com/orgs/google/repos?per_page=100&page=1 > ./scan_google_repos_p1.txt
/**
 * step1
 * 由於第一步，不知道該怎麼結合 page 參數加 jq  
 * 所以後來我手動抓一些資料
 * 希望擴大範圍
 */
// await fetchGoogleJavaScriptRepos()

async function fetchJSPacages () {
  try {
    const googleJSRepoNames = fs
      .createReadStream(__dirname + `/${FILE_1}`);
    const rl = readline.createInterface({
      input: googleJSRepoNames,
      crlfDelay: Infinity
    });
    const result = []
    for await (const repoFullName of rl) {
      try {
        await ($`curl \
          https://raw.githubusercontent.com/${repoFullName}/master/package.json | \
          jq '[.devDependencies] - [.dependencies] | .[] | keys | .[]' \
          >> ./${FILE_2}`
         ) 
      } catch (error) {
        console.error(error)
      }
      // https://github.com/google/kratu
      // https://github.com/google/traceur-compiler
    }
  } catch (error) {
    console.error(error)
  }
  
}

// step2 
// await fetchJSPacages()

async function checkPublicNPM () {
  const packageNames = fs
    .createReadStream(__dirname + `/${FILE_2}`);
  const rl = readline.createInterface({
    input: packageNames,
    crlfDelay: Infinity
  });
  const result = []
  for await (const packageName of rl) {
    const formattedName = packageName.replace(/"|\n/gi, '')

    try {
      await ($`wget -O- https://www.npmjs.com/package/${formattedName} --tries=3 --no-check-certificate | grep -oE "<title data-react-helmet=.*>.*</title>" | xargs echo 'https://www.npmjs.com/package/${formattedName} - ' >> \
         ./${FILE_3}`)
    } catch (error) {

      console.error(error)
    }    
  }
}

// step3
await checkPublicNPM()