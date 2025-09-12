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


// Componente principal da aplicação
const App: React.FC = () => {
  // Estado para armazenar a lista de posts
  const [posts, setPosts] = useState<Post[]>([]);
  // Estado para controlar o status de carregamento da requisição
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para armazenar qualquer erro que possa ocorrer na chamada da API
  const [error, setError] = useState<string | null>(null);

  // useEffect é usado para executar efeitos colaterais em componentes funcionais.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/?userId=8');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Post[] = await response.json();
        setPosts(data);
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
    fetchPosts();
  }, []);

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
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <h2 className="post-title">
                  {post.title}
                </h2>
                <p className="post-body">
                  {post.body}
                </p>
                <span className="user-id-badge">
                  User ID: {post.userId}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

