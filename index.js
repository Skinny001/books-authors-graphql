// Import required packages
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Define our type definitions (schema)
const typeDefs = `
  # An Author has an id, name, and a list of books they've written
  type Author {
    id: ID!
    name: String!
    books: [Book]    # Relationship to books
  }

  # A Book has an id, title, and an author
  type Book {
    id: ID!
    title: String!
    author: Author!    # Relationship to author
  }

  # The Query type defines what data can be fetched
  type Query {
    books: [Book]          # Get all books
    book(id: ID!): Book    # Get a book by ID
    authors: [Author]      # Get all authors
    author(id: ID!): Author # Get an author by ID
  }

  # The Mutation type defines operations that change data
  type Mutation {
    addBook(title: String!, authorId: ID!): Book          # Add a new book
    addAuthor(name: String!): Author                      # Add a new author
    updateBook(id: ID!, title: String, authorId: ID): Book # Update a book
    updateAuthor(id: ID!, name: String): Author           # Update an author
    deleteBook(id: ID!): Boolean                          # Delete a book
    deleteAuthor(id: ID!): Boolean                        # Delete an author
  }
`;

// Sample data
let authors = [
  {
    id: '1',
    name: 'F. Scott Fitzgerald',
  },
  {
    id: '2',
    name: 'Sir-Adekunle',
  },
];

let books = [
  {
    id: '1',
    title: 'A Time to Kill',
    authorId: '1',
  },
  {
    id: '2',
    title: 'A Good Man is Hard to Find',
    authorId: '2',
  },
  {
    id: '3',
    title: 'Tender Is the Night',
    authorId: '1',
  },
];

// Define resolvers (functions that return data for each field)
const resolvers = {
  // Resolve the relationship between Book and Author
  Book: {
    // For each book, find its author
    author: (book) => {
      return authors.find(author => author.id === book.authorId);
    },
  },
  
  // Resolve the relationship between Author and Books
  Author: {
    // For each author, find all their books
    books: (author) => {
      return books.filter(book => book.authorId === author.id);
    },
  },

  // Queries
  Query: {
    // Return all books
    books: () => books,
    
    // Return a specific book by ID
    book: (_, { id }) => {
      return books.find(book => book.id === id);
    },
    
    // Return all authors
    authors: () => authors,
    
    // Return a specific author by ID
    author: (_, { id }) => {
      return authors.find(author => author.id === id);
    },
  },
  
  // Mutations
  Mutation: {
    // Add a new book and return it
    addBook: (_, { title, authorId }) => {
      // Check if author exists
      const authorExists = authors.some(author => author.id === authorId);
      if (!authorExists) {
        throw new Error(`Author with ID ${authorId} does not exist`);
      }
      
      const newBook = {
        id: String(books.length + 1),
        title,
        authorId,
      };
      books.push(newBook);
      return newBook;
    },
    
    // Add a new author and return it
    addAuthor: (_, { name }) => {
      const newAuthor = {
        id: String(authors.length + 1),
        name,
      };
      authors.push(newAuthor);
      return newAuthor;
    },
    
    // Update a book and return it
    updateBook: (_, { id, title, authorId }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) {
        throw new Error(`Book with ID ${id} does not exist`);
      }
      
      // If authorId is provided, check if author exists
      if (authorId) {
        const authorExists = authors.some(author => author.id === authorId);
        if (!authorExists) {
          throw new Error(`Author with ID ${authorId} does not exist`);
        }
        books[bookIndex].authorId = authorId;
      }
      
      // Update title if provided
      if (title) {
        books[bookIndex].title = title;
      }
      
      return books[bookIndex];
    },
    
    // Update an author and return it
    updateAuthor: (_, { id, name }) => {
      const authorIndex = authors.findIndex(author => author.id === id);
      if (authorIndex === -1) {
        throw new Error(`Author with ID ${id} does not exist`);
      }
      
      if (name) {
        authors[authorIndex].name = name;
      }
      
      return authors[authorIndex];
    },
    
    // Delete a book and return success/failure
    deleteBook: (_, { id }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) {
        return false;
      }
      
      books = books.filter(book => book.id !== id);
      return true;
    },
    
    // Delete an author and return success/failure
    deleteAuthor: (_, { id }) => {
      const authorIndex = authors.findIndex(author => author.id === id);
      if (authorIndex === -1) {
        return false;
      }
      
      // Check if author has books
      const hasBooks = books.some(book => book.authorId === id);
      if (hasBooks) {
        // Option 1: Throw error
        // throw new Error(`Cannot delete author with ID ${id} because they have books`);
        
        // Option 2: Delete author's books as well
        books = books.filter(book => book.authorId !== id);
      }
      
      authors = authors.filter(author => author.id !== id);
      return true;
    },
  },
};

// Create an Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀 Server ready at: ${url}`);
}

startServer();