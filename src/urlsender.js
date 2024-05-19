import React from 'react';
import { createRoot } from 'react-dom/client';
import URLSender from './components/URLSender';

const root = createRoot(document.getElementById('urlsender-container'));
root.render(<URLSender />);
