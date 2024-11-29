// src/components/layout/Footer.tsx
import React from 'react'
import { Footer as FlowbiteFooter } from 'flowbite-react'

export const Footer = () => {
  return (
    <FlowbiteFooter
      container
      className="bg-white border-t border-gray-200 py-4 mt-8"
    >
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-gray-600">
          © 2024 Knowledge Graph Verification System. All rights reserved. The
          meme is modified form of react-on-lambda by{' '}
          <a
            href="https://github.com/sultan99/react-on-lambda"
            className="text-blue-500 hover:underline"
          >
            Sultan
          </a>
          .
        </p>
      </div>
    </FlowbiteFooter>
  )
}
