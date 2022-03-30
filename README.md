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

## 2022-03-30
- `zx ./scan_google_npm.mjs`
- https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610
- 從檔案3 的結果中，如果能看到 `>npm<` 這樣的 title tag 的話，就是我們的目標了
  - 因為 npm 上找不到的頁面會有 404，這時候 title 裡面就只有寫 `npm`，而不是 `name - npm`

但這次似乎沒找到  

來玩看看怎麼掃描出 google 的 npm package library  
目標，找出私人的 package  
作者找了一個方法去掃描 github 上的 repo  
但我目前只想到從 github 組織下找到該組織的 repo 清單  
所以範圍相對限制很多  
