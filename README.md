# Develop a GraphQL server to manage books and authors, enabling querying and mutations.
 git clone 
# Initialize a new Node.js project: 
. npm init -y
# Install the required dependencies:
. npm install @apollo/server graphql
# Run the server:
. node index.js

# Testing the API
Once your server is running, open http://localhost:4000/ in your browser to access Apollo Sandbox. There you can test queries and mutations like:
- Query all books with their authors:
 ```
query GetAllBooks {
  books {
    id
    title
    author {
      id
      name
    }
  }
}
```
- Query all authors with their books:
```
query GetAllAuthors {
  authors {
    id
    name
    books {
      id
      title
    }
  }
}
```
- Add a new author:
```
mutation AddAuthor {
  addAuthor(name: "J.K. Rowling") {
    id
    name
  }
}
```
- Add a new book for an existing author:
```
mutation AddBook {
  addBook(title: "Harry Potter", authorId: "3") {
    id
    title
    author {
      name
    }
  }
}
```



