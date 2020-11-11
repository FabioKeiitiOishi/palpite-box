import React, { useState } from 'react';
import PageTitle from '../components/pageTitle';

const Search = () => {
  const [form, setForm] = useState({
    Nome: '',
    Email: '',
    Whatsapp: '',
    Nota: 0
  });
  const [success, setSuccess] = useState(false);
  const [returnedValues, setReturnedValues] = useState({});

  const Notas = [0,1,2,3,4,5];

  const handleChangingInput = event => {
    const inputValue = event.target.value;
    const inputKey = event.target.name;
    setForm(oldForm => ({
      ...oldForm,
      [inputKey]: inputValue
    }));
  };

  const save = async () => {
    
    try {
      const responseSave = await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      const data = await responseSave.json();
      setSuccess(true);
      setReturnedValues(data);

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="pt-6">
      <PageTitle title="Pesquisa" />
      <h1 className="text-center font-bold my-4 text-2xl">Críticas e sugestões</h1>
      <p className="text-center mb-6">
        O restaurante X sempre busca por atender melhor seus clientes.<br />
        Por isso, estamos sempre abertos a ouvir a sua opinião.
      </p>
      {success ? (
          <div className="w-1/5 mx-auto my-4">
            <p className="text-center mb-6 bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3">
              Obrigado por contribuir com sua sugestão ou crítica!
            </p>
            {returnedValues.showCupom && 
              <>
                <div className="text-center border p-4 mb-4">
                  Seu cupom: <br />
                  <span className="font-bold text-2xl">{returnedValues.Cupom}</span>
                </div>
                <div className="text-center border p-4 mb-4">
                  <span className="font-bold block mb-2">{returnedValues.Promo}</span>
                  <br />
                  <span className="italic">Tire um print ou uma foto desta tela e apresente ao garçom.</span>
                </div>
              </>
            }
          </div>
        ) : (
          <div className="w-1/5 mx-auto my-4">
            <label className="font-bold">Seu nome:</label>
            <input 
              type="text" 
              className="p-4 bg-blue-100 block shadow-md my-2 rounded-lg" 
              placeholder="Nome"
              name="Nome"
              onChange={handleChangingInput}
            />
            <label className="font-bold">E-mail:</label>
            <input 
              type="text" 
              className="p-4 bg-blue-100 block shadow-md my-2 rounded-lg" 
              placeholder="E-mail"
              name="Email"
              onChange={handleChangingInput}
            />
            <label className="font-bold">Whatsapp:</label>
            <input 
              type="text" 
              className="p-4 bg-blue-100 block shadow-md my-2 rounded-lg" 
              placeholder="Whatsapp"
              name="Whatsapp"
              onChange={handleChangingInput}
            />
            <label className="font-bold">Nota:</label>
            <div className="flex py-6">
              {Notas.map(nota => {
                return (
                  <label className="block w-1/6 text-center">{nota}<br />
                    <input 
                      type="radio" 
                      name="Nota"
                      value={nota}
                      onChange={handleChangingInput}
                    />
                  </label>
                );
              })}
            </div>
            <button 
              className="bg-blue-400 px-12 py-4 font-bold rounded-lg shadow-md hover:shadow" 
              onClick={save}
            >
              Salvar
            </button>
          </div>
      )}
    </div>
  )
}

export default Search;