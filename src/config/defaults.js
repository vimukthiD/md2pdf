'use strict';

const defaults = {
  footer: {
    enabled: true,
    left: '© {year} - {website} | {email}',
    right: 'Page {page} / {total}',
    fontSize: '9px',
    color: '#666666',
    padding: '5px 20px'
  },
  header: {
    enabled: false,
    left: '',
    center: '',
    right: '',
    fontSize: '9px',
    color: '#666666',
    padding: '5px 20px'
  },
  page: {
    format: 'A4',
    margin: {
      top: '2cm',
      right: '2cm',
      bottom: '2.5cm',
      left: '2cm'
    },
    printBackground: true
  },
  style: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333333',
    h1: {
      color: '#2c3e50',
      borderBottom: '3px solid #3498db',
      fontSize: '32px'
    },
    h2: {
      color: '#34495e',
      borderBottom: '2px solid #95a5a6',
      fontSize: '24px'
    },
    h3: {
      color: '#34495e',
      fontSize: '20px'
    },
    code: {
      backgroundColor: '#f4f4f4',
      color: '#e74c3c',
      fontSize: '13px'
    },
    codeBlock: {
      backgroundColor: '#f8f8f8',
      border: '1px solid #ddd',
      fontSize: '13px'
    },
    table: {
      headerBackground: '#3498db',
      headerColor: '#ffffff',
      borderColor: '#dddddd'
    },
    blockquote: {
      borderLeft: '4px solid #3498db',
      backgroundColor: '#f9f9f9',
      color: '#666666'
    },
    link: {
      color: '#3498db'
    }
  },
  variables: {
    website: 'https://example.com',
    email: 'contact@example.com',
    author: 'Author Name',
    company: 'Company Name',
    year: 'auto'
  },
  output: {
    displayHeaderFooter: true,
    preferCSSPageSize: false
  },
  toc: {
    enabled: false,
    position: 'start',
    depth: 3,
    title: 'Table of Contents'
  }
};

function getDefaults() {
  return JSON.parse(JSON.stringify(defaults));
}

function generateDefaultConfig() {
  return {
    "$schema": "https://vimukthid.dev/md2pdf/schema.json",
    footer: {
      enabled: true,
      left: "© {year} - {website} | {email}",
      right: "Page {page} / {total}",
      fontSize: "9px",
      color: "#666666"
    },
    variables: {
      website: "https://example.com",
      email: "contact@example.com",
      author: "Your Name"
    },
    page: {
      format: "A4",
      margin: {
        top: "2cm",
        right: "2cm",
        bottom: "2.5cm",
        left: "2cm"
      }
    }
  };
}

module.exports = {
  getDefaults,
  generateDefaultConfig,
  defaults
};
