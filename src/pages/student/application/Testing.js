import { useState } from 'react';
import { Document, Page } from 'react-pdf';

function Testing() {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const pdfURL ="https://krjbvheswqjogqffdfoq.supabase.co/storage/v1/object/public/Application/a83429bd-0e22-49ac-bd57-07e6c71f8e4b/0/certificate";

  return (
    <iframe 
    src={pdfURL} 
    width="100%" 
    height="500px"
    title="Embedded PDF">
</iframe>
  );
}

export default Testing;
