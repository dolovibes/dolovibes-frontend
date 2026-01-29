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

  // If content is an empty array, return null
  if (Array.isArray(content) && content.length === 0) return null;

  // Legacy support: if content is a string (old richtext format)
  if (typeof content === 'string') {
    // Try to parse as JSON in case it's a stringified blocks array
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return <StrapiBlocksRenderer content={parsed} />;
      }
    } catch {
      // Not JSON, treat as plain text
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length === 0) return null;
      return (
        <div className="space-y-2">
          {lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    }
  }

  // If content is an object (single block node), wrap it in an array
  if (typeof content === 'object' && !Array.isArray(content)) {
    // Check if it's a valid block node with type and children
    if (content.type && content.children) {
      return <StrapiBlocksRenderer content={[content]} />;
    }
    console.warn('BlocksRenderer received unexpected object:', content);
    return null;
  }

  // If content is array (Blocks format), use Strapi renderer
  if (Array.isArray(content)) {
    // Validate that array items are proper block objects
    const isValidBlocks = content.every(
      item => item && typeof item === 'object' && item.type && item.children
    );

    if (!isValidBlocks) {
      console.warn('BlocksRenderer received invalid blocks array:', content);
      return null;
    }

    return <StrapiBlocksRenderer content={content} />;
  }

  // Fallback for other types
  return <div>{String(content)}</div>;
};

export default BlocksRenderer;
