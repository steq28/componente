import React from 'react';
import ReactDOM from 'react-dom';

import Componente from './Componente';

//Decommentare per provare Componente2
//import Componente2 from './Componente2';

ReactDOM.render(
  <React.StrictMode>
    <Componente/>
    {/*<Componente2/>*/}
  </React.StrictMode>,
  document.getElementById('root')
);
