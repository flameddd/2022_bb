# 2022_bb

## 2022-03-29
- masscan scan AWS CIDR port
- keyword: masscan CIDR ElasticSearch zx 掃ip port 抓html title
  - `ilyaglow/masscan`
- ref
  - https://infosecwriteups.com/how-i-discovered-thousands-of-open-databases-on-aws-764729aa7f32
- `zx ./masscan_AWS_port.mjs`
  - 程式稍微調整過，分兩段跑
  - 另外未來也要注意 retry 的次數，wget 預設 20 次太多了  

