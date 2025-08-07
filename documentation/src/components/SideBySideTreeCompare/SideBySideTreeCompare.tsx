import React, { useEffect, useState } from 'react'
import ReactJson from '@microlinkhq/react-json-view'
import ReactXmlViewer from 'react-xml-viewer'

interface Props {
  baseName: string // without extension, e.g. 'TS-01-identifiers'
  jsonLabel?: string
  xmlLabel?: string
}

export const SideBySideTreeCompare: React.FC<Props> = ({
  baseName,
  jsonLabel = 'JSON',
  xmlLabel = 'XML',
}) => {
  const [json, setJson] = useState<any>(null)
  const [xml, setXml] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/output/fhir-ms/${baseName}.json`)
      .then(r => r.json())
      .then(setJson)
    fetch(`/output/ms/${baseName}.xml`)
      .then(r => r.text())
      .then(setXml)
  }, [baseName])

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
        {json ? (
          <ReactJson src={json} name={null} collapsed={2} style={{ fontSize: 13 }} />
        ) : (
          'Loading...'
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflow: 'auto' }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{xmlLabel}</div>
        {xml ? (
          <ReactXmlViewer xml={xml} collapsible style={{ fontSize: 13 }} />
        ) : (
          'Loading...'
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
  )
}
