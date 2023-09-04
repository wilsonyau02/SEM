import Registration from "./pages/application/application";
import { supabase } from "./supabase-client";
import { useState, useEffect } from "react";

function App() {
  const [value, setValue] = useState({});

  useEffect(() => {
    async function getData() {
      const { data, error } = await supabase.from("Testing").select("*");

      console.log(data, error);
      setValue(data);
    }

    getData();
  }, []);

  return (
    <>
      <h1>Hello World</h1>

      <Registration/>
    </>
  );
}

export default App;
