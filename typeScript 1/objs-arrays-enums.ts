// const person:{
//     name:string;
//     age:number;
// } = {

/* 배열 / 튜플 학습 */

// const person: {
//   name: string;
//   age: number;
//   hobbies: string[];
//   role: [number, string];
// } = {
//   name: "Ahn JaeHo",
//   age: 38,
//   hobbies: ["Sports", "Cooking"],
//   role: [2, "author"],
// };

// person.role = [1, 2];         // ❌ 오류: 두 번째 값은 string이어야 함
// person.role = [1, "admin", 3]; // ❌ 오류: 요소가 2개 초과
// person.role = [];              // ❌ 오류: 요소가 부족함
// person.role.push("admin"); ❗ 오류 없음 → 타입스크립트가 잡지 못함
// person.role[1] = 10;
// person.role= [0, 'admin', 'user];

// console.log(person.role);

// let favoriteActivities: string[];
// favoriteActivities = ["Sports"];

// for (const hobby of person.hobbies) {
//   console.log(hobby.toUpperCase());
//   // console.log(hobby.map());// 에러  String 타입은 map 함수가 없다!!
// }
// console.log(person.name);

// const ADMIN = 0;
// const READ_ONLY = 1;
// const AUTHOR = 2;

enum Role {
  ADMIN = 5, READ_ONLY, AUTHOR
}

/* enum 학습 */
const person = {
  name: "Ahn JaeHo",
  age: 38,
  hobbies: ["Sports", "Cooking"],
  role: Role.ADMIN,
};

if (person.role === Role.AUTHOR) {
  console.log("is author");
}
