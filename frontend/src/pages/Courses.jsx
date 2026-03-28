import { Link, useParams } from "react-router";
import courses from "../data/courses";
import { ARROW } from "../utils/constants";
import "../css/Courses.css";

function SideBar({ id }) {
    return (
        <aside className="courses-sidebar">
            <Link to="/courses" className={!id ? "sidebar-active" : ""}><h2>ALL</h2></Link>
            <ul>
                {courses.map((c) => (
                    <li key={c.id}>
                        <Link
                            to={`/courses/${c.id}`}
                            className={id === c.id ? "sidebar-active" : ""}
                        >
                            {`${ARROW} ${c.name}`}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

function CourseGrid() {
    return (
        <main className="courses-grid">
            {courses.map((c) => (
                <Link key={c.id} to={`/courses/${c.id}`} className="course-card">
                    <img src={c.image} alt={c.name} />
                    <p>{c.name}</p>
                </Link>
            ))}
        </main>
    );
}

function CourseDetail({ course }) {
    return (
        <main className="course-detail">
            <div className="course-sections">
                <section className="course-section">
                    <h1>{ARROW} Dates</h1>
                    <ul>
                        {course.dates.map((date, i) => (
                            <li key={i}>{date}</li>
                        ))}
                    </ul>
                </section>

                <section className="course-section">
                    <h1>{ARROW} Tasks</h1>
                    <ul>
                        {course.tasks.map((task, i) => (
                            <li key={i}>{task}</li>
                        ))}
                    </ul>
                </section>

                <section className="course-section">
                    <h1>{ARROW} Liens importants</h1>
                    <ul>
                        {course.links.map((link, i) => (
                            <li key={i}>
                                <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}

export default function Courses() {
    const { id } = useParams();
    const course = courses.find((c) => c.id === id);

    return (
        <div id="courses">
            <SideBar id={id} />
            {course ? <CourseDetail course={course} /> : <CourseGrid />}
        </div>
    );
}
