import React from 'react';
import ChatClient from './components/ChatClient';

export const metadata = {
  title: 'JainGPT — A Real Jainism Product',
  description: 'Ask JainGPT about scriptures, philosophy, and practice — in Hindi or English. Grounded in authentic Jain Agams and Sutras.',
};

export default function ChatPage() {
  return <ChatClient />;
}
