import React, { useState, useEffect } from 'react';
import TagsInput from './tags-input';
import arrayString from '../helpers/arrayString';

const Form = ({ onSubmit }) => {
  const [types, setTypes] = useState(null);
  const [values, setValues] = useState({
    title: '',
    body: '',
    link: '',
    type: '',
    tags: []
  });

  useEffect(() => {
    fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            types {
              id,
              name
            }
          }`,
      }),
    })
      .then(data => data.json())
      .then(response => setTypes(response.data.types))
  }, []);

  const handleTagsChange = value => {
    setValues({
      ...values,
      tags: value
    })
  }

  const handleChange = e => {
    const newState = {
      ...values,
      [e.target.name]: e.target.value
    }
    setValues(newState)
  }

  const handleSubmit = e => {
    e.preventDefault();
    fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            entry(${Object.entries(values).map(([key, value], i) => {
              const comma = i !== Object.entries(values).length - 1 ? ', ' : '';
              if (typeof value === 'string') {
                return `${key}: "${value}"${comma}`
              } else {
                return `${key}: [${arrayString(value, { quotes: 'double' })}]${comma}`
              }
            })}) {
              title
            }
          }`,
      }),
    })
      .then(data => data.json())
      .then(response => {
        console.log(response)
        onSubmit();
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label style={{ display: 'inline-block', width: '100px' }}>Post Type</label>
        <select name="type" value={values.type || ''} onChange={handleChange}>
          <option>Select a post type</option>
          {types ? types.map((type, i) => (
            <option key={i} value={type.id}>{type.name}</option>
          )) : null}
        </select>
      </div>
      <div>
        <label style={{ display: 'inline-block', width: '100px' }}>Title</label>
        <input name="title" type="text" value={values.title} onChange={handleChange} />
      </div>
      <div>
        <label style={{ display: 'inline-block', width: '100px' }}>Body</label>
        <textarea name="body" value={values.body} onChange={handleChange} />
      </div>
      <div>
        <label style={{ display: 'inline-block', width: '100px' }}>Link</label>
        <input name="link" type="url" value={values.link} onChange={handleChange} />
      </div>
      <TagsInput handleTagsChange={handleTagsChange} />
      <button>submit</button>
    </form>
  )
}

export default Form;