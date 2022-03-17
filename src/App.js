import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import './App.css';

const PokemonRow = ({ pokemon, key, onSelect, japanese }) => (
  <tr key={key}>
    <td>{pokemon.name.english}</td>
    {japanese && 
      <td>{pokemon.name.japanese}</td>
    }
    <td>{pokemon.type.join(', ')}</td>
    <td>
      <button onClick={() => onSelect(pokemon)}>Select!</button>
    </td>
  </tr>
);

PokemonRow.propTypes = {
  pokemon: PropTypes.shape({
    name: PropTypes.shape({
      english: PropTypes.string.isRequired,
      japanese: PropTypes.string.isRequired,
      chinese: PropTypes.string.isRequired,
      french: PropTypes.string.isRequired,
    }),
    type: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
  onSelect: PropTypes.func.isRequired,
};

const PokemonInfo = ({name, base }) => (
  <div>
    <h1>{name.english}</h1>
    <table>
      {
        Object.keys(base).map(key => (
          <tr key={key}>
            <td>{key}</td>
            <td>{base[key]}</td>
          </tr>
        ))
      }
    </table>
  </div>
  
)

PokemonInfo.propTypes = {
  name: PropTypes.shape({
    english: PropTypes.string,
  }),
  base: PropTypes.shape({
    HP: PropTypes.number.isRequired,
    Attack: PropTypes.number.isRequired,
    Defense: PropTypes.number.isRequired,
    "Sp. Attack": PropTypes.number.isRequired,
    "Sp. Defense": PropTypes.number.isRequired,
    Speed: PropTypes.number.isRequired,
  }),
};

const Title = styled.h1`
  text-align: center;
`;
const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  grid-column-gap: 1rem
`;
const Container = styled.div`
  margin: auto;
  width: 800px;
  paddingTop: 1rem;
`;
const Input = styled.input`
  width: 100%;
  font-size: x-large;
  padding: 0.2rem;
`;

function App() {
  const [filter, filterSet] = React.useState("");
  const [pokemon, pokemonSet] = React.useState([]);
  const [selectedItem, selectedItemSet] = React.useState(null);
  const [japanese, japaneseSet] = React.useState(false);


  React.useEffect(() => {
    fetch("http://localhost:3000/practice/pokemon.json").then((resp) => resp.json()).then((data) => pokemonSet(data));
  }, []); // runs once on load and then never again. bc of the empty array.

  return (
    <Container>
      <Title>Pokemon Search</Title>
      <button onClick={() => japaneseSet(!japanese)}>toggle Japanese</button>
      <TwoColumnLayout>
        <div>

          <Input 
            value={filter}
            onChange={(evt) => filterSet(evt.target.value)}
          />
          <table width="100%">
            <thead>
              <tr>
                <th>Name</th>
                { japanese && 
                  <th> </th>
                }
                <th>Type</th>
                <th>Stats</th>
              </tr>
            </thead>

            <tbody>
              {pokemon
              .filter((pokemon) => pokemon.name.english.toLowerCase().includes(filter.toLowerCase()))
              .slice(0,20)
              .map(pokemon => (
                <PokemonRow pokemon={pokemon} key={pokemon.id} japanese={japanese} onSelect={(pokemon) => selectedItemSet(pokemon)}/>
              ))}
            </tbody>
          </table>
        </div>
        {selectedItem && <PokemonInfo {...selectedItem} />}
      </TwoColumnLayout>
    </Container>
  );
}

export default App;
