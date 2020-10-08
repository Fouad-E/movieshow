import React from 'react';
import { Button } from 'reactstrap';

import MoviesCards from './components/MoviesCards';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {


  return (
    <div className="App">
      <Button> Clique moi </Button>
      <MoviesCards />
    </div>
  );
}

export default App;
