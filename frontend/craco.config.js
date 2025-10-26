const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@ui': path.resolve(__dirname, 'src/components/ui'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@session': path.resolve(__dirname, 'src/session'),
      '@types': path.resolve(__dirname, 'src/types'),
      // also support bare aliases used previously
      src: path.resolve(__dirname, 'src'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
        '^@lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@session/(.*)$': '<rootDir>/src/session/$1',
        '^@types/(.*)$': '<rootDir>/src/types/$1',
      },
    },
  },
};
