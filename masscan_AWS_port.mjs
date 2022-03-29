
// const WGET_AWS_IP_RANGE = `wget -O- https://ip-ranges.amazonaws.com/ip-ranges.json | jq -r '[.prefixes[] | select(.service=="AMAZON").ip_prefix] - [.prefixes[] | select(.service=="ES").ip_prefix] | .[]'`

// const WGET_AWS_IP_RANGE2 = `wget -O- https://ip-ranges.amazonaws.com/ip-ranges.json | jq -r '[.prefixes[] | select(.service=="AMAZON").ip_prefix] - [.prefixes[] | select(.service=="ES").ip_prefix]'`

const OUTPUT_FILE_NAME = `AWS_service_titles.txt`;
const NUMBER_OF_IPs = 5

// fetch AWS ip range and filter "AMAZON" service's IP
const awsIPRanges = await quiet($`wget -O- https://ip-ranges.amazonaws.com/ip-ranges.json | jq -r '[.prefixes[] | select(.service=="AMAZON").ip_prefix] - [.prefixes[] | select(.service=="ES").ip_prefix] | .[]'`)

let IPs = awsIPRanges.stdout.split(/\r?\n/)

if (NUMBER_OF_IPs > 0) {
  IPs = IPs.slice(0, NUMBER_OF_IPs) // number of IPs want to scan
}


const openedPortIPs =[]

for (const ip of IPs) {
  const { stdout
} = await ($`docker run ilyaglow/masscan -p80,443 --banners --range ${ip}`)
    
  const splittedOutput = stdout.split(/\r?\n/);
  if (!!splittedOutput?.length) {
    openedPortIPs.push(...splittedOutput
      .map(res => {
        const temp = res.split(' ')
        if (!temp[5]) {
          return undefined
        }
        // 3: port, 5: ip
        // ['Discovered', 'open', 'port', '80/tcp', 'on', '3.5.142.165', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
        return [temp[3], temp[5]]
      })
      .filter(data => data)
    )
  }
}

/**
 * openedPortIPs
 * [
 *   ['80/tcp', '3.5.143.161'],
 *   ['80/tcp', '3.5.140.113'],
 *   ['80/tcp', '3.5.142.165']
 * ]
 */
// console.log('最後收集到所有IP:', openedPortIPs)
for (const [portInfo, ip] of openedPortIPs) {
  try {
    const protocol = portInfo === '80/tcp'
      ? 'http://'
      : 'https://'

    await($`wget -O- ${protocol}${ip} --no-check-certificate | grep -oE "<title>.*</title>" | xargs echo '${protocol}${ip} - ' >> ./${OUTPUT_FILE_NAME
      }`)  

      // await($`wget -O- ${protocol}${ip} --no-check-certificate | grep -oE "<title>.*</title>" >> ./data.md`)
  } catch (error) {
    console.error(error)
  }
}
