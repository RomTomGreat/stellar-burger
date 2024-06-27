import { useState } from 'react';

export const useForm = <TForm>(inputValues: TForm) => {
  const [values, setValues] = useState(inputValues);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.currentTarget;
    setValues({ ...values, [name]: value });
  };

  return { values, handleChange, setValues };
};
