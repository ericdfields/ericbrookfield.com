import { visit } from 'unist-util-visit';

export function remarkFixImagePaths() {
  return function transformer(tree) {
    visit(tree, 'image', (node) => {
      // Replace ericbrookfield.com/uploads with local blog-images path
      if (node.url && node.url.includes('ericbrookfield.com/uploads')) {
        node.url = node.url.replace(
          'https://ericbrookfield.com/uploads',
          '/blog-images'
        );
      }
    });

    // Also handle HTML img tags
    visit(tree, 'html', (node) => {
      if (node.value && node.value.includes('ericbrookfield.com/uploads')) {
        node.value = node.value.replace(
          /https:\/\/ericbrookfield\.com\/uploads/g,
          '/blog-images'
        );
      }
    });
  };
}
