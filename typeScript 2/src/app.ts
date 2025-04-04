// let age: number;
// age = 30;

// const userName = "Ahn JH";

// console.log(userName);

const button = document.querySelector("button");

function add(n1: number, n2: number) {
  if (n1 + n2 > 0) {
    return n1 + n2;
  }
  return;
}

if (button) {
  button.addEventListener("click", () => {
    console.log("Clicked!");
  });
}

let appId = "abc";

function clickHandler(message: string) {
  // const userName = "AHN";
  console.log("Clicked!" + message);
}
if (button) {
  button.addEventListener("click", clickHandler.bind(null, "Hello"));
  // button.addEventListener("click", clickHandler.bind(null)); // ⚠ 오류: 인수 빠짐
}
