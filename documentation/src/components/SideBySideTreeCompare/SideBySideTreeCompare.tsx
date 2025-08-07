import React, { useEffect, useState } from 'react';
import ReactJson from '@microlinkhq/react-json-view';
import ReactXmlViewer from 'react-xml-viewer';

interface Props {
  jsonData: any;
  xmlUrl: string;
  jsonLabel?: string;
  xmlLabel?: string;
}

export const SideBySideTreeCompare: React.FC<Props> = ({
  jsonData,
  xmlUrl,
  jsonLabel = 'JSON',
  xmlLabel = 'XML'
}) => {
  const [xml, setXml] = useState<string | null>(null);

  useEffect(() => {
    if (xmlUrl) {
      fetch(xmlUrl)
        .then(response => response.text())
        .then(setXml)
        .catch(() => setXml(null));
    }
  }, [xmlUrl]);

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
          <ReactJson src={jsonData} name={null} collapsed={2} style={{ fontSize: 13 }} />
        ) : (
          <span style={{color: 'red'}}>JSON not found</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflow: 'auto' }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{xmlLabel}</div>
        {xml
          ? <ReactXmlViewer xml={xml} collapsible style={{ fontSize: 13 }} />
          : xmlUrl
            ? 'Loading...'
            : <span style={{color: 'red'}}>XML not found</span>
        }
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
};
