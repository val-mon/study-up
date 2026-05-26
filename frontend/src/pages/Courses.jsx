import { useState, useRef, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { ARROW, ICON_DELETE } from '../utils/constants';
import '../css/Courses.css';

const GET_COURSES = gql`
  query GetCourses {
    courses { id slug name image }
  }
`;

const GET_COURSE = gql`
  query GetCourse($slug: String!) {
    course(slug: $slug) {
      id slug name image
      dates { id text pinned }
      links { id label url }
      tasks { id title done pinned }
    }
  }
`;

const ADD_COURSE = gql`
  mutation AddCourse($name: String!) {
    addCourse(name: $name) { id slug name image }
  }
`;

const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

const ADD_DATE = gql`
  mutation AddDate($courseId: ID!, $text: String!) {
    addDate(courseId: $courseId, text: $text) { id text pinned }
  }
`;

const DELETE_DATE = gql`
  mutation DeleteDate($courseId: ID!, $dateId: ID!) {
    deleteDate(courseId: $courseId, dateId: $dateId)
  }
`;

const PIN_DATE = gql`
  mutation PinDate($courseId: ID!, $dateId: ID!, $pinned: Boolean!) {
    pinDate(courseId: $courseId, dateId: $dateId, pinned: $pinned) { id pinned }
  }
`;

const ADD_LINK = gql`
  mutation AddLink($courseId: ID!, $label: String!, $url: String!) {
    addLink(courseId: $courseId, label: $label, url: $url) { id label url }
  }
`;

const DELETE_LINK = gql`
  mutation DeleteLink($courseId: ID!, $linkId: ID!) {
    deleteLink(courseId: $courseId, linkId: $linkId)
  }
`;

const ADD_TASK = gql`
  mutation AddTask($courseId: ID!, $title: String!) {
    addTask(courseId: $courseId, title: $title) { id title done pinned }
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

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const EDIT_TASK = gql`
  mutation EditTask($id: ID!, $title: String!) {
    editTask(id: $id, title: $title) { id title }
  }
`;

const EDIT_DATE = gql`
  mutation EditDate($courseId: ID!, $dateId: ID!, $text: String!) {
    editDate(courseId: $courseId, dateId: $dateId, text: $text) { id text }
  }
`;

const EDIT_LINK = gql`
  mutation EditLink($courseId: ID!, $linkId: ID!, $label: String!, $url: String!) {
    editLink(courseId: $courseId, linkId: $linkId, label: $label, url: $url) { id label url }
  }
`;

function SideBar({ slug }) {
  const { data } = useQuery(GET_COURSES);
  return (
    <aside className="courses-sidebar">
      <Link to="/courses" className={!slug ? 'sidebar-active' : ''} onClick={() => localStorage.removeItem('lastCourse')}><h2>ALL</h2></Link>
      <ul>
        {data?.courses.map(c => (
          <li key={c.id}>
            <Link to={`/courses/${c.slug}`} className={slug === c.slug ? 'sidebar-active' : ''}>
              {`${ARROW} ${c.name}`}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function CourseGrid() {
  const { data, loading } = useQuery(GET_COURSES);
  const [newCourseName, setNewCourseName] = useState('');
  const [addCourse] = useMutation(ADD_COURSE, { refetchQueries: [{ query: GET_COURSES }] });
  const [deleteCourse] = useMutation(DELETE_COURSE, { refetchQueries: [{ query: GET_COURSES }] });

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    await addCourse({ variables: { name: newCourseName.trim() } });
    setNewCourseName('');
  };

  if (loading) return <main className="courses-grid"><p>Loading...</p></main>;
  return (
    <main className="courses-grid">
      {data?.courses.map(c => (
        <div key={c.id} className="course-card-wrapper">
          <Link to={`/courses/${c.slug}`} className="course-card">
            <img src={c.image} alt={c.name} />
            <p>{c.name}</p>
          </Link>
          <button className="delete-course-btn" onClick={() => deleteCourse({ variables: { id: c.id } })}>{ICON_DELETE}</button>
        </div>
      ))}
      <form className="add-course-form" onSubmit={handleAddCourse}>
        <input
          type="text"
          value={newCourseName}
          onChange={e => setNewCourseName(e.target.value)}
          placeholder="New course..."
        />
        <button type="submit">Add</button>
      </form>
    </main>
  );
}

function CourseDetail({ slug }) {
  const { data, loading } = useQuery(GET_COURSE, { variables: { slug } });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDateText, setNewDateText] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const taskInputRef = useRef(null);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editLinkLabel, setEditLinkLabel] = useState('');
  const [editLinkUrl, setEditLinkUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('lastCourse', slug);
  }, [slug]);

  const refetch = { refetchQueries: [{ query: GET_COURSE, variables: { slug } }] };
  const refetchWithDashboard = { refetchQueries: [{ query: GET_COURSE, variables: { slug } }, 'GetPinnedTasks', 'GetPinnedDates'] };

  const [addTask] = useMutation(ADD_TASK, refetch);
  const [toggleTask] = useMutation(TOGGLE_TASK, refetchWithDashboard);
  const [pinTask] = useMutation(PIN_TASK, refetchWithDashboard);
  const [deleteTask] = useMutation(DELETE_TASK, refetchWithDashboard);
  const [editTask] = useMutation(EDIT_TASK, refetch);

  const [addDate] = useMutation(ADD_DATE, refetch);
  const [deleteDate] = useMutation(DELETE_DATE, refetchWithDashboard);
  const [pinDate] = useMutation(PIN_DATE, refetchWithDashboard);
  const [editDate] = useMutation(EDIT_DATE, refetchWithDashboard);

  const [addLink] = useMutation(ADD_LINK, refetch);
  const [deleteLink] = useMutation(DELETE_LINK, refetch);
  const [editLink] = useMutation(EDIT_LINK, refetch);

  const startEdit = (id, value) => { setEditingId(id); setEditValue(value); };
  const startEditLink = (link) => { setEditingId(link.id); setEditLinkLabel(link.label); setEditLinkUrl(link.url); };
  const cancelEdit = () => setEditingId(null);
  const saveTask = async (id) => {
    if (editValue.trim()) await editTask({ variables: { id, title: editValue.trim() } });
    setEditingId(null);
  };
  const saveDate = async (courseId, dateId) => {
    if (editValue.trim()) await editDate({ variables: { courseId, dateId, text: editValue.trim() } });
    setEditingId(null);
  };
  const saveLink = async (courseId, linkId) => {
    if (editLinkLabel.trim() && editLinkUrl.trim()) await editLink({ variables: { courseId, linkId, label: editLinkLabel.trim(), url: editLinkUrl.trim() } });
    setEditingId(null);
  };

  if (loading) return <main className="course-detail"><p>Loading...</p></main>;
  const course = data?.course;
  if (!course) {
    localStorage.removeItem('lastCourse');
    return <Navigate to="/courses" />;
  }

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask({ variables: { courseId: course.id, title: newTaskTitle.trim() } });
    setNewTaskTitle('');
    taskInputRef.current?.focus();
  };

  const handleAddDate = async (e) => {
    e.preventDefault();
    if (!newDateText.trim()) return;
    await addDate({ variables: { courseId: course.id, text: newDateText.trim() } });
    setNewDateText('');
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    await addLink({ variables: { courseId: course.id, label: newLinkLabel.trim(), url: newLinkUrl.trim() } });
    setNewLinkLabel('');
    setNewLinkUrl('');
  };

  return (
    <main className="course-detail">
      <div className="course-sections">

        <section className="course-section">
          <h1>{ARROW} Dates</h1>
          <ul>
            {course.dates.map(date => (
              <li key={date.id} className="task-item">
                {editingId === date.id ? (
                  <input
                    className="edit-input"
                    autoFocus
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => saveDate(course.id, date.id)}
                    onKeyDown={e => { if (e.key === 'Enter') saveDate(course.id, date.id); if (e.key === 'Escape') cancelEdit(); }}
                  />
                ) : (
                  <span style={{ flex: 1 }}>{date.text}</span>
                )}
                <button className="edit-btn" onClick={() => startEdit(date.id, date.text)}>Edit</button>
                <button
                  className={`pin-btn ${date.pinned ? 'pinned' : ''}`}
                  onClick={() => pinDate({ variables: { courseId: course.id, dateId: date.id, pinned: !date.pinned } })}
                >
                  {date.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button className="delete-btn" onClick={() => deleteDate({ variables: { courseId: course.id, dateId: date.id } })}>{ICON_DELETE}</button>
              </li>
            ))}
          </ul>
          <form className="add-task-form" onSubmit={handleAddDate}>
            <input
              type="text"
              value={newDateText}
              onChange={e => setNewDateText(e.target.value)}
              placeholder="New date..."
            />
            <button type="submit">Add</button>
          </form>
        </section>

        <section className="course-section course-section-tasks">
          <h1>{ARROW} Tasks</h1>
          <ul>
            {course.tasks.map(task => (
              <li key={task.id} className="task-item">
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
                    onBlur={() => saveTask(task.id)}
                    onKeyDown={e => { if (e.key === 'Enter') saveTask(task.id); if (e.key === 'Escape') cancelEdit(); }}
                  />
                ) : (
                  <span style={{ flex: 1, textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</span>
                )}
                <button className="edit-btn" onClick={() => startEdit(task.id, task.title)}>Edit</button>
                <button
                  className={`pin-btn ${task.pinned ? 'pinned' : ''}`}
                  onClick={() => pinTask({ variables: { id: task.id, pinned: !task.pinned } })}
                >
                  {task.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button className="delete-btn" onClick={() => deleteTask({ variables: { id: task.id } })}>{ICON_DELETE}</button>
              </li>
            ))}
          </ul>
          <form className="add-task-form" onSubmit={handleAddTask}>
            <input
              ref={taskInputRef}
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="New task..."
            />
            <button type="submit">Add</button>
          </form>
        </section>

        <section className="course-section">
          <h1>{ARROW} Links</h1>
          <ul>
            {course.links.map(link => (
              <li key={link.id} className="task-item">
                {editingId === link.id ? (
                  <>
                    <input
                      className="edit-input"
                      autoFocus
                      value={editLinkLabel}
                      onChange={e => setEditLinkLabel(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveLink(course.id, link.id); if (e.key === 'Escape') cancelEdit(); }}
                      placeholder="Label..."
                    />
                    <input
                      className="edit-input"
                      value={editLinkUrl}
                      onChange={e => setEditLinkUrl(e.target.value)}
                      onBlur={() => saveLink(course.id, link.id)}
                      onKeyDown={e => { if (e.key === 'Enter') saveLink(course.id, link.id); if (e.key === 'Escape') cancelEdit(); }}
                      placeholder="https://..."
                    />
                  </>
                ) : (
                  <a href={link.url} target="_blank" rel="noreferrer" style={{ flex: 1 }}>{link.label}</a>
                )}
                <button className="edit-btn" onClick={() => startEditLink(link)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteLink({ variables: { courseId: course.id, linkId: link.id } })}>{ICON_DELETE}</button>
              </li>
            ))}
          </ul>
          <form className="add-link-form" onSubmit={handleAddLink}>
            <input
              type="text"
              value={newLinkLabel}
              onChange={e => setNewLinkLabel(e.target.value)}
              placeholder="Label..."
            />
            <input
              type="url"
              value={newLinkUrl}
              onChange={e => setNewLinkUrl(e.target.value)}
              placeholder="https://..."
            />
            <button type="submit">Add</button>
          </form>
        </section>

      </div>
    </main>
  );
}

export default function Courses() {
  const { slug } = useParams();
  const lastCourse = localStorage.getItem('lastCourse');

  if (!slug && lastCourse) {
    return <Navigate to={`/courses/${lastCourse}`} />;
  }

  return (
    <div id="courses">
      <SideBar slug={slug} />
      {slug ? <CourseDetail slug={slug} /> : <CourseGrid />}
    </div>
  );
}
