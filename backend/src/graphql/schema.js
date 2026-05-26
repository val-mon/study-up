const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type CourseDate {
    id: ID!
    text: String!
    pinned: Boolean!
    courseId: ID!
    courseName: String!
  }

  type LinkItem {
    id: ID!
    label: String!
    url: String!
  }

  type Task {
    id: ID!
    title: String!
    done: Boolean!
    pinned: Boolean!
    courseId: ID!
    courseName: String!
  }

  type Reminder {
    id: ID!
    text: String!
    done: Boolean!
  }

  type Course {
    id: ID!
    slug: String!
    name: String!
    image: String!
    dates: [CourseDate!]!
    links: [LinkItem!]!
    tasks: [Task!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type QuickLink {
    id: ID!
    label: String!
    url: String!
  }

  type WeatherResult {
    city: String!
    temperature: Float!
    wind: Float!
  }

  type Query {
    me: User
    courses: [Course!]!
    course(slug: String!): Course
    myTasks(pinned: Boolean): [Task!]!
    myPinnedDates: [CourseDate!]!
    myReminders: [Reminder!]!
    myQuicklinks: [QuickLink!]!
    weather(city: String!): WeatherResult!
  }

  type Mutation {
    sendOTP(email: String!, name: String): Boolean!
    verifyOTP(email: String!, code: String!): AuthPayload!
    updateUser(name: String!): User!
    deleteUser: Boolean!
    addCourse(name: String!): Course!
    deleteCourse(id: ID!): Boolean!
    addDate(courseId: ID!, text: String!): CourseDate!
    deleteDate(courseId: ID!, dateId: ID!): Boolean!
    pinDate(courseId: ID!, dateId: ID!, pinned: Boolean!): CourseDate!
    editDate(courseId: ID!, dateId: ID!, text: String!): CourseDate!
    addLink(courseId: ID!, label: String!, url: String!): LinkItem!
    deleteLink(courseId: ID!, linkId: ID!): Boolean!
    editLink(courseId: ID!, linkId: ID!, label: String!, url: String!): LinkItem!
    addTask(courseId: ID!, title: String!): Task!
    toggleTask(id: ID!): Task!
    pinTask(id: ID!, pinned: Boolean!): Task!
    deleteTask(id: ID!): Boolean!
    editTask(id: ID!, title: String!): Task!
    addReminder(text: String!): Reminder!
    toggleReminder(id: ID!): Reminder!
    deleteReminder(id: ID!): Boolean!
    editReminder(id: ID!, text: String!): Reminder!
    addQuicklink(label: String!, url: String!): QuickLink!
    editQuicklink(id: ID!, label: String!, url: String!): QuickLink!
    deleteQuicklink(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
