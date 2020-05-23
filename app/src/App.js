import React, { useEffect, useState } from 'react';
import Form from './components/form';
import './App.css';

function App() {

  const [entries, setEntries] = useState(null);

  const renderEntries = () => {
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            entries {
              title,
              date,
              body,
              link,
              type {
                name
              }
              tags {
                tag {
                  name
                }
              }
              image,
              subtitle,
              source,
              duration,
              repeats,
              location,
              status {
                name
              }
            }
          }`,
      }),
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        setEntries(data.data.entries);
      })
    }

  useEffect(renderEntries, []);

  return (
    <div className="App">
      <p>hello</p>
      <h3>do an entry:</h3>
      <Form onSubmit={renderEntries} />
      <h3>entries:</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {entries ? entries
            .sort((a,b) => {
              if (a.date === b.date) return 0;
              return a.date > b.date ? 1 : -1;
            })
            .map((entry, i) => (
            <tr key={i}>
              <td>{entry.title}</td>
              <td>{entry.date}</td>
              <td>{entry.type.name}</td>
            </tr>
          )) : null}
        </tbody>
      </table>
    </div>
  );
}

export default App;
