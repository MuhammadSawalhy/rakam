
export default function randomName() {
  return (Date.now() + randomName.counter++).toString(32).replace(/\d/, "");
}

randomName.counter = 0;
