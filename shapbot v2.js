const scriptName = "shapbotv2";
//Copyrightⓒ2021 SHAPER
//All rights reserved.
/**
참고!
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */

const SafeEval = {
  //SafeEval [세이프이발]은 OnTheWay(하연)님이 만드셨습니다!
  //감사합니다!
  toSecureString: function (obj, isError) {
    if (obj == null || obj == undefined || typeof obj.toString != "function") {
      return "Object is Empty (NULL / Undefined)";
    }

    try {
      return isError ? (obj.name + ": " + obj.message + " (" + obj.fileName + "#" + obj.lineNumber + ")") : obj.toString();
    } catch (err) {
      return "Security Error";
    }
  },

  run: function (src, name, timeout, depth, isClassVisible, objData) {
    var factory = org.mozilla.javascript.ContextFactory.getGlobal();
    var cx = factory.enterContext();
    var scope = cx.initSafeStandardObjects();
    var field = cx.class.getDeclaredField("hasClassShutter");
    var result;

    field.setAccessible(true);
    field.setBoolean(cx, false);

    cx.setOptimizationLevel(-1);
    cx.setInstructionObserverThreshold(timeout ? timeout : 3000);
    cx.setMaximumInterpreterStackDepth(depth ? depth : 1000);
    cx.setLanguageVersion(org.mozilla.javascript.Context.VERSION_ES6);
    cx.getWrapFactory().setJavaPrimitiveWrap(false);

    cx.setClassShutter(new org.mozilla.javascript.ClassShutter({
      visibleToScripts: function (fullClassName) {
        return isClassVisible != false && fullClassName != "org.mozilla.javascript.EcmaError";
      }
    }));

    org.mozilla.javascript.ScriptableObject.putProperty(scope, "CallSite", function () { });

    org.mozilla.javascript.ScriptableObject.putProperty(scope, "\x67\x65\x74\x41\x75\x74\x68\x6F\x72", function () {
      return "\x4F\x6E\x54\x68\x65\x57\x61\x79";
    });

    if (objData) {
      for (var key in objData) {
        org.mozilla.javascript.ScriptableObject.putProperty(scope, key, objData[key]);
      }
    }

    try {
      result = SafeEval.toSecureString(cx.evaluateString(scope, src ? src : "", name ? name : "SafeEval.js", 1, null), false);
    } catch (err) {
      result = SafeEval.toSecureString(err, true);
    }

    cx.exit();

    return result;
  }
};

const admin = {};
let chatlog = {};
let key;
let prefix = "#"
const test = {};
let allsee = "\u200b".repeat(500) + "\n\n";
//game
let shapbotgame = {};
shapbotgame = JSON.parse(FileStream.read("/sdcard/botgame/list.json")) != null || undefined ? JSON.parse(FileStream.read("/sdcard/botgame/list.json")) : {};


//kalink(그저 흔한 뻘짓)
let arr = [1391, 1261, 1391, 1261, 1443, 1404, 1365, 1430, 1391, 1495, 1313, 1508, 1508, 1365, 1430, 1339, 1495, 598, 1378, 1495, 1443, 1430];
let arr2 = [];
for (let s = 0; s < arr.length; s++) {
  arr2.push(String.fromCharCode(arr[s] / 13));
}
let kalink = JSON.parse(DataBase.getDataBase(arr2.join("")));
arr2 = null;

const { KakaoLinkClient } = require('kakaolink');
const Kakao = new KakaoLinkClient(kalink["key"], 'https://youtube.com');
Kakao.login(kalink["mail"], kalink["password"]);

function timeForToday(value) {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
  if (betweenTime < 1) return '방금전';
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`;
}

function tdc(a, b, s) {
  let time = "";
  let day = new Date();
  let h = String(day.getHours());
  let m = String(day.getMinutes());
  if (h <= 9) h = "0" + h;
  if (m <= 9) m = "0" + m;
  a = String(a); b = String(b);
  s = " ".repeat(Number(s));
  let key = [a + a + a, b + b + a, a + b + b, b + a + b, a + b + a, b + b + b];
  let num = [[0, 4, 4, 4, 0], [1, 1, 1, 1, 1], [0, 1, 0, 2, 0], [0, 1, 0, 1, 0], [4, 4, 0, 1, 1], [0, 2, 0, 1, 0], [0, 2, 0, 4, 0], [0, 4, 4, 1, 1], [0, 4, 0, 4, 0], [0, 4, 0, 1, 0], [5, 3, 5, 3, 5]];
  for (let i = 0; i < num.length; i++) {
    for (let u = 0; u < num[i].length; u++) {
      num[i][u] = key[num[i][u]];
    }
  }
  for (var i = 0; i < 5; i++) {
    time += num[h[0]][i] + s + num[h[1]][i] + s + num[10][i] + s + num[m[0]][i] + s + num[m[1]][i] + "\n";
  }
  return time;
}

function lolstate(f) {
  let data = org.jsoup.Jsoup.connect("https://www.op.gg/summoner/userName=" + encodeURI(f)).get();
  let result = [];

  for (let i = 0; i < 20; i++) {
    result.push({});
    try {
      result[i]["kda"] = data.select("div[class=GameItemWrap]").select(".Content").select(".KDA .KDA").get(i).text();
      result[i]["champ"] = data.select("div[class=GameItemWrap]").select(".ChampionName").select("a[target=_blank]").get(i).text();
      result[i]["champimg"] = data.select(".ChampionImage").select("a[href]").select("img[class=Image]").get(i).attr("src").toString().replace("//", "http://");
      result[i]["ratio"] = data.select(".KDARatio").select("span[class=KDARatio]").get(i).text() != null ? data.select(".KDARatio").select("span[class=KDARatio]").get(i).text() : "";
      result[i]["gametype"] = data.select(".GameType").get(i).text();
      result[i]["gameago"] = data.select(".TimeStamp").get(i).text();
      result[i]["gameresult"] = data.select(".GameResult").get(i).text();
      result[i]["gamelength"] = data.select(".GameLength").get(i).text();
      result[i]["cs"] = data.select(".GameItemWrap").not(".Stats > .CS > span").select(".Stats > .CS").get(i).text();
      result[i]["lvl"] = data.select(".Stats").select(".Level").get(i).text();
      result[i]["ckrate"] = data.select(".Stats").select(".CKRate").get(i).text().replace("P/Kill ", "");
      if (data.select(".Content > .KDA").not(".KDA > span").get(i).select(".MultiKill") != null) {
        result[i]["multikill"] = data.select(".Content > .KDA").not(".KDA > span").get(i).select(".MultiKill").text();
      }
      if (data.select(".Content > .KDA").not(".KDA > span").get(i).select(".Badge") != null) {
        result[i]["badge"] = data.select(".Content > .KDA").not(".KDA > span").get(i).select(".Badge").text();
      }
    } catch (e) {

    }
  }
  return result;

}


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if (chatlog[room] == undefined) {
    chatlog[room] = [];
  }
  let day = new Date();
  let hour = day.getHours() <= 9 ? "0" + String(day.getHours()) : day.getHours();
  let min = day.getMinutes() <= 9 ? "0" + String(day.getMinutes()) : day.getMinutes();
  let sec = day.getSeconds() <= 9 ? "0" + String(day.getSeconds()) : day.getSeconds();

  chatlog[room].push({ "time": hour + ":" + min + ":" + sec, "sender": sender, "msg": msg });
  if (msg.startsWith(prefix)) {
    msg = msg.slice(prefix.split("").length);
    if (msg == "ㅎㅇ") {
      replier.reply("ㅎㅇㅎㅇ");
    }
    if (msg.startsWith("타이머")) {
      msg = msg.replace("타이머 ", "").replace(/([^0-9])/g, '');
      if (msg <= 3600) {
        if (Api.getActiveThreadsCount() < 5) {
          replier.reply(msg + "초 타이머가 시작되었습니다!");
          for (let i = 0; i <= msg; i++) {
            java.lang.Thread.sleep(1000);
          }
          replier.reply(msg + "초가 끝났습니다!");
        } else {
          replier.reply("현재 작동중인 스레드가 많아 실행할 수 없습니다");
        }
      } else {
        replier.reply("[!] 너무 숫자가 큽니다");
      }
    }
    if (msg == "테스트") {
      replier.reply("true");
    }
    if (msg.startsWith("로그")) {
      if (msg == "로그") {
        let ar1 = [];
        for (let i = 0; i < chatlog[room].length; i++) {
          ar1.push(`[${chatlog[room][i]["time"]}] [${chatlog[room][i]["sender"]}] : ${chatlog[room][i]["msg"]}`);
        }
        replier.reply(room + "의 채팅로그입니다" + "\u200b".repeat(500) + "\n\n" + ar1.reverse().join("\n"));
      } else {
        msg = msg.replace('로그 ', '');
        if (chatlog[msg] != null || undefined) {
          let ar1 = [];
          for (let i = 0; i < chatlog[msg].length; i++) {
            ar1.push(`[${chatlog[msg][i]["time"]}] [${chatlog[msg][i]["sender"]}] : ${chatlog[msg][i]["msg"]}`);
          }
          replier.reply(msg + "의 채팅로그입니다" + "\u200b".repeat(500) + "\n\n" + ar1.reverse().join("\n"));
        } else {
          replier.reply("해당 " + msg + "방의 로그를 찾을 수 없습니다");
        }
      }
    }
    if (msg == "인증") {
      if (admin[sender] == undefined || null) {
        if (room == "샾봇 관리방") {
          admin[sender] = imageDB.getProfileSHA();
          replier.reply("인증 완료!");
        }
        else if (Api.canReply("샾봇 관리방")) {
          key = java.util.UUID.randomUUID().toString().replace(/-/g, "");
          replier.reply("샾봇 관리방으로 인증코드가 전송되었습니다!");
          replier.reply("샾봇 관리방", key);
        } else {
          replier.reply("샾봇 관리방이 활성화되지 않았습니다!");
        }
      } else {
        replier.reply("당신은 이미 인증하셨습니다!");
      }
    }
    if (msg.startsWith("인증코드 ")) {
      if (msg.slice(5) == key) {
        admin[sender] = imageDB.getProfileSHA();
        replier.reply("인증 완료!");
        key = null;
        delete key;
      } else {
        replier.reply("인증코드가 틀렸습니다! 다시 시도해 주세요!");
      }

    }
    if (msg.startsWith("이발 ")) {
      if (admin[sender] == imageDB.getProfileSHA()) {
        try {
          replier.reply(eval(msg.slice(3)));
        } catch (e) {
          replier.reply(e + "\n\nErrorLine:" + e.lineNumber);
        }
      } else {
        replier.reply("당신은 관리자가 아닙니다!\n\n" + Math.random());
      }
    }
    if (msg == "시계") {
      replier.reply("[ " + hour + ":" + min + " ]" + allsee + tdc("█", "▓", 1));
    }
    if (msg.startsWith("커시")) {
      let first = msg.replace("커시 ", "").split(",")[0];
      let second = msg.replace("커시 ", "").split(",")[1];
      let third = msg.replace("커시 ", "").split(",")[2];
      replier.reply("[ " + hour + ":" + min + " ]" + allsee + tdc(first, second, Number(third)));
    }
    if (msg.startsWith("도박 ")) {
      if (shapbotgame[sender] == null || undefined) {
        replier.reply("[!] 신규 유저이므로 자동으로 회원가입 되셨습니다");
        shapbotgame[sender] = { minepam: { mineral: { wood: 0, stone: 0, coal: 0, iron: 0, gold: 0, diamond: 0 }, item: { pickaxe: "wooden" } }, exp: 0, level: 0, money: 1000, id: imageDB.getProfileSHA() }; //나무,조약돌,석탄,철,금,다이아      
      } else {
        if (shapbotgame[sender].id == imageDB.getProfileSHA()) {
          let setmoney = Number(msg.replace(/[^0-9]/g, ""));
          if (msg.isNaN == true) {
            replier.reply("숫자만 써주세요");
          } else {

            if (setmoney > shapbotgame[sender].money) {
              replier.reply("돈이 부족합니다\n현재 돈:" + shapbotgame[sender].money + "\n(" + prefix + "광질 또는 " + prefix + "벌목을 해서 돈을 버십쇼)");
            } else {
              let sucessof = Math.round(Math.random() * 1)
              if (sucessof == 1) {
                let random = Number(((Math.random() + 1) * 2).toFixed(2));
                let finalmoney = Math.floor(setmoney * random);
                shapbotgame[sender].money += finalmoney;
                replier.reply("🎰도박 결과🎰\n\n기본 잔액: " + (shapbotgame[sender].money - finalmoney) + "\n현재 잔액: " + shapbotgame[sender].money + "\n\n총 이익:" + finalmoney + " (약 " + random + ")\n실행한 사람:" + sender);
              } else {
                shapbotgame[sender].money -= setmoney;
                replier.reply("🎰도박 결과🎰\n\n기본 잔액: " + (shapbotgame[sender].money + setmoney) + "\n현재 잔액: " + shapbotgame[sender].money + "\n\n손해 : " + setmoney + "\n실행한 사람: " + sender);
              }
            }
          }
        } else {
          replier.reply("당신의 이름과 프로필이 일치하지 않습니다. 본인일 경우 관리자에게 문의 바랍니다.");
        }
      }
    }
    if (msg.startsWith("벌목" || "나무캐기" || "나무")) {
      if (shapbotgame[sender] == undefined) {
        replier.reply("[!] 신규 유저이므로 자동으로 회원가입 되셨습니다");
        shapbotgame[sender] = { minepam: { mineral: { wood: 0, stone: 0, coal: 0, iron: 0, gold: 0, diamond: 0 }, item: { pickaxe: "wooden" } }, exp: 0, level: 0, money: 1000, id: imageDB.getProfileSHA() }; //나무,조약돌,석탄,철,금,다이아      
      } else {
        if (shapbotgame[sender].id == imageDB.getProfileSHA()) {
          let firstwood = shapbotgame[sender].minepam.mineral.wood;
          switch (shapbotgame[sender].minepam.item.pickaxe) {

            case "wooden":
              shapbotgame[sender].minepam.mineral.wood += Math.round(Math.random() * 10);
              break;

            case "stone":
              shapbotgame[sender].minepam.mineral.wood += Math.round(Math.random() * 20);
              break;

            case "iron":
              shapbotgame[sender].minepam.mineral.wood += Math.round(Math.random() * 40);
              break;

            case "diamond":
              shapbotgame[sender].minepam.mineral.wood += Math.round(Math.random() * 100);
              break;

          }
          replier.reply("[🪓] 나무 캐는중...");
          java.lang.Thread.sleep(4000);
          let secondwood = shapbotgame[sender].minepam.mineral.wood;
          shapbotgame[sender]["exp"] += (secondwood - firstwood) * 200;
          replier.reply("[🪓] 벌목 결과\n\n[🌳] 캔 나무 수 : +" + (secondwood - firstwood) + "개\n[🌳] 보유 나무 수 : " + shapbotgame[sender].minepam.mineral.wood + "개\n도구 : [" + shapbotgame[sender].minepam.item.pickaxe + " axe]\n\n• exp : +" + (secondwood - firstwood) * 200 + "\n• 시킨 사람 : " + sender);
        } else {
          replier.reply("[!]프로필 사진이 같지 않습니다!\n같은 사람일 경우 관리자에게 문의해주세요");
        }
      }
    }
    if (msg.startsWith("광질")) {

      if (shapbotgame[sender] == undefined) {
        replier.reply("[!] 신규 유저이므로 자동으로 회원가입 되셨습니다");
        shapbotgame[sender] = { minepam: { mineral: { wood: 0, stone: 0, coal: 0, iron: 0, gold: 0, diamond: 0 }, item: { pickaxe: wooden } }, exp: 0, level: 0, money: 1000, id: imageDB.getProfileSHA() }; //나무,조약돌,석탄,철,금,다이아      
      } else {
        if (shapbotgame[sender].id == imageDB.getProfileSHA()) {
          var s = Math.round(Math.random() * 250);
          switch (shapbotgame[sender].minepam.item.pickaxe) {

            case "wooden":
              s = Math.floor(s / 4);
              for (let i = 0; i <= s; i++) {
                shapbotgame[sender].minepam.mineral.stone += 1;
                shapbotgame[sender].minepam.mineral.coal += Math.floor(Math.random() * 2) + 1;
              }
              break;

            case "stone":
              s = Math.floor(s / 3);
              for (let i = 0; i <= s; i++) {
                shapbotgame[sender].minepam.mineral.stone += 2;
                shapbotgame[sender].minepam.mineral.coal += Math.floor(Math.random() * 3) + 1;
                shapbotgame[sender].minepam.mineral.iron += Math.floor(Math.random() * 2) + 1;
              }
              break;

            case "iron":
              s = Math.floor(s / 2);
              for (let i = 0; i <= s; i++) {
                shapbotgame[sender].minepam.mineral.stone += 1;
                shapbotgame[sender].minepam.mineral.coal += Math.floor(Math.random() * 3) + 1;
                shapbotgame[sender].minepam.mineral.iron += Math.floor(Math.random() * 2) + 1;
                shapbotgame[sender].minepam.mineral.gold += Math.floor(Math.random() * 2) + 1;
                shapbotgame[sender].minepam.mineral.diamond += Math.floor(Math.random() * 7) == 2 ? 2 : 0;
              }


              break;

            case "diamond":
              for (let i = 0; i <= s; i++) {
                shapbotgame[sender].minepam.mineral.stone += 1;
                shapbotgame[sender].minepam.mineral.coal += Math.floor(Math.random() * 3) + 1;
                shapbotgame[sender].minepam.mineral.iron += Math.floor(Math.random() * 2) + 1;
                shapbotgame[sender].minepam.mineral.gold += Math.floor(Math.random() * 2) + 1;
                shapbotgame[sender].minepam.mineral.diamond += Math.floor(Math.random() * 3) == 2 ? 4 : 0;
              }

              break;

          }
          let wait1 = Math.round(Math.random() * 200) * 50;
          let wait2 = Math.round(Math.random() * 250) * 30;
          replier.reply("[⛏]지하 광산에서 광물 캐는중.." + "\n" + "도구:[" + shapbotgame[sender].minepam.item.pickaxe + " pickaxe]");
          java.lang.Thread.sleep(wait1);
          let nogada = ["[⛏] 지하 광산에서 노가다중...탁탁ㅌ", "[⛏]지하 광산에서 청소중", "[⛏]지하 광산에서 자는중...zzZ", "[⛏]지하 광산에서 열심히 일하는중"]
          replier.reply(nogada[Math.floor(Math.random() * 4)]);
          java.lang.Thread.sleep(wait2);
          shapbotgame[sender]["exp"] += (wait1 + wait2) / 2;
          replier.reply("[⛏] 광질 결과\n\n[🪨] 조약돌 : " + shapbotgame[sender].minepam.mineral.stone + "개\n[🌑] 석탄 : " + shapbotgame[sender].minepam.mineral.coal + "개\n[📎] 철 :" + shapbotgame[sender].minepam.mineral.iron + "개\n[🪙] 금 : " + shapbotgame[sender].minepam.mineral.gold + "개\n[💎] 다이아 : " + shapbotgame[sender]["minepam.mineral.diamond"] + "개\n\n• exp : +" + (wait1 + wait2) / 10 + "\n• 시킨 사람 : " + sender);
        } else {
          replier.reply("[!]프로필 사진이 같지 않습니다!\n같은 사람일 경우 관리자에게 문의해주세요");
        }
      }
    }
    /** //가격 변동 시스템 만들고 만들것임
    if (msg.startsWith("판매")) {
      let miner = msg.replace("판매 ", "").split(" ")[0];
      let count = Number(msg.replace("판매 ", "").split(" ")[1]);
      if (count.isNaN == true) {
        replier.reply(`사용법 : ${prefix}판매 (광물) (숫자)\n\n예시 : ${prefix}판매 돌 3\n(=돌 3개를 팜)`)
      } else {
        switch (miner) {
          case "다이아" || "diamond" || "다이아몬드" || "dia" || "다야":
            if (shapbotgame[sender].minepam.mineral.diamond > 0) {
              shapbotgame[sender].minepam.mineral.diamond
            }
            break;

        }
      }

    }
    */

    if (msg == "카링") {
      Kakao.sendLink(room, {
        template_id: 68684, //템플릿 아이디 5자리 
        template_args: { key: hour + "시 " + min + "분 " + sec + "초" }
      }, 'custom');
    }
    if (msg.startsWith("롤전적 ")) {
      msg = msg.replace("롤전적 ", "");
      let time = java.lang.System.currentTimeMillis();
      let lol = lolstate(msg);

      let arr = [];
      for (let i = 0; i < 20; i++) {
        arr.push(`▣――――― ${lol[i]["gameago"]} ―――――▣\n\n
           - 승/패 : ${lol[i]["gameresult"]}\n
           - K/D/A : ${lol[i]["kda"]}\n
           - 게임 타입 : ${lol[i]["gametype"]}\n
           - 게임 타임 : ${lol[i]["gamelength"]}\n
           - 챔피언 : ${lol[i]["champ"]}\n
           - 평점 : ${lol[i]["ratio"]}\n
           - 레벨 : ${lol[i]["lvl"]}\n
           - 킬관여 : ${lol[i]["ckrate"]}\n
           ${lol[i]["multikill"] != "" ? "- 멀티킬 : " + lol[i]["multikill"] : ""}\n
           ${lol[i]["badge"] != "" ? "- 벳지 : " + lol[i]["badge"] : ""}\n\n`);

      }

      replier.reply(`#${msg}님의 롤전적\n${allsee}${arr.join("\n")}`);

      Kakao.sendLink(room, {
        template_id: 38804, //템플릿 아이디 5자리 
        template_args: {
          title: msg + " 님의 롤전적",

          a: "[ 승/패 : " + lol[0]["gameresult"] + " ][ " + lol[0]["champ"] + " ]\n[ K/D/A : " + lol[0]["kda"] + " ]",
          a1: lol[0]["gametype"] + "전 | " + lol[0]["gamelength"] + " | " + lol[0]["cs"] + " | 킬관여:" + lol[0]["ckrate"] + " | 평점 :" + lol[0]["ratio"],
          a2: lol[0]["champimg"],

          b: "[ 승/패 : " + lol[1]["gameresult"] + " ][ " + lol[1]["champ"] + " ]\n[ K/D/A : " + lol[1]["kda"] + " ]",
          b1: lol[1]["gametype"] + "전 | " + lol[1]["gamelength"] + " | " + lol[1]["cs"] + " | 킬관여:" + lol[1]["ckrate"] + " | 평점 :" + lol[1]["ratio"],
          b2: lol[1]["champimg"],

          c: "[ 승/패 : " + lol[2]["gameresult"] + " ][ " + lol[2]["champ"] + " ]\n[ K/D/A : " + lol[2]["kda"] + " ]",
          c1: lol[2]["gametype"] + "전 | " + lol[2]["gamelength"] + " | " + lol[2]["cs"] + " | 킬관여:" + lol[2]["ckrate"] + " | 평점 :" + lol[2]["ratio"],
          c2: lol[2]["champimg"],

          d: "[ 승/패 : " + lol[3]["gameresult"] + " ][ " + lol[3]["champ"] + " ]\n[ K/D/A : " + lol[3]["kda"] + " ]",
          d1: lol[3]["gametype"] + "전 | " + lol[3]["gamelength"] + " | " + lol[3]["cs"] + " | 킬관여:" + lol[3]["ckrate"] + " | 평점 :" + lol[3]["ratio"],
          d2: lol[3]["champimg"],

          e: "[ 승/패 : " + lol[4]["gameresult"] + " ][ " + lol[4]["champ"] + " ]\n[ K/D/A : " + lol[4]["kda"] + " ]",
          e1: lol[4]["gametype"] + "전 | " + lol[4]["gamelength"] + " | " + lol[4]["cs"] + " | 킬관여:" + lol[4]["ckrate"] + " | 평점 :" + lol[4]["ratio"],
          e2: lol[4]["champimg"],

          player: `summoner/userName=${encodeURI(msg)}`


        }
      }, 'custom');
      replier.reply(`Runtime:${java.lang.System.currentTimeMillis() - time} ms`);
    }
    const Jsoup = org.jsoup.Jsoup;
    if (msg.startsWith("이태")) {
      msg = msg.replace("이태 ", "");
      result = msg;
      try {
        var url = Jsoup.connect("https://api.cloudinary.com/v1_1/shapbot/image/upload")
          .data('file', result)
          .data('upload_preset', 'auxoijy3')
          .ignoreContentType(true)
          .post();
      } catch (e) {
        replier.reply("에러!");
      }
      replier.reply(`${pictureURL}`);
    }
    if (msg.startsWith("이미지")) {
      msg = msg.replace("이미지 ", "");
      Kakao.sendLink(room, {
        template_id: 68879, //템플릿 아이디 5자리 
        template_args: { picture: msg }
      }, 'custom');
    }
    if (msg == "도움말") {
      Kakao.sendLink(room, {
        template_id: 68879, //템플릿 아이디 5자리 
        template_args: { picture: "https://res.cloudinary.com/shapbot/image/upload/v1643178479/file/hvttsbwr2unqjb1drp8s.png" }
      }, 'custom');
    }
  } //prefix 설정
} //response

function onStartCompile() {
  FileStream.write("/sdcard/botgame/list.json", JSON.stringify(shapbotgame));
}