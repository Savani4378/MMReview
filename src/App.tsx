/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReviewPage } from './pages/ReviewPage';
import { useEffect } from 'react';

const AdminRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://meetmosaicreviews.netlify.app/admin';
  }, []);
  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReviewPage />} />
        <Route path="/admin" element={<AdminRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
