import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface Props {
  jsonData: any;
  xmlData: any;
  jsonLabel?: string;
  xmlLabel?: string;
}

const SideBySideTreeCompare: React.FC<Props> = ({
  jsonData,
  xmlData,
  jsonLabel = 'JSON',
  xmlLabel = 'XML'
}) => {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const ReactJsonView = require('@microlink/react-json-view').default;
        const ReactXmlViewer = require('react-xml-viewer').default;
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 16,
            width: '100%',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflow: 'auto' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{jsonLabel}</div>
              {jsonData ? (
                <ReactJsonView src={jsonData} name={null} collapsed={2} style={{ fontSize: 13 }} />
              ) : (
                <span style={{color: 'red'}}>JSON not found</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflow: 'auto' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{xmlLabel}</div>
              {xmlData ? (
                <ReactXmlViewer xml={xmlData} collapsible style={{ fontSize: 13 }} />
              ) : (
                <span style={{color: 'red'}}>XML not found</span>
              )}
            </div>
            <style>
              {`
                @media (max-width: 900px) {
                  div[style*="flex-direction: row"] {
                    flex-direction: column !important;
                  }
                }
              `}
            </style>
          </div>
        );
      }}
    </BrowserOnly>
  );
};

export default SideBySideTreeCompare;
