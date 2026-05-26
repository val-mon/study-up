import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { ARROW, ICON_DELETE } from '../utils/constants';
import '../css/Dashboard.css';

const GET_WEATHER = gql`
  query GetWeather($city: String!) {
    weather(city: $city) { city temperature wind }
  }
`;

const GET_PINNED_TASKS = gql`
  query GetPinnedTasks {
    myTasks(pinned: true) { id title done courseId courseName }
  }
`;

const GET_PINNED_DATES = gql`
  query GetPinnedDates {
    myPinnedDates { id text courseId courseName }
  }
`;

const GET_REMINDERS = gql`
  query GetReminders {
    myReminders { id text done }
  }
`;

const GET_QUICKLINKS = gql`
  query GetQuicklinks {
    myQuicklinks { id label url }
  }
`;

const TOGGLE_TASK = gql`
  mutation ToggleTask($id: ID!) {
    toggleTask(id: $id) { id done }
  }
`;

const PIN_TASK = gql`
  mutation PinTask($id: ID!, $pinned: Boolean!) {
    pinTask(id: $id, pinned: $pinned) { id pinned }
  }
`;

const EDIT_TASK = gql`
  mutation EditTask($id: ID!, $title: String!) {
    editTask(id: $id, title: $title) { id title }
  }
`;

const PIN_DATE = gql`
  mutation PinDate($courseId: ID!, $dateId: ID!, $pinned: Boolean!) {
    pinDate(courseId: $courseId, dateId: $dateId, pinned: $pinned) { id pinned }
  }
`;

const EDIT_DATE = gql`
  mutation EditDate($courseId: ID!, $dateId: ID!, $text: String!) {
    editDate(courseId: $courseId, dateId: $dateId, text: $text) { id text }
  }
`;

const ADD_REMINDER = gql`
  mutation AddReminder($text: String!) {
    addReminder(text: $text) { id text done }
  }
`;

const TOGGLE_REMINDER = gql`
  mutation ToggleReminder($id: ID!) {
    toggleReminder(id: $id) { id done }
  }
`;

const DELETE_REMINDER = gql`
  mutation DeleteReminder($id: ID!) {
    deleteReminder(id: $id)
  }
`;

const EDIT_REMINDER = gql`
  mutation EditReminder($id: ID!, $text: String!) {
    editReminder(id: $id, text: $text) { id text }
  }
`;

const ADD_QUICKLINK = gql`
  mutation AddQuicklink($label: String!, $url: String!) {
    addQuicklink(label: $label, url: $url) { id label url }
  }
`;

const EDIT_QUICKLINK = gql`
  mutation EditQuicklink($id: ID!, $label: String!, $url: String!) {
    editQuicklink(id: $id, label: $label, url: $url) { id label url }
  }
`;

const DELETE_QUICKLINK = gql`
  mutation DeleteQuicklink($id: ID!) {
    deleteQuicklink(id: $id)
  }
`;

function Weather() {
  const [city, setCity] = useState(() => localStorage.getItem('weatherCity') || 'Sion');
  const [input, setInput] = useState('');
  const { data, loading } = useQuery(GET_WEATHER, { variables: { city } });

  const handleCity = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    localStorage.setItem('weatherCity', input.trim());
    setCity(input.trim());
    setInput('');
  };

  return (
    <section className="weather">
      <h1>{ARROW} Weather</h1>
      <div className="inner_cart">
        {loading ? <p>Loading...</p> : (
          <ul>
            <li>{data?.weather.city}</li>
            <li>Temperature : {data?.weather.temperature}°C</li>
            <li>Wind : {data?.weather.wind} km/h</li>
          </ul>
        )}
        <form className="city-form" onSubmit={handleCity}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Change city..."
          />
          <button type="submit">Go</button>
        </form>
      </div>
    </section>
  );
}

function Tasks() {
  const { data, loading } = useQuery(GET_PINNED_TASKS, { fetchPolicy: 'network-only' });
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const refetch = { refetchQueries: [{ query: GET_PINNED_TASKS }] };
  const [toggleTask] = useMutation(TOGGLE_TASK, refetch);
  const [pinTask] = useMutation(PIN_TASK, refetch);
  const [editTask] = useMutation(EDIT_TASK, refetch);

  const startEdit = (task) => { setEditingId(task.id); setEditValue(task.title); };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = async (id) => {
    if (editValue.trim()) await editTask({ variables: { id, title: editValue.trim() } });
    setEditingId(null);
  };

  return (
    <section className="tasks">
      <h1>{ARROW} Tasks</h1>
      <div className="inner_cart">
        {loading ? <p>Loading...</p> : data?.myTasks.length === 0 ? (
          <p>No pinned tasks</p>
        ) : (
          data?.myTasks.map(task => (
            <div key={task.id} className="task-item">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask({ variables: { id: task.id } })}
              />
              {editingId === task.id ? (
                <input
                  className="edit-input"
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => saveEdit(task.id)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(task.id); if (e.key === 'Escape') cancelEdit(); }}
                />
              ) : (
                <span style={{ flex: 1, textDecoration: task.done ? 'line-through' : 'none' }}>
                  {task.title} <small>({task.courseName})</small>
                </span>
              )}
              <button className="edit-btn" onClick={() => startEdit(task)}>Edit</button>
              <button className="unpin-btn" onClick={() => pinTask({ variables: { id: task.id, pinned: false } })}>Unpin</button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function Quicklinks() {
  const { data, loading } = useQuery(GET_QUICKLINKS, { fetchPolicy: 'network-only' });
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const refetch = { refetchQueries: [{ query: GET_QUICKLINKS }] };
  const [addQuicklink] = useMutation(ADD_QUICKLINK, refetch);
  const [editQuicklink] = useMutation(EDIT_QUICKLINK, refetch);
  const [deleteQuicklink] = useMutation(DELETE_QUICKLINK, refetch);

  const startEdit = (link) => { setEditingId(link.id); setEditLabel(link.label); setEditUrl(link.url); };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = async (id) => {
    if (editLabel.trim() && editUrl.trim()) await editQuicklink({ variables: { id, label: editLabel.trim(), url: editUrl.trim() } });
    setEditingId(null);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newLabel.trim() || !newUrl.trim()) return;
    await addQuicklink({ variables: { label: newLabel.trim(), url: newUrl.trim() } });
    setNewLabel('');
    setNewUrl('');
  };

  return (
    <section className="quicklinks">
      <h1>{ARROW} Quicklinks</h1>
      <div className="inner_cart">
        {loading ? <p>Loading...</p> : data?.myQuicklinks.map(link => (
          <div key={link.id} className="task-item">
            {editingId === link.id ? (
              <>
                <input
                  className="edit-input"
                  autoFocus
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(link.id); if (e.key === 'Escape') cancelEdit(); }}
                  placeholder="Label..."
                />
                <input
                  className="edit-input"
                  value={editUrl}
                  onChange={e => setEditUrl(e.target.value)}
                  onBlur={() => saveEdit(link.id)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(link.id); if (e.key === 'Escape') cancelEdit(); }}
                  placeholder="https://..."
                />
              </>
            ) : (
              <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>{link.label}</a>
            )}
            <button className="edit-btn" onClick={() => startEdit(link)}>Edit</button>
            <button className="delete-item-btn" onClick={() => deleteQuicklink({ variables: { id: link.id } })}>{ICON_DELETE}</button>
          </div>
        ))}
        <form className="add-inline-form" onSubmit={handleAdd}>
          <input
            type="text"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="Label..."
          />
          <input
            type="url"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="https://..."
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </section>
  );
}

function Reminders() {
  const { data, loading } = useQuery(GET_REMINDERS, { fetchPolicy: 'network-only' });
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const refetch = { refetchQueries: [{ query: GET_REMINDERS }] };
  const [addReminder] = useMutation(ADD_REMINDER, refetch);
  const [toggleReminder] = useMutation(TOGGLE_REMINDER, refetch);
  const [deleteReminder] = useMutation(DELETE_REMINDER, refetch);
  const [editReminder] = useMutation(EDIT_REMINDER, refetch);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    await addReminder({ variables: { text: newText.trim() } });
    setNewText('');
  };

  const startEdit = (r) => { setEditingId(r.id); setEditValue(r.text); };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = async (id) => {
    if (editValue.trim()) await editReminder({ variables: { id, text: editValue.trim() } });
    setEditingId(null);
  };

  return (
    <section className="reminders">
      <h1>{ARROW} Reminders</h1>
      <div className="inner_cart">
        {loading ? <p>Loading...</p> : data?.myReminders.map(r => (
          <div key={r.id} className="task-item">
            <input
              type="checkbox"
              checked={r.done}
              onChange={() => toggleReminder({ variables: { id: r.id } })}
            />
            {editingId === r.id ? (
              <input
                className="edit-input"
                autoFocus
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={() => saveEdit(r.id)}
                onKeyDown={e => { if (e.key === 'Enter') saveEdit(r.id); if (e.key === 'Escape') cancelEdit(); }}
              />
            ) : (
              <span style={{ flex: 1, textDecoration: r.done ? 'line-through' : 'none' }}>{r.text}</span>
            )}
            <button className="edit-btn" onClick={() => startEdit(r)}>Edit</button>
            <button className="delete-item-btn" onClick={() => deleteReminder({ variables: { id: r.id } })}>{ICON_DELETE}</button>
          </div>
        ))}
        <form className="add-inline-form" onSubmit={handleAdd}>
          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="New reminder..."
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </section>
  );
}

function Dates() {
  const { data, loading } = useQuery(GET_PINNED_DATES, { fetchPolicy: 'network-only' });
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const refetch = { refetchQueries: [{ query: GET_PINNED_DATES }] };
  const [pinDate] = useMutation(PIN_DATE, refetch);
  const [editDate] = useMutation(EDIT_DATE, refetch);

  const startEdit = (d) => { setEditingId(d.id); setEditValue(d.text); };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = async (d) => {
    if (editValue.trim()) await editDate({ variables: { courseId: d.courseId, dateId: d.id, text: editValue.trim() } });
    setEditingId(null);
  };

  return (
    <section className="dates">
      <h1>{ARROW} Dates</h1>
      <div className="inner_cart">
        {loading ? <p>Loading...</p> : data?.myPinnedDates.length === 0 ? (
          <p>No pinned dates</p>
        ) : (
          data?.myPinnedDates.map(d => (
            <div key={d.id} className="task-item">
              {editingId === d.id ? (
                <input
                  className="edit-input"
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => saveEdit(d)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(d); if (e.key === 'Escape') cancelEdit(); }}
                />
              ) : (
                <span style={{ flex: 1 }}>{d.text} <small>({d.courseName})</small></span>
              )}
              <button className="edit-btn" onClick={() => startEdit(d)}>Edit</button>
              <button className="unpin-btn" onClick={() => pinDate({ variables: { courseId: d.courseId, dateId: d.id, pinned: false } })}>Unpin</button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function Dashboard() {
  return (
    <main id="dashboard">
      <Weather />
      <Quicklinks />
      <Tasks />
      <Reminders />
      <Dates />
    </main>
  );
}
