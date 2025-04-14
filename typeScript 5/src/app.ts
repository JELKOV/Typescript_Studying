// <1> ✅ 데코레이터 함수 정의
// 1. 클래스가 정의될 때 자동으로 호출되는 함수
function Logger(constructor: Function) {
  console.log("📢 Logging..."); // 데코레이터 작동 확인용 메시지
  console.log(constructor); // 데코레이터가 받은 클래스 생성자 출력
}

// 2. 클래스 데코레이터 사용
@Logger // 이 데코레이터는 클래스가 정의되는 순간 Logger 함수가 실행됨
class Person {
  name = "Ahn"; // 클래스 속성

  constructor() {
    console.log("👤 Making a Person Class ..."); // 인스턴스 생성 시 출력
  }
}

// 3. 클래스 인스턴스 생성
const pers = new Person(); // 생성자 함수 실행

// 4. 생성된 인스턴스 출력
console.log(pers); // Person { name: 'Ahn' }

// <2> ✅ 데코레이터 팩토리 함수 정의
// - logString: 외부에서 전달받을 메시지
// - 이 함수는 내부에서 진짜 데코레이터 함수를 반환함
function Logger2(logString: string) {
  return function (constructor: Function) {
    // 이 함수가 실제 데코레이터로 작동
    console.log("📌 데코레이터 메시지 출력:", logString); // 전달받은 로그 메시지 출력
    console.log("🔧 생성자 함수 정보 출력:", constructor); // 데코레이터가 적용된 클래스 생성자 출력
  };
}

// 2. 클래스에 데코레이터 적용
@Logger2("LOGGING - PERSON") // 데코레이터 팩토리 실행 → 데코레이터 함수 반환 → 클래스에 적용
class Person2 {
  name = "Ahn"; // 클래스의 기본 속성

  constructor() {
    // 클래스 인스턴스가 생성될 때 호출됨
    console.log("👤 Person2 인스턴스 생성 중...");
  }
}

// 3. 클래스 인스턴스 생성
const pers2 = new Person2(); // constructor 실행

// 4. 인스턴스 확인
console.log("🧾 생성된 인스턴스:", pers2);

// ✅ <3> 데코레이터를 활용한 템플릿 렌더링 데모

// 데코레이터 팩토리 함수 정의
function WithTemplate(template: string, hookId: string) {
  // 데코레이터 팩토리는 실제 데코레이터 함수(constructor를 받는)를 반환해야 함
  return function (constructor: any) {
    // 지정한 ID를 가진 DOM 요소 가져오기
    const hookEl = document.getElementById(hookId);

    // 클래스 인스턴스를 생성하여 내부 데이터를 접근할 수 있도록 함
    const p = new constructor();

    // DOM 요소가 존재할 경우 템플릿을 삽입
    if (hookEl) {
      hookEl.innerHTML = template;

      // 템플릿 안에 있는 <h1> 요소 선택 후 name 값을 동적으로 삽입
      const h1 = hookEl.querySelector("h1");
      if (h1) {
        h1.textContent = p.name; // 클래스 인스턴스의 name 속성 사용
      }
    }
  };
}

// 데코레이터 적용: 클래스 정의 시점에 실행됨
@WithTemplate("<h1>My Person Object</h1>", "app") // 화면에 렌더링할 HTML과 hook ID 지정
class Person3 {
  name = "Ahn"; // 클래스의 기본 속성

  constructor() {
    // 클래스 인스턴스가 생성될 때 호출됨
    console.log("👤 Person3 인스턴스 생성 중...");
  }
}

// 클래스 인스턴스 생성
const pers3 = new Person3(); // constructor 실행됨

// 인스턴스 출력
console.log("🧾 생성된 인스턴스:", pers3);

// ✅ <4> 데코레이터 실행순서 및 팩토리 실행순서

// 데코레이터 팩토리 1
function Logger3() {
  console.log("📦 LOGGER3 FACTORY 실행됨");
  return function (constructor: Function) {
    console.log("🛠 Logger 데코레이터 실행됨");
    console.log(constructor);
  };
}

// 데코레이터 팩토리 2
function WithTemplate2(template: string, hookId: string) {
  console.log("📦 TEMPLATE FACTORY 실행됨");
  return function (constructor: any) {
    console.log("🛠 Template 데코레이터 실행됨");
    const hookEl = document.getElementById(hookId);
    const instance = new constructor(); // 클래스 인스턴스 생성

    if (hookEl) {
      hookEl.innerHTML = template;
      const h1 = hookEl.querySelector("h1");
      if (h1) {
        h1.textContent = instance.name; // 인스턴스 속성 사용
      }
    }
  };
}

// 데코레이터 사용 (팩토리 먼저 실행됨, 데코레이터는 아래 → 위로 실행됨)
@Logger3() // Logger 팩토리 → 나중에 실행되는 데코레이터
@WithTemplate2("<h1>My Person Object</h1>", "app") // Template 팩토리 → 먼저 실행되는 데코레이터
class Person4 {
  name = "Ahn";

  constructor() {
    console.log("👤 Person4 생성자 실행 중...");
  }
}

// 클래스 인스턴스 생성 (데코레이터와는 별개로 실행됨)
const pers4 = new Person4();
console.log("🧾 생성된 인스턴스:", pers4);

console.log("<5> 데코레이터 확장 정리 - 다양한 데코레이터 예제 ");
// ✅ <5> 데코레이터 확장 정리 - 다양한 데코레이터 예제

// 1. 프로퍼티 데코레이터
function Log(target: any, propertyName: string | symbol) {
  console.log("📌📌📌📌 Property decorator 실행!📌📌📌📌");
  console.log("🔧 target (프로토타입):", target); // 인스턴스가 아닌 클래스의 prototype
  console.log("🔑 propertyName:", propertyName); // 데코레이터가 붙은 프로퍼티 이름
}

// 2. 접근자(Setter/Getter) 데코레이터
function LogAccessor(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) {
  console.log("🛠🛠🛠🛠 Accessor decorator 실행!🛠🛠🛠🛠");
  console.log("🔧 target:", target);
  console.log("🔑 name:", name);
  console.log("📄 descriptor:", descriptor);
}

// 3. 메서드 데코레이터
function LogMethod(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  console.log("🧩🧩🧩🧩 Method decorator 실행!🧩🧩🧩🧩");
  console.log("🔧 target:", target);
  console.log("🔑 methodName:", methodName);
  console.log("📄 descriptor:", descriptor);
}

// 4. 매개변수 데코레이터
function LogParam(target: any, methodName: string, parameterIndex: number) {
  console.log("🧷🧷🧷🧷 Parameter decorator 실행!🧷🧷🧷🧷");
  console.log("🔧 target:", target);
  console.log("🔑 methodName:", methodName);
  console.log("🔢 parameterIndex:", parameterIndex);
}

// 🧪 데코레이터 적용 예제 클래스
class Product {
  // [프로퍼티 데코레이터] 클래스가 정의될 때 실행됨
  @Log
  title: string;

  // 실제 가격은 외부 접근 차단 → 내부에서만 조작
  private _price: number;

  // 생성자: title과 price를 초기화
  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  // [접근자 데코레이터] setter에 적용됨
  @LogAccessor
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("❌ 잘못된 가격 - 양수여야 합니다!");
    }
  }

  // [메서드 데코레이터]와 [매개변수 데코레이터] 함께 사용
  @LogMethod
  getPriceWithTax(@LogParam tax: number) {
    return this._price * (1 + tax);
  }
}

// ✅ <6> 클래스 데코레이터에서 새로운 생성자 반환하기
// - 템플릿 문자열열과 Dom 요소 ID를 받아 화면에 랜더링
function WithTemplate3(template: string, hookId: string) {
  // 데코레이터 함수 내부에서 원래 클래스를 받아 새로운 클래스를 반환
  // - args: any[] -> 생성자 인자 목록 ( 몇개가 올지 모름 )
  // - {name: string} -> return 값 객체로 리턴
  return function <T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T
  ) {
    console.log("🛠 Template 데코레이터 실행됨");

    // 기존 클래스를 확장한 새로운 클래스를 반환
    return class extends originalConstructor {
      constructor(...args: any[]) {
        super(...args); // 기존 생성자 호출
        console.log("데코레이터 클래스 인스턴스 생성됨");

        const hookEl = document.getElementById(hookId);

        if (hookEl) {
          hookEl.innerHTML = template;
          const h1 = hookEl.querySelector("h1");
          if (h1) {
            // name 속성은 제약 조건으로 보장됨됨
            h1.textContent = this.name;
          }
        }
      }
    };
  };
}

@WithTemplate3("<h1>안제호 객체입니다</h1>", "app")
class Person5 {
  name = "Ahn New Constructure";

  constructor() {
    console.log("👤 Person5 생성자 실행 중...");
  }
}

// 인스턴스 생성 -> 이 시점에 데코레이터 내부 로직이 실행됨 !!
const person5 = new Person5();
console.log("생성된 인스턴스:", person5);

// ✅ <7> TypeScript 데코레이터에서의 반환값 정리

// 클래스 데코레이터: 기존 클래스를 확장하여 새로운 생성자 함수 반환
function LoggerReturn<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args); // 원래 생성자 호출
      console.log("🧱 Logger: 클래스 인스턴스 생성됨!", args);
    }
  };
}

@LoggerReturn
class Person6 {
  constructor(public name: string) {
    console.log("📦 원본 Person6 생성자 호출됨");
  }
}

const p = new Person6("Ahn"); // 실행 시 Logger 데코레이터 로직 포함됨

// 메서드 데코레이터: 메서드를 감싸는 형태로 커스터마이징
function LogMethodReturn(
  _: any,
  name: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`🧩 메서드 '${name}' 호출됨. args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`✅ 반환값:`, result);
    return result;
  };

  return descriptor; // 수정된 설명자 반환
}

class Calculator {
  @LogMethodReturn
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(5, 3); // 메서드 호출 전/후 로그 출력됨

// 접근자(setter) 데코레이터: set 동작 수정 가능
function LogSetter(
  _: any,
  name: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalSetter = descriptor.set;

  descriptor.set = function (value: number) {
    console.log(`🛠 세터 '${name}'에 ${value} 할당`);
    if (value < 0) {
      throw new Error("❌ 음수는 허용되지 않음!");
    }
    originalSetter!.call(this, value);
  };

  return descriptor;
}

class Product2 {
  private _price: number = 0;

  @LogSetter
  set price(value: number) {
    this._price = value;
  }

  get price() {
    return this._price;
  }
}

const product = new Product2();
product.price = 100; // 정상
// product.price = -50; // ❌ 예외 발생

// 프로퍼티 데코레이터: 반환값은 무시됨
function LogProperty(_: any, propertyKey: string | symbol) {
  console.log(`📌 프로퍼티 '${String(propertyKey)}' 데코레이터 실행됨`);
  return {
    configurable: false,
    enumerable: false,
  }; // ❌ 무시됨
}

// class Book {
//   @LogProperty
//   title: string = "Default Title";
// }

// 매개변수 데코레이터: 단지 메타 정보 수집용
function LogParam2(_: any, methodName: string, paramIndex: number) {
  console.log(
    `🧷 '${methodName}' 메서드의 ${paramIndex}번 매개변수에 데코레이터 적용됨`
  );
  return 123; // ❌ 무의미함
}

// class Vehicle {
//   start(@LogParam2 speed: number) {
//     console.log("🚗 차량 시작. 속도:", speed);
//   }
// }

// ✅ <8> 메서드 테코레이터 Autobind 예제

/**
 * 메서드 데코레이터 - this 바인딩 자동화
 * 호출 위치와 관계없이 항상 클래스 인스턴스를 this로 보장
 */
function Autobind(
  _: any, // target: 프로토타입 or 생성자 (사용 X)
  _2: string, // methodName (사용 X)
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value; // 원래 메서드 함수 추출

  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      // getter: 메서드 접근 시 실행됨
      const boundFn = originalMethod.bind(this); // 현재 인스턴스에 바인딩
      return boundFn; // 바인딩된 함수 반환
    },
  };

  return adjDescriptor; // 새 설명자 반환 (기존 메서드 덮어씀)
}

// 데코레이터를 테스트할 클래스
class Printer {
  message = "This works!";

  @Autobind // 이 메서드에 자동 바인딩 데코레이터 적용
  showMessage() {
    console.log(this.message); // this가 항상 Printer 인스턴스를 가리킴
  }
}

// HTML 버튼에 이벤트 연결
const button = document.querySelector("button")!; // null 아님 단언
const p1 = new Printer();

// 🔗 메서드를 직접 전달해도 this가 올바르게 바인딩됨
button.addEventListener("click", p1.showMessage);

/**
 * 핵심 개념 정리:
 * - 일반적으로 p.showMessage를 addEventListener에 전달하면 this가 button을 가리키게 됨
 * - Autobind 데코레이터는 getter를 활용해 자동으로 this를 bind(p)하여 바인딩된 함수 반환
 * - 따라서 어디서 호출되든 this는 항상 Printer 인스턴스를 가리키게 됨
 */

// ✅ <9> 테코레이터를 활용한 유효성 검사

// 유효성 검사 대상 프로퍼티와 검사종류들을 배열로 저장시킴
interface ValidatorConfig {
  // 클래스 이름을 문자열로 키로 사용 ("Course", "Product" 등)
  [className: string]: {
    // 클래스 내부 프로퍼티 이름 ("title", "price" 등)
    [property: string]: string[]; // 해당 프로퍼티에 적용된 유효성 검사기들의 목록 ("required", "positive" 등 문자열 배열)
  };
}

// 전역 유효성 검사 레지스트리 (클래스마다 유효성 검사 정보 저장)
const registeredValidators: ValidatorConfig = {}; // 전역 저장소

// 데코레이터: 필수 입력값 검사
function Required(target: any, propName: string) {
  const className = target.constructor.name;

  // 기존 값 보존 + 새 검사기 추가
  registeredValidators[className] = {
    ...registeredValidators[className],
    [propName]: [
      ...(registeredValidators[className]?.[propName] ?? []),
      "required", // 새로운 검사기 추가
    ],
  };
}

// 데코레이터: 양수 값 검사
function PositiveNumber(target: any, propName: string) {
  const className = target.constructor.name;
  registeredValidators[className] = {
    ...registeredValidators[className],
    [propName]: [
      ...(registeredValidators[className]?.[propName] ?? []),
      "positive", // 새로운 검사기 추가
    ],
  };
}

// 유효성 검사 실행 함수
function validate(obj: any): boolean {
  // 1️⃣ 클래스 이름 기준으로 등록된 유효성 검사 설정 조회
  const objValidatorConfig = registeredValidators[obj.constructor.name];

  // 2️⃣ 등록된 유효성 검사 항목이 없으면 유효하다고 간주
  if (!objValidatorConfig) return true;

  // 3️⃣ 전체 유효성 검사 결과 저장용 플래그 (초기값은 true)
  // 만약에 switch 중간에 나가면 return값은?
  let isValid = true;

  // 4️⃣ 등록된 각 프로퍼티에 대해 반복 (ex: title, price 등)
  for (const prop in objValidatorConfig) {
    // prop: 검사할 프로퍼티 이름 (ex: "title")

    // 5️⃣ 해당 프로퍼티에 등록된 모든 검사기 반복
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case "required":
          // required 검사기: 값이 존재해야 함 (null, "", undefined → 실패)
          isValid = isValid && !!obj[prop];
          break;

        case "positive":
          // positive 검사기: 값이 0보다 커야 함
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }

  // 6️⃣ 최종 결과 반환 (하나라도 실패하면 false)
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector("form")!;
courseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const titleEl = document.getElementById("title") as HTMLInputElement;
  const priceEl = document.getElementById("price") as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);

  if (!validate(createdCourse)) {
    alert("Invalid input, please try again!");
    return;
  }

  console.log(createdCourse);
});
