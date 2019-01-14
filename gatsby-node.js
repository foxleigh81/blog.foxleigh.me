/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path')

const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  // Register templates
  const templateRegister = {
    nosidebar: path.resolve('src/templates/nosidebar.js'),
    withsidebar: path.resolve('src/templates/withsidebar.js'),
    landing: path.resolve('src/templates/landing.js'),
  }

  return graphql(`
    {
      allMarkdownRemark(
        limit: 1000
      ) {
        edges {
          node {
            fields{
              slug
            }
            frontmatter {
              template
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }
    return result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      // Use a template if specified in mardown frontmatter,
      // otherwise use the article template by default
      const component = (node.frontmatter.template)
        ? templateRegister[node.frontmatter.template]
        : templateRegister.nosidebar

      createPage({
        path: node.fields.slug,
        component,
        context: {
          slug: node.fields.slug,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  // Add slug to MarkdownRemark node
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'library' })
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
  }
}
