import BlogHeading from '@/components/mdx_components/blogHeading/blogHeading';

const COMPONENT_MAP = {
  h1: (props) => <BlogHeading level={1} {...props} />,
  h2: (props) => <BlogHeading level={2} {...props} />,
  h3: (props) => <BlogHeading level={3} {...props} />,
};

export default COMPONENT_MAP;
