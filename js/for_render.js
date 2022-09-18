// 要素取得
let inputFormElm = document.querySelector(".input-form-wrapper");
let todoInputElm = document.getElementById("inputTodo");
let addButtonElm = document.getElementById("addButton");

let dateSort = document.getElementById("date_sort")
let prioritySort = document.getElementById("priority_sort")

let categorySelectBoxElm = document.getElementById("category");

const incompleteListId = document.querySelector("#incompleteList").id;
const completeListId = document.querySelector("#completeList").id;
let lastId = 1;

let date = new Date();
let year = date.getFullYear()
let month = date.getMonth() +1
let day = date.getDate()
let hours = date.getHours()
let minutes = date.getMinutes()
let seconds = date.getSeconds()

let currentDate = year + '/' + month + '/'+ day + ' '+
                  hours+':'+minutes+':'+seconds
// '2008/5/1 2:00:00'



let array = [1,3,2,5,4]
let ab = array.sort()

//さて、この時点では昇順なのに、以下を実施するとabも降順になってしまう。
// なせ？？？？？？？？？？？？他の変数に干渉しているのか？
let a = array.sort(function(a,b){
  return (a > b?-1:1)
})

// 関数の戻り値が正の時　→　引数1を引数2の後ろに並べ替え。
// 関数の戻り値が負の時　→　引数1を引数2の前に並べ替え。
// 関数の戻り値が0の時　→　何もしない

//対象の配列が書き換えられる
//aが3 bが1
// 3 > 1  これは、trueなので、1が帰る
// aが2 bが3
// 2 > 3 falseなので -1が帰るとどうなる？
//再度、2 >3になる
//aが2 bが1
// 2 > 1 true rerurn 1
//a 5 b 2

// 操作元となるtodoリスト要素
const todoItemObjectArray = [];

function getCsv(){
  //HTTPでファイル読み込みのための、XMLオブジェクトを生成
  let request = new XMLHttpRequest();
  //ファイルの指定とopen
  request.open('get','../sample_data.csv')
  request.send(null)
  //callback関数 中身を実行し終わったらonloadする
  request.onload = function(){
    //テキストデータ
   let csv_data = convertCSVtoArray(request.responseText);
  }
}

//読み込んだデータを配列に変換する
function convertCSVtoArray(str){
  let result = [];
  let tmp = str.split('\n');

  for(i of tmp){
    item = i.split(',')
    re = {
      id:item[0],
      title:item[1],
      category:item[2],
      //ここだけ文字列になるので直で入れる
      complete: item[3] == 'true'? true:false,
      date:item[4],
      priority:item[5]
    }
    todoItemObjectArray.push(re)
  }
}

getCsv();

//参考データ
// todoItemObjectArray.push({
//   id: 1, title: '20:15:1', category: '0', complete: false, date: '2022/4/14 20:15:1',priority:0}
// ,{id: 2, title: '20:16:3', category: '0', complete: false, date: '2022/4/14 20:16:3',priority:1}
// ,{id: 3, title: '20:17:6', category: '0', complete: false, date: '2022/4/14 20:17:6',priority:0}
// )



// 登録されたtodoをオブジェクト配列へプッシュ
function addTodoObjectArray() {
  let todoItemObject = {
    id: lastId,
    title: todoInputElm.value,
    category: categorySelectBoxElm.value,
    complete: false,
    date: currentDate,
  }
  todoItemObjectArray.push(todoItemObject);
  lastId++;
}

//削除されたtodoをobjectに追加？？
function removeTodoObjectArray(target,objectArray) {
  //todoItemObjectArrayからindexを探して削除するぽいね
  let index = objectArray.findIndex(todo => todo.id == target.id)
  todoItemObjectArray.splice(index,1)
}

// ターゲットとなるtodoアイテムのステータスを変更
function changeStatus(target) {
  //targetのidを探してきて、todoItemObjectArrayでのindexを調べる
  //そこから、todoItemObjecrtArray[index]として、completeを変える
  let index = todoItemObjectArray.findIndex(todo => todo.id == target.id);
  todoItemObjectArray[index].complete = !todoItemObjectArray[index].complete;
}

// todoアイテムをレンダーする関数
// originalData：レンダーするオブジェクト配列
// isComplete：true(完了) or false(未完了)
function renderTodo(originalData, isComplete) {
  let renderSelector = '';
  let renderTargets = [];
  let buttonText = '';
  let html = '';

  // completeの状態によって表示させるセクションを変更 trueは完了
  if (!isComplete) {
    //未完了を完了に
    renderTargets = originalData.filter( data => !data.complete);
    buttonText = '完了にする';
    buttonSelector = '.complete-button';
    renderSelector = incompleteListId;
  } else if (isComplete) {
    //完了を未完了に
    renderTargets = originalData.filter( data => data.complete);
    buttonText = '未完了にする';
    buttonSelector = '.incomplete-button'
    renderSelector = completeListId;
  }

  //追加するhtml作成
  for (target of renderTargets){
    let optionClassName = setCategoryTagClass(target.category);
    let completeClassName = target.complete ? "incomplete-button":"complete-button";
    html += 
            `<li id=${target.id} class="todo-item">
              <div class="left-content">
                <span class="category-tag ${optionClassName}">${target.category}</span>
                <p class="todo-title">${target.title}</p>
              </div>
              <div class="right-content">
                <button id="complete" class="${completeClassName}">${buttonText}</button>
                <button id="delete" class="delete-button">削除</button>
              </div>
            </li>`;
  }

  // renderTargets.forEach(target => {
  //   let optionClassName = setCategoryTagClass(target.category);
  //   html +=`
  //     <li id=${target.id} class="todo-item">
  //       <div class="left-content">
  //         <span class="category-tag ${optionClassName}">${target.category}</span>
  //         <p class="todo-title">${target.title}</p>
  //       </div>
  //       <div class="right-content">
  //         <button id="complete" class="complete-button">${buttonText}</button>
  //         <button id="delete" class="delete-button">削除</button>
  //       </div>
  //     </li>
  //   `;
  // });

  //completeとincomplete共に動かしている
  const element = document.getElementById(renderSelector);
  element.innerHTML = html;
  let todoItems = [...element.querySelectorAll(".todo-item")];

  //ボタンのイベントハンドラ登録
  for (todoItem of todoItems) {
    todoItem.querySelector(buttonSelector).addEventListener("click", switchTodoItem);
    todoItem.querySelector(".delete-button").addEventListener("click", deleteTodoItem);
  } 
}

///////////////////////////////////////////////////////////



// カテゴリーの種類によってタグの色分け
function setCategoryTagClass(selectValue) {
  let className;
  switch (selectValue) {
    case "仕事":
      className = "work";
    break;
    case "プライベート":
      className = "private";  
    break;
    case "家族":
      className = "family";
    break;
    case "その他":
      className = "other";
    break;
    default:
      className = "other";
    break;
    }
    return className;
  }
  
  
// 空欄かチェックする関数////////////////////
// 空欄：戻り値：true
// 空欄ではない：戻り値：false
function isBlank(value) {
  return value === "" ? true : false; 
}
/////////////////////////////////////////


// セレクトボックスが「選択してください」のまま送信されていないかチェック
function isSelectedCategory(selectValue) {
  return selectValue === "0" ? true : false;
}
/////////////////////////////////////////////////////////////


// utility
// 要素を生成してクラスを付与する関数。value値が存在したらinnerTextにvalue値をセット
function makeElement(tagName, classNames, value) {
  let element = document.createElement(tagName);
  if (!classNames == "") {
    classNames.forEach(className => {
      element.classList.add(className);
    });
  }
  if (!value == "") {
    element.innerText = value;
  }
  return element;
}

// 登録ボタンがクリックされたときに発火する関数
function addTodoItem() {
  addTodoObjectArray();
  renderTodo(todoItemObjectArray, false);
  renderTodo(todoItemObjectArray, true);
}

// 完了ボタンが押されたときに発火する関数
function switchTodoItem(event) {

  // ヒント：ステータスを完了に。rendertodoを使う。
}

// 削除ボタンがクリックされたときに発火する関数
function deleteTodoItem(event) {

   //確認をとる
  let result = window.confirm('削除してもいいですか？')
    if (result){
      let target = event.target.closest(".todo-item");
        removeTodoObjectArray(target,todoItemObjectArray);
        renderTodo(todoItemObjectArray, false);
        renderTodo(todoItemObjectArray, true);
      }
}


addButtonElm.addEventListener("click", addTodoItem);
