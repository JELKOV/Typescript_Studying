// Drag & Drop Interface
// 드레그가 가능한 요소를 설정
interface Draggable {
  dragStartHandler(event: DragEvent): void; // 드레그의 시작시 실행
  dragEndHandler(event: DragEvent): void; // 드레그의 종료시 실행
}

// 드롭이 가능한 대상을 설정
interface DragTarget {
  dragOverHandler(event: DragEvent): void; // 드롭 허용 표시
  dropHandler(event: DragEvent): void; // 실제로 드롭이 일어났을때
  dragLeaveHandler(event: DragEvent): void; // 요소 밖으로 벗어났을때
}

// Class Project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// 리스너 함수 타입 정의: Project 배열을 받아서 아무것도 반환하지 않는 함수
type Listener<T> = (items: T[]) => void;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 전역 상태 클래스의 베이스 (제네릭)
// 여러 상태 클래스에서 공통으로 사용 가능
class State<T> {
  protected listeners: Listener<T>[] = []; // protected: 상속 클래스에서 접근 가능

  // 외부에서 상태 변경 감지용 리스너 등록
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Project 전용 상태 관리 클래스 (Singleton + Observer 패턴)
class ProjectState extends State<Project> {
  // 현재 등록된 프로젝트들을 저장하는 배열
  private projects: Project[] = [];
  // ProjectState 클래스의 유일한 인스턴스를 저장할 정적 속성
  private static instance: ProjectState;

  // 생성자를 private으로 선언함으로써 외부에서 new ProjectState() 불가
  // -> Singleton 패턴을 유지하기 위해서
  private constructor() {
    super();
  }

  // ProjectState의 유일한 인스턴스를 반환하는 정적 메서드
  // 이미 만들어졌으면 기존 인스턴스를 반환하고, 없으면 새로 만들어서 저장 후 반환
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  // 프로젝트 추가 시 상태 갱신 & 등록된 모든 리스너에 알림
  // title, description, 인원 수를 받아서 프로젝트 객체를 만들고, projects 배열에 추가
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active // 초기 상태는 Active
    );

    // 프로젝트 배열에 새로운 프로젝트 추가
    this.projects.push(newProject);

    // 모든 리스너 함수 실행 (프로젝트 배열의 복사본 전달)
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);

    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  // 모든 리스너 함수 실행 (프로젝트 배열의 복사본 전달)
  // -> slice()를 사용하는 이유: 원본 배열을 외부에서 변경하지 못하도록 하기 위해
  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // 변경 감지용으로 콜백 함수 실행
    }
  }
}

// 상태를 다루는 전역변수를 하나 만들어 준다.
const projectState = ProjectState.getInstance();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Validation 로직
// 객체구조부터 설정을 하고싶은데, 응집도를 높이기 위해서 interface
interface Validatable {
  value: string | number;
  // value 이외의 것들은 선택적으로 만들고 싶다.
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// validate() 함수: 유효성 검사 수행
function validate(validatableInput: Validatable): boolean {
  // 전체 유효성 결과를 누적할 플래그 (기본은 true)
  let isValid = true;

  // 1. required: 값이 반드시 존재해야 함 (빈 문자열, 공백, null 등은 실패)
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    // 문자열로 변환 후 공백 제거 → 길이가 0이면 유효하지 않음
  }

  // 2. minLength: 문자열 최소 길이 조건 (예: 최소 5자 이상)
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  // 3. maxLength: 문자열 최대 길이 조건 (예: 최대 100자 이하)
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  // 4. min: 숫자의 최소값 조건 (예: 최소 1 이상)
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  // 5. max: 숫자의 최대값 조건 (예: 최대 10 이하)
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  // 모든 조건을 만족해야만 최종적으로 true 반환
  return isValid;
}

// Autobind 함수의 인자 :
// 1. target (클래스의 prototype 객체)/ ProjectInput.prototype
// 2. 메서드 이름/ 'submitHandler'
// 3. 메서더의 설명자 객체 / PropertyDescriptor 객체 - 내부에 value, writable, enumerable, configurable 등 포함
function Autobind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjDescriptor;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement; // 템플릿 요소 (<template id="project-input">를 참조)
  hostElement: T; // 이 컴포넌트를 렌더링할 부모 요소 (예: <div id="app"> 또는 <ul>)
  element: U; // 실제로 생성되어 렌더링될 DOM 요소 (예: <form>, <section>, <li> 등)

  constructor(
    templateId: string, // 가져올 템플릿의 id (예: 'project-input', 'single-project')
    hostElementId: string, // 렌더링될 위치가 될 요소의 id (예: 'app', 'active-projects')
    insertAtStart: boolean, // 렌더링 위치: true = 맨 앞에 추가 / false = 맨 뒤에 추가
    newElementId?: string // 새로 생성된 요소에 부여할 id (선택 사항)
  ) {
    // 1. 템플릿 요소 가져오기 (<template id="...">)
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;

    // 2. 렌더링될 부모 요소 가져오기
    this.hostElement = document.getElementById(hostElementId)! as T;

    // 3. 템플릿 내용을 복사하여 새로운 노드 생성 (true: 깊은 복사)
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // 4. 템플릿에서 가져온 첫 번째 요소 (예: <section>, <li> 등)를 element로 설정
    this.element = importedNode.firstElementChild as U;
    // 5. 새 요소에 ID 부여 (전달된 경우에만)
    if (newElementId) {
      this.element.id = newElementId;
    }
    // 6. 생성된 element를 hostElement에 삽입 (앞/뒤 여부는 insertAtStart로 결정)
    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  // 이 두 메서드는 Component를 상속하는 클래스가 반드시 구현해야 함
  abstract configure(): void;
  abstract renderContent(): void;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  // <부모요소 어디에, 무슨 요소>
  private project: Project;

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    // 데이터 객체를 인스턴스 필드
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(event: DragEvent) {
    // 드래그되는 요소의 식별자(ID)를 텍스트 형태로 저장
    event.dataTransfer!.setData("text/plain", this.project.id);
    // 커서에 이동 효과 부여 (복사와 구분됨)
    event.dataTransfer!.effectAllowed = "move";
  }

  @Autobind
  dragEndHandler(_: DragEvent) {
    console.log("Drag End!");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = `${this.persons} assigned`;
    this.element.querySelector("p")!.textContent = this.project.description;
  }

  private get persons() {
    if (this.project.people === 1) {
      return "1 person";
    }
    return `${this.project.people} persons`;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 클래스: ProjectList
// - 목적: 프로젝트 리스트를 랜더링 하기 위한 클래스
class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent) {
    // 드래그 중 전달된 데이터가 있고, 형식이 'text/plain'인지 확인
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      // 브라우저 기본 동작을 막아 drop 이벤트가 발생할 수 있도록 허용
      event.preventDefault();

      // 이 요소 내부의 <ul>을 선택 (드롭 영역이 될 리스트)
      const listEl = this.element.querySelector("ul")!;
      // 드롭 가능 상태임을 시각적으로 보여주기 위해 클래스 추가 (배경색 등 효과)
      listEl.classList.add("droppable");
    }
  }

  @Autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    // ProjectState에 리스너 함수 등록
    // 프로젝트 배열에 변경이 생기면 아래 함수가 자동 실행됨
    // 프로젝트 상태 변경을 감지하고, 해당 상태의 리스트만 렌더링하기 위한 리스너 함수 등록
    projectState.addListener((projects: Project[]) => {
      // 전체 프로젝트 배열 중에서 현재 리스트(this.type)에 맞는 항목만 필터링
      const relevantProjects = projects.filter((prj) => {
        // 현재 ProjectList의 타입이 'active'인 경우
        if (this.type === "active") {
          // 상태가 ProjectStatus.Active인 프로젝트만 유지
          return prj.status === ProjectStatus.Active;
        }
        // 위 조건이 아니라면 'finished' 리스트임 → 상태가 Finished인 프로젝트만 유지
        return prj.status === ProjectStatus.Finished;
      });

      this.assignedProjects = relevantProjects; // 필터링된 프로젝트만 리스트에 할당 (렌더링 대상 지정)
      this.renderProjects(); // 실제 화면에 리스트 렌더링 (ul 요소에 <li>로 추가)
    });
  }

  renderContent() {
    // 1. 리스트에 고유한 ID 부여 (ex: "active-projects-list", "finished-projects-list")
    // this.type은 'active' 또는 'finished' 이므로 템플릿 문자열로 고유 ID 생성
    const listId = `${this.type}-projects-list`;

    // 2. <section> 내부의 <ul> 요소 선택 후, 위에서 만든 고유 ID를 부여
    this.element.querySelector("ul")!.id = listId; // '!'는 null이 아님을 보장하는 non-null assertion operator

    // 3. <section> 내부의 <h2> 요소를 선택해 헤딩 텍스트 설정
    // "ACTIVE PROJECTS" 또는 "FINISHED PROJECTS" 식으로 텍스트 삽입
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    // DOM에서 현재 리스트의 <ul> 요소를 가져옴
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    // 중복 방지를 위해 초기화
    listEl.innerHTML = "";

    // 현재 상태에 저장된 프로젝트 목록을 하나씩 반복
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 클래스: ProjectInput
// - 목적: <template> 안의 form을 <div id="app">에 렌더링하기 위한 구성 요소
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    // 폼을 실제 DOM에 렌더링 - 생성자에서 호출하여 자동 렌더링
    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent(): void {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;
    // 유효성 검사

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Not Valid Input value, Try input again");
      return; //void 반환
    }
    // input에서 기본적으로 추출하는 값은 TEXT입니다 -> 그래서 enteredPeople + 를 붙여서 Number화 시켜줘야 합니다.
    return [enteredTitle, enteredDescription, +enteredPeople];
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    // Tuple : 배열의 일종인데 고정된 배열 !!
    // 런타임에서는 자바스크립트 코드가 돌아가기 때문에 튜플이 아니라 배열로 검사해야 한다.
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 클래스 인스턴스 생성: 폼 자동 렌더링 시작됨
const prjinput = new ProjectInput();

const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
