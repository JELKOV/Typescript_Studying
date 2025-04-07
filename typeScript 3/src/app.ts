// interface Admin1 {
//   name: string;
//   privileages: string[];
// }

// interface Employee1 {
//   name: string;
//   startDate: Date;
// }

// interface ElavatedEmployee1 extends Admin1, Employee1 {}

// 인터섹션

type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElavatedEmployee = Admin & Employee;

const e1: ElavatedEmployee = {
  name: "Ahn",
  privileges: ["create-server"],
  startDate: new Date(),
};

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

// 원시 타입 타입 가드

// function add(a: Combinable, b: Combinable) {
//   if (typeof a === "string" || typeof b === "string") {
//     return a.toString() + b.toString();
//   }
//   return a + b;
// }

type UnknownEmployee = Employee | Admin;

// 객체 타입에서의 타입 가드 (in 키워드)
function printEmployeeInformation(emp: UnknownEmployee) {
  console.log("Name:" + emp.name);

  if ("privileges" in emp) {
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("Start Date: " + emp.startDate);
  }
}

printEmployeeInformation(e1);
printEmployeeInformation({ name: "Oh", startDate: new Date() });

// 클래스 타입 가드 (instanceof)
class Car {
  drive() {
    console.log("Driving...");
  }
}

class Truck {
  drive() {
    console.log("Driving a truck...");
  }
  loadCargo(amount: number) {
    console.log("Loading cargo ..." + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();

  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
// Driving...
useVehicle(v2);
// Driving a truck...
// "Loading cargo ... 1000"

// 구별된 유니언언
interface Bird {
  type: "bird";
  flyingSpeed: number;
}

interface Horse {
  type: "horse";
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  //   if ("flyingSpeed" in animal) {
  //     console.log("Moving with speed:" + animal.flyingSpeed);
  //   }
  let speed;
  switch (animal.type) {
    case "bird":
      speed = animal.flyingSpeed;
      break;
    case "horse":
      speed = animal.runningSpeed;
  }
  console.log("Moving with speed:" + speed);
}

moveAnimal({ type: "bird", flyingSpeed: 10 });

// 형변환 타입캐스팅

const paragraph = document.querySelector("p");
const paragraphName = document.getElementById("message-output");

// // 꺾쇠 문법 (<>)
// const userInputElement = <HTMLInputElement>document.getElementById('user-input');
// userInputElement.value = "Hi there!";

// // as 키워드 (권장 방식)
// const userInputElement = document.getElementById('user-input') as HTMLInputElement;
// userInputElement.value = "Hi there!";

// // 느낌표 (!)를 사용해 “null이 아니다”라고 단언
// const userInputElement = document.getElementById('user-input')! as HTMLInputElement;
// userInputElement.value = "Hi there!";

// 조건문으로 안전하게 체크
const userInputElement = document.getElementById("user-input");

if (userInputElement) {
  (userInputElement as HTMLInputElement).value = "Hello!";
}

interface ErrorContainer {
  [props: string]: string;
}

const errorBag: ErrorContainer = {
  email: "Not a valid email",
  username: "Must start with a capital character",
};

// 함수 오버로딩
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number, b: string): string;
function add(a: string, b: number): string;

function add(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}

const result = add("Ahn", "Suyeon"); // result: string
console.log(result.split(" ")); // 정상 실행

// 옵셔널 체이닝
// 더미데이터
const fetchedUserData = {
  id: "u1",
  name: "Ahn",
  job: { title: "CEO", description: "My Own Company" },
};

const title = fetchedUserData?.job?.title;

console.log(title);

// Null 병합

const userInput = 0; //"ahn";

const storedData = userInput || "DEFAULT";

const storedWithNullish = userInput ?? "DEFAULT";

console.log(storedData);
console.log(storedWithNullish);
