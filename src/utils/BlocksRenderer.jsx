import React from 'react';
import { BlocksRenderer as StrapiBlocksRenderer } from '@strapi/blocks-react-renderer';

/**
 * Wrapper component for rendering Strapi Blocks content
 * Handles both new Blocks format (array) and legacy richtext format (string)
 *
 * @param {Object} props
 * @param {Array|string} props.content - Blocks content from Strapi or legacy string
 * @returns {JSX.Element}
 */
export const BlocksRenderer = ({ content }) => {
  // If content is null or undefined, return null
  if (!content) return null;

  // Legacy support: if content is a string (old richtext format)
  if (typeof content === 'string') {
    // Split by newlines and render as paragraphs
    const lines = content.split('\n').filter(line => line.trim());
    return (
      <div className="space-y-2">
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  }

  // If content is array (Blocks format), use Strapi renderer
  if (Array.isArray(content)) {
    return <StrapiBlocksRenderer content={content} />;
  }

  // Fallback: render as-is
  return <div>{String(content)}</div>;
};

export default BlocksRenderer;
