import React, { useState, useEffect } from 'react';
import './App.css';

// Define a tipagem para os objetos de post que virão da API
// Isso ajuda a evitar erros e melhora a autocompletação do código.

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}
// Define a tipagem para os objetos de usuário que virão da API
interface User {
  id: number;
  name: string;
  email: string;
}
interface comments {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}




// Componente principal da aplicação
const App: React.FC = () => {
  // Estado para armazenar a lista de posts
  const [posts, setPosts] = useState<Post[]>([]);
  // Estado para controlar o status de carregamento da requisição
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para armazenar qualquer erro que possa ocorrer na chamada da API
  const [error, setError] = useState<string | null>(null);
// Estado para armazenar a lista de usuários
  const [users, setUsers] = useState<User[]>([]);
// Estado para armazenar a lista de comentários
  const [comments, setComments] = useState<comments[]>([]);
 

  // useEffect é usado para executar efeitos colaterais em componentes funcionais.
  // Aqui, ele é usado para buscar os posts, usuários e comentários da API quando o componente é montado.
  useEffect(() => {
    const fetchData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const [postsResponse, commentsResponse, usersResponse] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/comments'),
        fetch('https://jsonplaceholder.typicode.com/users')
      ]);

      if (!postsResponse.ok || !usersResponse.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const postsData: Post[] = await postsResponse.json();
      const commentsData: comments[] = await commentsResponse.json();
      const usersData: User[] = await usersResponse.json();

      setComments(commentsData);
      setPosts(postsData);
      setUsers(usersData);
      setError(null);

    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Ocorreu um erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
   
// Renderização condicional baseada no estado de carregamento e erro

  if (loading) {
    return (
      <div className="loading-screen">
        <p className="loading-text">Carregando posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p className="error-text">Erro ao buscar dados: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="app">
        <div className="container">
          <h1 className="main-title">
            Blog Posts - JSONPlaceholder
          </h1>
          <div className="text-columns">
            {posts.map((post) => {
              const user = users.find(u => u.id === post.userId);
              const postComments = comments.filter(comment => comment.postId === post.id);
              return (
                <div key={post.id} className="post-text-block">
                  <span className="post-author">{user?.name} diz:</span>
                  <span className="post-title">{post.title}</span>
                  <span className="post-body">{post.body}</span>
                  {postComments.length > 0 && (
                    <>
                      <div className="comments-title">Comentários</div>
                      <ul className="comments-list">
                        {postComments.map((comment) => (
                          <li key={comment.id}>
                            <strong>{comment.name}</strong>: {comment.body}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <img
                    src={`https://picsum.photos/400/200?random=${post.id}`}
                    alt="Imagem aleatória"
                    className="post-image"
                    style={{ width: '100%', marginTop: '1rem', borderRadius: '8px' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

