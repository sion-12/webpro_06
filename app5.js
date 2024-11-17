const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  else if( num==2 ) luck = '小吉';
  else if( num==2 ) luck = '大大吉';
  else if( num==2 ) luck = '凶';
  else if( num==2 ) luck = '普通吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win )|| 0;//numberというへんすうに変換することで，数値として扱う
  let total = Number( req.query.total ) || 0;
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  let judgement = '勝ち';
  if((num==1&&hand=='チョキ')||(num==2&&hand=='パー')||(num==3&&hand=='グー')){
    judgement = '負け';
    total += 1;
  } else if (hand==cpu){
    judgement = 'あいこ'; //愛顧の場合の処理をおこなう
  } else {
    win += 1;//買ったときだけぷらす１
    total += 1;
  }

  const display = {  //表示するための関数
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});


app.get("/date", (req, res) => {
  const schedules ={
    '2024-11-05': "楽しいwebproの日",
    '2024-11-11': "ポッキーの日",
    '2024-11-12': "楽しいwebproの日",
    '2024-11-19': "楽しいwebproの日",
    '2024-11-20': "webproレポートの締め切り",
    '2024-11-21': "バイトやだ",
    '2024-11-23': "バイト",
    '2024-11-24': "津田沼祭",
    '2024-11-26': "楽しいwebproの日",
    '2024-11-28': "歯医者",
    '2024-11-30': "習い事",
  };

  const date = req.query.date;

  let schedule;

  if(date){
    schedule = schedules[date] || "予定なし";
  }
  
  const display = {  //表示するための関数
    date: date,
    schedule: schedule
  }
  
    res.render('date', display);
  });

app.get("/food", (req,res) => {
  const manu={
    "米":["カレーライス","鮭おにぎり","照りたま丼","海鮮丼","炒飯"],
    "パン":["ハンバーガー","サンドウィッチ","ピザ","フレンチトースト"],
    "麺":["豚骨ラーメン","かきたまうどん","明太クリームパスタ","焼きそば"]
  };

  const food = req.query.food;
  const option = manu[food];

let select;

if(option){
  select =option[Math.floor(Math.random()* option.length)];
}

  const display = {
    food : food  || "主食を選んで下さい",
    select : select ||"わかりません!"
  };

  res.render('food', display);

});

app.listen(8080, () => console.log("Example app listening on port 8080!"));

