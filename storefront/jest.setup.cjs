// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom')

// Mock environment variables
process.env.NEXT_PUBLIC_SALEOR_API_URL = 'http://localhost:8000/graphql/'
process.env.NEXT_PUBLIC_DEFAULT_CHANNEL = 'channel-pln'
process.env.NEXT_PUBLIC_STOREFRONT_URL = 'http://localhost:3000'
