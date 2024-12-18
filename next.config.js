// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
      'antd',
      '@ant-design/icons',
      '@ant-design/icons-svg',
      '@ant-design/cssinjs',
      'rc-util',
      'rc-pagination',
      'rc-picker',
      'rc-input',
      'rc-trigger',
      'rc-tooltip',
      'rc-cascader',
      'rc-checkbox',
      'rc-dropdown',
      'rc-menu',
      'rc-tree',
      'rc-table',
      'rc-select',
      'rc-tabs',
      'rc-overflow',
      'rc-field-form',
      'rc-motion'
    ],
    images: {
      domains: ['creditdharma.in'],
    },
    webpack: (config) => {
      // Handle all ES module imports
      config.resolve.alias = {
        ...config.resolve.alias,
        'antd/es': 'antd/lib',
        '@ant-design/icons/es': '@ant-design/icons/lib',
        'rc-picker/es': 'rc-picker/lib',
        'rc-util/es': 'rc-util/lib',
        'rc-pagination/es': 'rc-pagination/lib',
        'rc-input/es': 'rc-input/lib',
        'rc-trigger/es': 'rc-trigger/lib',
        'rc-table/es': 'rc-table/lib',
        'rc-select/es': 'rc-select/lib',
      };
  
      // Add specific handling for locale files
      config.resolve.alias['rc-picker/es/locale/en_US'] = 'rc-picker/lib/locale/en_US';
      
      return config;
    }
  };
  
  module.exports = nextConfig;