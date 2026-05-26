import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import '../css/Account.css';

const GET_ME = gql`
  query Me {
    me { id name email }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($name: String!) {
    updateUser(name: $name) { id name email }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser
  }
`;

export default function Account() {
  const { logout, updateUser: updateAuthUser } = useAuth();
  const { data, loading } = useQuery(GET_ME);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_ME }],
  });
  const [deleteUser] = useMutation(DELETE_USER);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data: result } = await updateUser({ variables: { name } });
      updateAuthUser({ name: result.updateUser.name });
      setMessage('Name updated.');
      setName('');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your account? This cannot be undone.')) return;
    try {
      await deleteUser();
      logout();
      window.location.href = '/';
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <main id="account"><p>Loading...</p></main>;

  const user = data?.me;

  return (
    <main id="account">
      <section className="account-section">
        <h2>Profile</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </section>

      <section className="account-section">
        <h2>Update Name</h2>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={user?.name}
            maxLength={30}
            required
          />
          <button type="submit">Save</button>
        </form>
        {message && <p>{message}</p>}
      </section>

      <section className="account-section">
        <h2>Danger Zone</h2>
        <button className="delete-account-btn" onClick={handleDelete}>Delete Account</button>
      </section>
    </main>
  );
}
