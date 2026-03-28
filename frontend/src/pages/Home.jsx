import "../css/Home.css";

export default function Home() {
    return (
        <>
            <section className="hero">
                <h1>Don't Study Hard, Study Smart!</h1>
                <p>Maximize your learning efficiency with our smart study platform that helps you stay organized.
                    All the tools you need for a comfortable and productive study experience — all in one place.</p>
            </section>

            <section className="cards">
                <div className="card card-gray">
                    <div className="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                    </div>
                    <h2>Take Notes</h2>
                    <p>Keep track of important information with our intuitive note-taking feature. Organize by subject and find anything instantly.</p>
                </div>

                <div className="card card-purple">
                    <div className="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </div>
                    <h2>Track Your Progress</h2>
                    <p>Monitor your academic performance with a live grade table. Spot trends, set targets, and measure your improvement over time.</p>
                </div>

                <div className="card card-gray">
                    <div className="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                            <polyline points="16 7 22 7 22 13"/>
                        </svg>
                    </div>
                    <h2>Personalised Dashboard</h2>
                    <p>Easy access to a dashboard displaying weather, reminders, tasks, and key dates — everything relevant to your study needs.</p>
                </div>
            </section>
        </>
    )
}
