// 두 개의 숫자를 받아 더한 결과를 반환하는 함수
function add(n1: number, n2: number): number {
  return n1 + n2;
}

// 숫자 하나를 받아 콘솔에 출력하는 함수 (반환값이 없으므로 반환 타입은 void)
function printResult(num: number): void {
  console.log("Result: " + num);
}

function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
  const result = n1 + n2;
  cb(result); // 콜백 함수 실행, result 전달
}

// 사용 예시
addAndHandle(10, 20, (result) => {
  console.log("결과:", result); // "결과: 30"
});

// add 함수의 반환값을 printResult 함수에 전달하여 출력
printResult(add(5, 12));

// 아래는 함수 타입을 어떻게 명확히 정의할 수 있는지 보여주는 예제

// ❌ 이렇게 선언하면 아무 함수나 할당 가능해서 타입 안정성이 떨어짐
// let combineValues: Function;
// combineValues = add;          // ✅ 허용됨
// combineValues = printResult;  // ✅ 허용되지만 의도와 다름
// combineValues = 5;            // ❌ 숫자는 함수가 아니므로 런타임 오류 발생

// ✅ 함수 타입을 명확하게 정의해 안정성을 높임
type CombineFunction = (a: number, b: number) => number;

// combineValues는 숫자 두 개를 받아 숫자를 반환하는 함수만 허용됨
let combineValues: CombineFunction;

// add 함수는 타입 정의와 일치하므로 할당 가능
combineValues = add;

// 할당된 add 함수를 사용하여 8 + 8 계산 후 출력
console.log(combineValues(8, 8)); // 👉 결과: 16
