import React from 'react';
import marked from 'marked';
import './markdown-styles.css';

const Markdown = ({ source }) => (
  <div
    className="markdown--container"
    dangerouslySetInnerHTML={{ __html: marked(source) }}
  />
);

export default Markdown;
