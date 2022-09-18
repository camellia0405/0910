// 登録ボタンが押された時、inputをブランクにして未完了リストに要素を生成して追加する
const inputFormElem = document.querySelector(".input-form-wrapper");
const addButton = document.getElementById("addButton");
const categorySelectBox = document.getElementById("category");
// todoアイテムごとに配列で管理するために定義し、空の配列を格納


// 未完了のtodoアイテム配列
let incompleteTodoItemArray = [];
// 完了のtodoアイテム配列
let completeTodoItemArray = [];

addButton.addEventListener("click", addTodoItem);



// 空欄かチェックする関数////////////////////
// 空欄：戻り値：true
// 空欄ではない：戻り値：false
function isBlank(value) {
  return value === "" ? true : false; 
}

/////////////////////////////////////////

// セレクトボックスが「選択してください」のまま送信されていないかチェック
function categoryCheckSelected(selectValue) {
  return selectValue === "0" ? true : false;
}
////////////////////////////////////////////////////////////

// 登録ボタンがクリックされたときに発火する関数
function addTodoItem() {
  // Nodeを一括追加するためのFragmentを追加
  let todoItemFragment = document.createDocumentFragment();

  // inputタグ要素を取得
  const todoForm = document.getElementById("inputTodo");

  // inputタグのvalueを取得しinputValueへ格納
  let inputText = todoForm.value;

  // カテゴリーのセレクトボタンのvalue値を取得して格納
  let categoryValue = categorySelectBox.value;

  // inputタグの中身が空欄だった場合はここで処理終了
  if (isBlank(inputText)) {
    inputFormElem.style.backgroundColor = "pink";
    alert("Todoを入力してください。");
    return;
  } else if (categoryCheckSelected(categoryValue)) {
    alert("カテゴリーを選択してください");
    return;
  }

  // todoアイテムの全体となるliタグ生成　todo-itemクラスを付与
  const li = document.createElement("li");
  li.className = "todo-item";

  // タグとなるspanタグを生成　category-tagクラスを付与
  const span = document.createElement("span");
  span.className = "category-tag";
  span.innerText = categoryValue;
  span.classList.add(setCategoryTagClass(categoryValue));


  // フォームから入力された内容を反映させるpタグ生成　
  // todo-titleクラスを付与し、pタグ内にinputFormの値を格納
  const p = document.createElement("p");
  p.className = "todo-title";
  p.textContent = inputText;

  // spanタグとpタグを内包させるためのdivタグを生成
  // left-contentクラスを付与
  const leftContentElm = document.createElement("div");
  leftContentElm.className = "left-content";

  // divタグにspanタグとpタグを格納
  leftContentElm.appendChild(span);
  leftContentElm.appendChild(p);



  // 完了buttonを生成　complete-buttonクラスを付与
  const completeButton = document.createElement("button");
  completeButton.className = "complete-button";
  completeButton.textContent = "完了にする";
  debugger

  // 完了ボタンのクリックイベントを登録
  completeButton.addEventListener("click", (e) => {
    // 完了ボタンが押されたtodo-itemクラスが付与された要素を取得
    const addTarget = e.target.closest(".todo-item");

    // 完了todoの全体となるliタグを生成してtodo-itemクラスを付与
    const li = document.createElement("li");
    li.className = "todo-item";

    // タグとなるspanタグを生成　category-tagクラスを付与
    const span = document.createElement("span");
    span.className = "category-tag";
    span.innerText = addTarget.firstElementChild.firstElementChild.innerHTML;
    span.classList.add(setCategoryTagClass(span.innerText));
    // element.classList.add("クラス名");
    // pタグ生成してtodo-titleクラスを付与
    const p = document.createElement("p");
    p.className = "todo-title";
    p.innerText = addTarget.firstElementChild.firstElementChild.nextElementSibling.innerText;

    // span, pタグを内包するdivタグを生成
    const leftContentElm = document.createElement("div");
    leftContentElm.className = "left-content";

    leftContentElm.appendChild(span);
    leftContentElm.appendChild(p);
    
    // 戻すボタン生成 back-buttonクラスを付与
    const backButton = document.createElement("button");
    backButton.className = "back-button";
    backButton.textContent = "未完了に戻す";



    // 削除ボタンを生成 delete-buttonクラスを付与
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "削除";

    // 戻す・削除ボタン要素を内包するdiv要素を生成 right-contentクラスを付与
    const rightContentElm = document.createElement("div");
    rightContentElm.className = "right-content";
    rightContentElm.appendChild(backButton);
    rightContentElm.appendChild(deleteButton);


    li.appendChild(leftContentElm);
    li.appendChild(rightContentElm);

    const ul = document.getElementById("completeList");
    ul.appendChild(li);

    document.getElementById("incompleteList").removeChild(addTarget);
  });

  // 削除ボタンを生成 delete-buttonクラスを付与
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "削除";

  // 削除ボタンのクリックイベントを登録
  deleteButton.addEventListener("click", (e) => {
    deleteTodo(e);
  });

  // 完了・削除ボタン要素を内包するdiv要素を生成 right-contentクラスを付与
  const div = document.createElement("div");
  div.className = "right-content";
  div.appendChild(completeButton);
  div.appendChild(deleteButton);

  // liタグの子要素にleftContentElmのdivタグとオプションボタンのdivタグを追加
  li.appendChild(leftContentElm);
  li.appendChild(div);
  // incompleteListの子要素に生成したli要素を追加
  const ul = document.getElementById("incompleteList");

  // 以下devlopブランチでコメントイン

  incompleteTodoItemArray.push(li);
  console.log(incompleteTodoItemArray);
  for (let i=0; i < incompleteTodoItemArray.length; i++) {
    todoItemFragment.appendChild(incompleteTodoItemArray[i]);
  }
  console.log(todoItemFragment);

  // ul.appendChild(li);
  ul.appendChild(todoItemFragment);

  // backgroundColorを元に戻してinputタグの内容を空にする
  inputFormElem.style.backgroundColor = "#efefef";

};
///////////////////////////////////////////////////////////

// todo削除の関数
function deleteTodo(event) {
  const deleteTarget = event.target.closest(".todo-item");
  deleteTarget.parentNode.removeChild(deleteTarget);
}

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