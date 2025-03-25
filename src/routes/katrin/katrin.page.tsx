import {KatrinData} from "./katrin.interface.ts";

function Katrin() {

  const katrin: KatrinData = {
    name: 'Katrin',
    age: 25,
  }

  return (
    <>
      <h1>{katrin.name}</h1>
      <h1>{katrin.age}</h1>
    </>
  );
}

export default Katrin;