require('dotenv').config();
const { ObjectId } = require('mongodb');
const { connect, getDb, disconnect } = require('./src/utils/db');

const TARGET_EMAIL = 'vmonod5@gmail.com';

function newId() { return new ObjectId().toString(); }

const courses = [
  {
    slug: 'fstack',
    name: 'Full Stack',
    image: 'https://placehold.co/400x200?text=FS',
    dates: [
      { id: newId(), text: '01.06.26 : Rendu projet', pinned: true },
      { id: newId(), text: '15.06.26 : Examen final', pinned: false },
    ],
    links: [
      { id: newId(), label: 'ISC-Learn', url: 'https://isc.hevs.ch/learn/' },
      { id: newId(), label: 'IS-Academia', url: 'https://age.hes-so.ch/imoniteur_AGEP/!logins.htm' },
    ],
  },
  {
    slug: 'algo',
    name: 'Algorithmique',
    image: 'https://placehold.co/400x200?text=AL',
    dates: [
      { id: newId(), text: '03.06.26 : Examen mi-semestre', pinned: false },
      { id: newId(), text: '20.06.26 : Examen final', pinned: false },
    ],
    links: [
      { id: newId(), label: 'ISC-Learn', url: 'https://isc.hevs.ch/learn/' },
    ],
  },
  {
    slug: 'db',
    name: 'DataBase',
    image: 'https://placehold.co/400x200?text=DB',
    dates: [
      { id: newId(), text: '10.06.26 : Rendu TP', pinned: false },
      { id: newId(), text: '22.06.26 : Examen final', pinned: false },
    ],
    links: [
      { id: newId(), label: 'ISC-Learn', url: 'https://isc.hevs.ch/learn/' },
    ],
  },
];

async function bootstrap() {
  await connect();
  const db = getDb();

  await db.collection('otps').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  let user = await db.collection('users').findOne({ email: TARGET_EMAIL });
  if (!user) {
    const result = await db.collection('users').insertOne({
      name: 'Valentin',
      email: TARGET_EMAIL,
      createdAt: new Date(),
    });
    user = { _id: result.insertedId };
    console.log(`INFO : Created user (${TARGET_EMAIL})`);
  } else {
    console.log(`INFO : Found existing user (${TARGET_EMAIL})`);
  }

  const userId = user._id;

  await db.collection('courses').deleteMany({ userId });
  await db.collection('tasks').deleteMany({ userId });
  await db.collection('reminders').deleteMany({ userId });
  await db.collection('quicklinks').deleteMany({ userId });
  console.log('INFO : Cleared existing data for user');

  const coursesWithUser = courses.map(c => ({ ...c, userId }));
  const courseResult = await db.collection('courses').insertMany(coursesWithUser);
  const courseIds = Object.values(courseResult.insertedIds);
  console.log(`INFO : Inserted ${courseIds.length} courses`);

  const tasks = [
    { userId, courseId: courseIds[0], title: 'Finir le projet Full Stack', done: false, pinned: true, createdAt: new Date() },
    { userId, courseId: courseIds[0], title: 'Préparer la démo', done: false, pinned: false, createdAt: new Date() },
    { userId, courseId: courseIds[1], title: 'Réviser les arbres binaires', done: true, pinned: false, createdAt: new Date() },
    { userId, courseId: courseIds[1], title: 'Faire les exercices chapitre 5', done: false, pinned: true, createdAt: new Date() },
    { userId, courseId: courseIds[2], title: 'Rendre le TP MongoDB', done: false, pinned: false, createdAt: new Date() },
  ];
  await db.collection('tasks').insertMany(tasks);
  console.log(`INFO : Inserted ${tasks.length} tasks`);

  await db.collection('quicklinks').insertMany([
    { userId, label: 'ISC-Learn', url: 'https://isc.hevs.ch/learn/', createdAt: new Date() },
    { userId, label: 'IS-Academia', url: 'https://age.hes-so.ch/imoniteur_AGEP/!logins.htm', createdAt: new Date() },
    { userId, label: 'Intranet', url: 'https://hessoit.sharepoint.com/sites/VS-Intranet-HEI/SitePages/FormationITSystemesComm.aspx', createdAt: new Date() },
  ]);
  console.log('INFO : Inserted 3 quicklinks');

  console.log('INFO : Bootstrap complete');
  await disconnect();
}

bootstrap().catch((err) => {
  console.error('ERROR :', err.message);
  process.exit(1);
});
