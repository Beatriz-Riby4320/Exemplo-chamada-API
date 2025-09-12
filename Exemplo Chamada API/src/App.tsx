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
 

  // useEffect é usado para executar efeitos colaterais em componentes funcionais.
  // Aqui, ele é usado para buscar os posts e usuários da API quando o componente é montado.
  useEffect(() => {
    const fetchData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const [postsResponse, usersResponse] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/users')
      ]);

      if (!postsResponse.ok || !usersResponse.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const postsData: Post[] = await postsResponse.json();
      const usersData: User[] = await usersResponse.json();

      setPosts(postsData);
      setUsers(usersData);
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
   
// Função para obter o nome e email do usuário pelo ID
  const getUserInfo = (userId: number) => {
  const user = users.find(u => u.id === userId);
  return user ? `${user.name} (${user.email})` : `Usuário ${userId}`;
};

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
                {/*Exibe o nome e email do autor do post*/}
                {/* comentários dentro do retorno do JSX precisam estar entre chaves */}
                <span className="user-id-badge">
                  Autor: {getUserInfo(post.userId)}
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

