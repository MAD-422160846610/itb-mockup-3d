module.exports = {
  ci: {
    collect: {
      url: ['https://mad-422160846610.github.io/itb-mockup-3d/'],
      settings: {
        presets: ['perf', 'a11y', 'bp', 'seo']
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
