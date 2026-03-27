import "../css/Dashboard.css";

function Weather() {
    return (
        <section className="weather">
            <h1>≻ Weather</h1>
            <div className="inner_cart">
                <ul>
                    <li>Temperature : 30°</li>
                    <li>Vent : 3 km/h</li>
                </ul>
            </div>
        </section>
    )
}

function Quicklinks() {
    return (
        <section className="quicklinks">
            <h1>≻ Quicklinks</h1>
            <div className="inner_cart">
                <ul>
                    <li>
                        <a
                            href="https://isc.hevs.ch/learn/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ISC-Learn
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://age.hes-so.ch/imoniteur_AGEP/!logins.htm?ww_x_urlAppelant=gestac.htm"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            IS-Academia
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://hessoit.sharepoint.com/sites/VS-Intranet-HEI/SitePages/FormationITSystemesComm.aspx"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Intranet
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    )
}

function Tasks() {
    return (
        <section className="tasks">
            <h1>≻ Tasks</h1>
            <div className="inner_cart">
                <label>
                    <input type="checkbox" name="task-1" defaultValue="done" required="" />
                    HTML
                </label>
                <label>
                    <input type="checkbox" data-id="65f8abc123" className="task-checkbox" />
                    Apprendre HTML
                </label>
            </div>
        </section>
    )
}

function Reminders() {
    <section className="reminders">
        <h1>≻ Reminders</h1>
        <div className="inner_cart">
            <ul>
                <li>Reminder1</li>
                <li>Reminder2</li>
            </ul>
        </div>
    </section>
}

function Dates() {
    return (
        < section className="dates" >
            <h1>≻ Dates</h1>
            <div className="inner_cart">
                <ul>
                    <li>01.06.26 : ...</li>
                    <li>02.06.26 : ...</li>
                </ul>
            </div>
        </section >
    )
}

export default function Dashboard() {
    return (
        <main id="dashboard">
            <Weather />
            <Quicklinks/>
            <Tasks />
            <Reminders />
            <Dates />
        </main>
    )
}
