import React from 'react';
import { BlocksRenderer as StrapiBlocksRenderer } from '@strapi/blocks-react-renderer';

/**
 * Custom blocks configuration with Tailwind CSS classes
 * Adds proper spacing for paragraphs, lists, headings, etc.
 */
const customBlocks = {
  paragraph: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  list: ({ children, format }) => {
    const className = "mb-4 last:mb-0 space-y-2";
    if (format === 'ordered') {
      return <ol className={`${className} list-decimal list-inside`}>{children}</ol>;
    }
    return <ul className={`${className} list-disc list-inside`}>{children}</ul>;
  },
  'list-item': ({ children }) => <li className="ml-4">{children}</li>,
  heading: ({ children, level }) => {
    const Tag = `h${level}`;
    const classes = {
      1: 'text-3xl font-bold mb-4 mt-6 first:mt-0',
      2: 'text-2xl font-bold mb-3 mt-5 first:mt-0',
      3: 'text-xl font-bold mb-3 mt-4 first:mt-0',
      4: 'text-lg font-bold mb-2 mt-3 first:mt-0',
      5: 'text-base font-bold mb-2 mt-3 first:mt-0',
      6: 'text-sm font-bold mb-2 mt-2 first:mt-0',
    };
    return <Tag className={classes[level]}>{children}</Tag>;
  },
  link: ({ children, url }) => (
    <a href={url} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
  ),
  quote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
  ),
};

/**
 * Extract plain text from Strapi Blocks content
 * Useful for summaries, meta descriptions, or anywhere plain text is needed
 *
 * @param {Array|string|object} content - Blocks content from Strapi
 * @returns {string} Plain text extracted from blocks
 */
export const extractTextFromBlocks = (content) => {
  if (!content) return '';

  // If it's already a string, return it
  if (typeof content === 'string') {
    return content;
  }

  // If it's a single block object, wrap in array
  if (typeof content === 'object' && !Array.isArray(content)) {
    if (content.type && content.children) {
      content = [content];
    } else {
      return '';
    }
  }

  // If it's an array of blocks, extract text from each
  if (Array.isArray(content)) {
    return content
      .map(block => {
        if (block.children && Array.isArray(block.children)) {
          return block.children
            .map(child => {
              if (child.type === 'text' && child.text) {
                return child.text;
              }
              // Handle nested children (links, etc)
              if (child.children && Array.isArray(child.children)) {
                return child.children
                  .filter(c => c.type === 'text' && c.text)
                  .map(c => c.text)
                  .join('');
              }
              return '';
            })
            .join('');
        }
        return '';
      })
      .join(' ')
      .trim();
  }

  return '';
};

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
        return <StrapiBlocksRenderer content={parsed} blocks={customBlocks} />;
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
      return <StrapiBlocksRenderer content={[content]} blocks={customBlocks} />;
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

    return <StrapiBlocksRenderer content={content} blocks={customBlocks} />;
  }

  // Fallback for other types
  return <div>{String(content)}</div>;
};

export default BlocksRenderer;
