import type { MDXComponents } from "mdx/types";
import {
  Button,
  Column,
  Container,
  ElImage,
  ElMap,
  Emoji,
  Heading,
  IconList,
  ImageBox,
  InlineImage,
  Section,
  SmartLink,
  SocialIcons,
  Text,
  Widget,
} from "@/components/elementor/Blocks";
import { Accordion, Item, Toggle } from "@/components/elementor/Tabs";
import PostGrid from "@/components/elementor/PostGrid";

/** Components available to every MDX file (content/pages, content/blog). */
const components: MDXComponents = {
  Section,
  Column,
  Container,
  Heading,
  Text,
  Image: ElImage,
  Button,
  Accordion,
  Toggle,
  Item,
  ImageBox,
  SocialIcons,
  IconList,
  Map: ElMap,
  Widget,
  PostGrid,
  Emoji,
  InlineImage,
  // Links written as [text](url "_blank") open in a new tab, like target="_blank" on WordPress.
  a: ({ href = "", children, title, ...rest }) =>
    title === "_blank" ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    ) : (
      <SmartLink href={href} title={title} {...rest}>
        {children}
      </SmartLink>
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
