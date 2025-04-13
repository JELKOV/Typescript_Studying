// 제네릭이란
const names = ["Ahn", "Oh"]; // 타입스크립트가 자동으로 string[]으로 추론함

// 명시적으로 제네릭 타입 Array<string>을 사용한 배열 선언
const names1: Array<string> = ["Ahn", "Oh"];
names1[0].split(" "); // 문자열 메서드 사용 가능
console.log(names1);

// 프로미스도 제네릭이다
// Promise<string>: 문자열을 resolve할 것임을 명시
const promise: Promise<string> = new Promise((resolve) => {
  setTimeout(() => {
    resolve("완료됨!"); // 문자열 resolve
  }, 1000);
});

promise.then((data) => {
  // data는 string으로 추론되므로 문자열 관련 메서드 사용 가능
  console.log(data.split(" ")); // ["완료됨!"]
});

// 제네릭을 사용한 객체 병합 함수
// T와 U는 객체 타입이어야 한다는 제약을 추가해 타입 안정성을 높입니다
function merge<T extends object, U extends object>(objA: T, objB: U): T & U {
  // Object.assign은 두 객체를 병합하여 하나의 객체로 반환합니다
  return Object.assign(objA, objB);
}

// merge 함수를 호출하여 두 객체를 병합
const mergedObj = merge(
  { name: "Ahn", hobbies: ["coding", "reading"] }, // 첫 번째 객체: name, hobbies 속성
  { age: 30 } // 두 번째 객체: age 속성
);

// 병합된 객체의 속성에 타입 안정적으로 접근 가능
console.log(mergedObj.name); // 출력: "Ahn"
console.log(mergedObj.hobbies); // 출력: ["coding", "reading"]
console.log(mergedObj.age); // 출력: 30

// 타입스크립트는 제네릭으로 인해 mergedObj가
// { name: string; hobbies: string[] } & { age: number } 타입임을 정확히 추론함

// const merged2 = merge({ name: "Ahn" }, 30);

// 명시적으로 타입을 지정한 merge 호출 예제
const merged = merge<{ name: string }, { age: number }>(
  { name: "Ahn" }, // T: { name: string }
  { age: 31 } // U: { age: number }
);

// 위 코드에서 명시적 타입 지정은 생략해도 타입스크립트가 자동 추론 가능

// 1. 길이(length) 속성을 가진 타입을 위한 인터페이스 정의
// 이 인터페이스를 통해 length 프로퍼티가 있는 객체만 제네릭으로 허용되도록 제한할 수 있음
interface Lengthy {
  length: number;
}

// 2. 제네릭 함수 정의
// T는 Lengthy를 확장(extends)하므로 반드시 length 프로퍼티를 가져야 함
function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  // 설명 문구를 담을 변수 초기화
  let descriptionText = "값 없음";

  // 길이가 1일 때
  if (element.length === 1) {
    descriptionText = "1개의 요소가 있음";
  }
  // 길이가 2 이상일 때
  else if (element.length > 1) {
    descriptionText = `${element.length}개의 요소가 있음`;
  }

  // 입력된 요소와 그에 대한 설명을 튜플 형태로 반환
  return [element, descriptionText];
}

console.log(countAndDescribe("Hello"));
// ["Hello", "5개의 요소가 있음"]

console.log(countAndDescribe(["coding", "reading"]));
// [["coding", "reading"], "2개의 요소가 있음"]

console.log(countAndDescribe([]));
// [[], "값 없음"]

// ❌ 오류: number는 length 속성이 없음
// console.log(countAndDescribe(123));

// keyof 없이 작성한 일반 함수 (문제 발생 가능)
// function extractAndConvert(obj, key) {
//   return 'Value: ' + obj[key];
// }

// 제네릭 + keyof를 활용한 타입 안전한 함수
function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  // obj[key]가 유효한 접근임을 보장받을 수 있음 (U가 T의 key이기 때문)
  return "Value: " + obj[key];
}

// 테스트: name 속성이 있는 객체를 전달하고 'name' 키로 값을 추출
const result = extractAndConvert({ name: "Ahn", age: 30 }, "name");

// 콘솔 출력: "Value: Ahn"
console.log(result);

// 제네릭 클래스 선언
class DataStorage<T> {
  // 저장할 데이터를 담는 제네릭 타입 배열
  private data: T[] = [];

  // 데이터 추가 메서드
  addItem(item: T) {
    this.data.push(item);
  }

  // 데이터 제거 메서드 (참조 비교 포함한 안전한 방식)
  removeItem(item: T) {
    const index = this.data.indexOf(item); // indexOf는 '같은 참조'만 찾음
    console.log("indexOf result:", index); // 인덱스 확인 로그 출력

    if (index !== -1) {
      // index가 유효할 때만 splice 실행 (삭제)
      this.data.splice(index, 1);
    } else {
      // ❗ 객체 참조가 다르면 indexOf는 -1 → 삭제되지 않음
      console.warn("❌ 제거 실패 - 참조가 일치하지 않음");
    }
  }

  // 전체 데이터를 복사해서 반환 (불변성 유지)
  getItems() {
    return [...this.data];
  }
}

// 문자열 전용 저장소 생성
const textStorage = new DataStorage<string>();
textStorage.addItem("Ahn");
textStorage.addItem("Oh");
textStorage.removeItem("Ahn"); // 문자열은 값 비교 → 정확히 제거됨
console.log(textStorage.getItems()); // 👉 결과: ["Oh"]

// 숫자 전용 저장소 생성
const numberStorage = new DataStorage<number>();
numberStorage.addItem(1);
numberStorage.addItem(2);
numberStorage.removeItem(1); // 숫자도 값 비교로 정확히 제거
console.log(numberStorage.getItems()); // 👉 결과: [2]

// 객체 저장소 생성
const objStorage = new DataStorage<object>();
// 객체 리터럴 추가 - 이 시점에서 '다른 객체(다른 참조)'
objStorage.addItem({ name: "Ahn" }); // 객체 A
objStorage.addItem({ name: "Oh" }); // 객체 B
console.log("추가 후:", objStorage.getItems());
// 결과: 객체 2개 저장됨
// 제거 시도 - 참조가 다른 새 객체를 전달
objStorage.removeItem({ name: "Oh" });
// indexOf는 참조 비교라 제거 실패 (다른 메모리 주소)
console.log("제거 시도 후:", objStorage.getItems());
// 여전히 객체 2개 있음

// 동일한 객체를 변수로 재사용
const maxObj = { name: "Lee" };
objStorage.addItem(maxObj);
console.log("같은객체 참조 추가:", objStorage.getItems());
// maxObj가 정확히 추가됨

objStorage.removeItem(maxObj); // 참조가 동일하므로 제거 성공
console.log("같은객체 참조 삭제:", objStorage.getItems());
// maxObj 제거됨

// 이렇게 제한하면 string | number | boolean만 허용됨
// 객체는 아예 넣을 수 없도록 만들 수 있음 (참조 비교 문제 방지)
/*
class DataStorage<T extends string | number | boolean> {
  // ... 동일한 메서드 정의
}
*/

//Partial
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

// 잘못된 접근
// function createCourseGoal(title: string, desc: string, date: Date): CourseGoal {
//   let courseGoal = {}; // 빈 객체는 CourseGoal 타입과 안 맞음 ❌
//   courseGoal.title = title;
//   courseGoal.description = desc;
//   courseGoal.completeUntil = date;
//   return courseGoal;
// }

function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = date;

  return courseGoal as CourseGoal;
}

//Read-Only

const names123: Readonly<string[]> = ["Ahn", "Lee"];
// names123.push("Oh"); // ❌ 오류 발생! 읽기 전용이기 때문


// 유니언 타입을 사용하는 DataStorage 클래스 예제
// 여러 타입(string, number, boolean)을 하나의 배열에 혼합 저장할 수 있음
class DataStorageUNION {
  // 배열의 타입을 유니언으로 지정: 문자열, 숫자, 불린 값을 모두 수용
  private data: (string | number | boolean)[] = [];

  // addItem 메서드: 유니언 타입 중 하나를 받아 배열에 추가
  addItem(item: string | number | boolean) {
    this.data.push(item);
  }

  // removeItem 메서드: 유니언 타입 중 하나를 받아 해당 요소를 제거
  // - indexOf는 값이 정확히 일치해야 작동함
  // - 참조 타입(예: 객체)에는 작동하지 않음
  removeItem(item: string | number | boolean) {
    this.data.splice(this.data.indexOf(item), 1);
  }

  // getItems 메서드가 없다면 외부에서 data 접근은 불가 (캡슐화)
}
