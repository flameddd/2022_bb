
const fs = require('fs');
const readline = require('readline');



// const WGET_AWS_IP_RANGE = `wget -O- https://ip-ranges.amazonaws.com/ip-ranges.json | jq -r '[.prefixes[] | select(.service=="AMAZON").ip_prefix] - [.prefixes[] | select(.service=="ES").ip_prefix] | .[]'`

// const WGET_AWS_IP_RANGE2 = `wget -O- https://ip-ranges.amazonaws.com/ip-ranges.json | jq -r '[.prefixes[] | select(.service=="AMAZON").ip_prefix] - [.prefixes[] | select(.service=="ES").ip_prefix]'`

const AWS_SERVICE_TITLE_FILES = `AWS_service_titles.txt`;
const AWS_SERVICE_FILTERD_IPS = `AWS_service_ips.txt`;
const NUMBER_OF_IPs = 50

// // fetch AWS ip range and filter "AMAZON" service's IP
// const awsIPRanges = await quiet($`wget -O- https://ip-ranges.amazonaws.com/ip-ranges.json | jq -r '[.prefixes[] | select(.service=="AMAZON").ip_prefix] - [.prefixes[] | select(.service=="ES").ip_prefix] | .[]'`)

// let IPs = awsIPRanges.stdout.split(/\r?\n/)

// if (NUMBER_OF_IPs > 0) {
//   IPs = IPs.slice(0, NUMBER_OF_IPs) // number of IPs want to scan
// }


// const openedPortIPs =[]

// for (const ip of IPs) {
//   const { stdout
// } = await ($`docker run ilyaglow/masscan -p80,443 --banners --range ${ip}`)
    
//   const splittedOutput = stdout.split(/\r?\n/);
//   let formattedOutput = []
//   if (!!splittedOutput?.length) {
//     formattedOutput = splittedOutput
//       .map(res => {
//         const temp = res.split(' ')
//         if (!temp[5]) {
//           return undefined
//         }
//         // 3: port, 5: ip
//         // ['Discovered', 'open', 'port', '80/tcp', 'on', '3.5.142.165', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
//         return [temp[3], temp[5]]
//       })
//       .filter(data => data)
//   }
//   if (formattedOutput.length) {
//     openedPortIPs.push(...formattedOutput);
//     formattedOutput.forEach(async ([portInfo, ip]) => {
//       const protocol = portInfo === '80/tcp'
//         ? 'http://'
//         : 'https://'
//       await $`echo ${protocol}${ip} >> ${AWS_SERVICE_FILTERD_IPS}`
//     })
//   }
// }

// 上面是 fetch IP 還有 scan 80 443 port

async function fetchTitle(address) {
  try {
    await ($`wget -O- ${address} --tries=3 --no-check-certificate | grep -oE "<title>.*</title>" | xargs echo '${address} - ' >> ./${AWS_SERVICE_TITLE_FILES
      }`)
  } catch (error) {
    console.error(error)
  }
}

const filename = __dirname + `/${AWS_SERVICE_FILTERD_IPS}`;
console.log(filename)
const fileStream = fs.createReadStream(filename);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

for await (const line of rl) {
  await fetchTitle(line)
  // Each line in input.txt will be successively available here as `line`.
  // console.log(`Line from file: ${line}`);
}





/**
 * 後來改成分段跑，所以把上面的資料改成輸出成檔案
 * 下面的要找時間改成吃檔案
 */







// /**
//  * openedPortIPs
//  * [
//  *   ['80/tcp', '3.5.143.161'],
//  *   ['80/tcp', '3.5.140.113'],
//  *   ['80/tcp', '3.5.142.165']
//  * ]
//  */
// // console.log('最後收集到所有IP:', openedPortIPs)
// for (const [portInfo, ip] of openedPortIPs) {
//   try {
//     const protocol = portInfo === '80/tcp'
//       ? 'http://'
//       : 'https://'

//     await($`wget -O- ${protocol}${ip} --no-check-certificate | grep -oE "<title>.*</title>" | xargs echo '${protocol}${ip} - ' >> ./${AWS_SERVICE_TITLE_FILES
//       }`)  

//       // await($`wget -O- ${protocol}${ip} --no-check-certificate | grep -oE "<title>.*</title>" >> ./data.md`)
//   } catch (error) {
//     console.error(error)
//   }
// }
