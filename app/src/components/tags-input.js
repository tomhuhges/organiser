import React, { useState, useEffect } from 'react';

const TagsInput = ({ handleTagsChange }) => {
  const [tags, setTags] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    handleTagsChange(tags);
  }, [tags]);

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setTags([...tags, text]);
      setText('');
    }
  }

  const handleChange = e => {
    setText(e.target.value);
  }

  return (
    <div>
      <label style={{ display: 'inline-block', width: '100px' }}>Tags</label>
      <div>
        {tags.map((tag, i) => (
          <span key={i}>{tag} x</span>
        ))}
      </div>
      <div>
        <input name="tags" type="url" value={text} onChange={handleChange} onKeyPress={handleKeyPress} />
      </div>
    </div>
  )
}

export default TagsInput;