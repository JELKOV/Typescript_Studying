let userInput: unknown;
let userName: string;

userInput = 5;
userInput = "Ahn";

// userName = userInput;
// unknonw -> error
// any -> no error

if (typeof userInput === "string") {
  userName = userInput;
}

function generateError(message: string, code: number): never {
  throw { message: message, errorCode: code };
  // while (true) {}
}

const result = generateError("An Error", 500);

console.log(result);
