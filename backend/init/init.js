// db-init.js
const { MongoClient, ObjectId } = require("mongodb");

// Configuration
const MONGO_URI =
  "mongodb+srv://viren0210:viren5976@cluster0.ubsqp.mongodb.net/twitterClone?retryWrites=true&w=majority&appName=Cluster0";

// Manual fake data
const users = [
  {
    _id: new ObjectId(),
    uid: "user_001",
    displayName: "John Developer",
    username: "johndev",
    email: "john@dev.com",
    password: "",
    bio: "Full-stack developer | React enthusiast",
    location: "San Francisco, CA",
    website: "https://johndev-portfolio.com",
    dob: new Date("1990-05-15"),
    avatar: "https://i.pravatar.cc/150?u=john_dev",
    verified: true,
    createdAt: new Date("2022-01-01"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_002",
    displayName: "Sarah Coder",
    username: "sarahcodes",
    email: "sarah@coder.com",
    password: "",
    bio: "Open source contributor | TypeScript lover",
    location: "New York, NY",
    website: "https://sarahcodes.dev",
    dob: new Date("1995-08-22"),
    avatar: "https://i.pravatar.cc/150?u=sarah_codes",
    verified: false,
    createdAt: new Date("2022-02-01"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_003",
    displayName: "Mike Backend",
    username: "mikebackend",
    email: "mike@backend.com",
    password: "",
    bio: "Node.js specialist | Database architect",
    location: "Austin, TX",
    website: "https://mikebackend.io",
    dob: new Date("1988-11-05"),
    avatar: "https://i.pravatar.cc/150?u=mike_backend",
    verified: true,
    createdAt: new Date("2021-12-15"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_004",
    displayName: "Emma Design",
    username: "emma_ui",
    email: "emma@design.com",
    password: "",
    bio: "UI/UX Designer | CSS Wizard",
    location: "London, UK",
    website: "https://emmadesign.dribbble.com",
    dob: new Date("1993-04-18"),
    avatar: "https://i.pravatar.cc/150?u=emma_design",
    verified: true,
    createdAt: new Date("2023-01-10"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_005",
    displayName: "Tech News",
    username: "technews",
    email: "news@tech.com",
    password: "",
    bio: "Latest in tech & programming",
    location: "Global",
    website: "https://technews.daily",
    dob: new Date("2000-01-01"),
    avatar: "https://i.pravatar.cc/150?u=tech_news",
    verified: true,
    createdAt: new Date("2020-05-01"),
    __v: 0,
  },

  {
    _id: new ObjectId(),
    uid: "user_006",
    displayName: "Lena Frontend",
    username: "lena_react",
    email: "lena@frontend.com",
    password: "",
    bio: "React & Vue expert | Frontend architect",
    location: "Berlin, Germany",
    website: "https://lenafrontend.dev",
    dob: new Date("1992-07-12"),
    avatar: "https://i.pravatar.cc/150?u=lena_frontend",
    verified: true,
    createdAt: new Date("2023-03-01"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_007",
    displayName: "DevOps Dan",
    username: "devops_dan",
    email: "dan@devops.com",
    password: "",
    bio: "Kubernetes enthusiast | Cloud infrastructure specialist",
    location: "Seattle, WA",
    website: "https://devopsdan.io",
    dob: new Date("1985-09-30"),
    avatar: "https://i.pravatar.cc/150?u=devops_dan",
    verified: true,
    createdAt: new Date("2021-11-20"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_008",
    displayName: "Mobile Marie",
    username: "mobile_dev",
    email: "marie@mobile.com",
    password: "",
    bio: "React Native guru 📱 | Cross-platform expert",
    location: "Toronto, Canada",
    website: "https://mariemobile.app",
    dob: new Date("1994-03-22"),
    avatar: "https://i.pravatar.cc/150?u=mobile_marie",
    verified: false,
    createdAt: new Date("2023-05-15"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_009",
    displayName: "Python Pete",
    username: "python_pete",
    email: "pete@python.com",
    password: "",
    bio: "Django & Flask specialist 🐍 | Python core contributor",
    location: "Austin, TX",
    website: "https://pythonpete.dev",
    dob: new Date("1987-12-01"),
    avatar: "https://i.pravatar.cc/150?u=python_pete",
    verified: true,
    createdAt: new Date("2020-08-01"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_010",
    displayName: "Data Daisy",
    username: "data_science",
    email: "daisy@data.com",
    password: "",
    bio: "ML engineer | TensorFlow contributor 📊",
    location: "Boston, MA",
    website: "https://datadaisy.ai",
    dob: new Date("1991-06-18"),
    avatar: "https://i.pravatar.cc/150?u=data_daisy",
    verified: true,
    createdAt: new Date("2022-09-10"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_011",
    displayName: "Security Sam",
    username: "sec_sam",
    email: "sam@security.com",
    password: "",
    bio: "Cybersecurity expert 🔒 | Ethical hacker",
    location: "Tel Aviv, Israel",
    website: "https://secsam.com",
    dob: new Date("1983-04-09"),
    avatar: "https://i.pravatar.cc/150?u=security_sam",
    verified: true,
    createdAt: new Date("2019-07-01"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_012",
    displayName: "Cloud Clara",
    username: "cloud_clara",
    email: "clara@cloud.com",
    password: "",
    bio: "AWS Solutions Architect | Multi-cloud specialist ☁️",
    location: "Sydney, Australia",
    website: "https://cloudclara.dev",
    dob: new Date("1989-11-25"),
    avatar: "https://i.pravatar.cc/150?u=cloud_clara",
    verified: true,
    createdAt: new Date("2022-04-15"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_013",
    displayName: "Tech Teacher",
    username: "code_mentor",
    email: "teach@tech.com",
    password: "",
    bio: "Helping developers level up 🚀 | Course creator",
    location: "Remote",
    website: "https://teachtech.io",
    dob: new Date("1980-02-14"),
    avatar: "https://i.pravatar.cc/150?u=tech_teacher",
    verified: true,
    createdAt: new Date("2018-03-01"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_014",
    displayName: "Open Source Olivia",
    username: "oss_olivia",
    email: "olivia@opensource.com",
    password: "",
    bio: "Open source maintainer | Community builder 🤝",
    location: "Stockholm, Sweden",
    website: "https://ossolivia.dev",
    dob: new Date("1996-08-08"),
    avatar: "https://i.pravatar.cc/150?u=open_source_olivia",
    verified: false,
    createdAt: new Date("2023-02-28"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_015",
    displayName: "VR Victor",
    username: "vr_dev",
    email: "victor@vr.com",
    password: "",
    bio: "AR/VR developer | Unity expert 🕶️",
    location: "Tokyo, Japan",
    website: "https://victorvr.dev",
    dob: new Date("1995-01-05"),
    avatar: "https://i.pravatar.cc/150?u=vr_victor",
    verified: true,
    createdAt: new Date("2021-06-01"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_016",
    displayName: "Startup Stella",
    username: "startup_stella",
    email: "stella@startup.com",
    password: "",
    bio: "Tech entrepreneur | SaaS founder 💡",
    location: "San Francisco, CA",
    website: "https://startupstella.io",
    dob: new Date("1988-07-19"),
    avatar: "https://i.pravatar.cc/150?u=startup_stella",
    verified: true,
    createdAt: new Date("2020-01-15"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_017",
    displayName: "Game Dev Greg",
    username: "game_dev",
    email: "greg@games.com",
    password: "",
    bio: "Unreal Engine specialist 🎮 | 3D graphics",
    location: "Los Angeles, CA",
    website: "https://gamedevgreg.com",
    dob: new Date("1993-09-27"),
    avatar: "https://i.pravatar.cc/150?u=game_dev_greg",
    verified: false,
    createdAt: new Date("2023-07-01"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_018",
    displayName: "QA Queen",
    username: "qa_expert",
    email: "qa@testing.com",
    password: "",
    bio: "Automation testing guru | Cypress contributor 🧪",
    location: "Bangalore, India",
    website: "https://qaqueen.io",
    dob: new Date("1990-12-12"),
    avatar: "https://i.pravatar.cc/150?u=qa_queen",
    verified: true,
    createdAt: new Date("2022-08-01"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_019",
    displayName: "Rustacean Rick",
    username: "rust_dev",
    email: "rick@rust.com",
    password: "",
    bio: "Rust evangelist 🦀 | Systems programming",
    location: "Zurich, Switzerland",
    website: "https://rustacean.rick",
    dob: new Date("1984-06-30"),
    avatar: "https://i.pravatar.cc/150?u=rust_rick",
    verified: true,
    createdAt: new Date("2021-09-01"),
    __v: 0,
  },
  {
    _id: new ObjectId(),
    uid: "user_020",
    displayName: "AI Alice",
    username: "ai_alice",
    email: "alice@ai.com",
    password: "",
    bio: "Generative AI researcher 🤖 | MLops",
    location: "Paris, France",
    website: "https://aialice.org",
    dob: new Date("1997-04-17"),
    avatar: "https://i.pravatar.cc/150?u=ai_alice",
    verified: true,
    createdAt: new Date("2023-04-01"),
    __v: 0,
  },
];

// Add user info method to new users

// Combine with original users array

// Add user info method before using it
users.forEach((user) => {
  user.userInfo = () => ({
    displayName: user.displayName,
    username: user.username,
    avatar: user.avatar,
    verified: user.verified,
  });
});
const tweets = [
  // User 1 Tweets
  {
    user: users[0].userInfo(),
    text: "Just launched my new React project! 🚀 #webdev",
    image: "https://picsum.photos/600/400?random=1",
    likes: 142,
    retweets: 23,
    replies: 15,
    isRetweet: false,
    timestamp: new Date("2024-03-15T09:30:00Z"),
  },
  {
    user: users[0].userInfo(),
    text: "Anyone else excited about React Server Components? 🤔",
    image: "https://picsum.photos/600/400?random=2",
    likes: 234,
    retweets: 45,
    replies: 89,
    isRetweet: false,
    timestamp: new Date("2024-03-14T15:30:00Z"),
  },

  // User 2 Tweets
  {
    user: users[1].userInfo(),
    text: "TypeScript + React = ❤️\n\n// Why I love type safety",
    image: "https://picsum.photos/600/400?random=3",
    likes: 892,
    retweets: 156,
    replies: 84,
    isRetweet: false,
    timestamp: new Date("2024-03-15T08:45:00Z"),
  },
  {
    user: users[1].userInfo(),
    text: "Just published a new open-source library! 🎉\n\nCheck out TS-Utils for helpful TypeScript helpers",
    image: "https://picsum.photos/600/400?random=4",
    likes: 345,
    retweets: 89,
    replies: 45,
    isRetweet: false,
    timestamp: new Date("2024-03-14T11:20:00Z"),
  },

  // User 3 Tweets
  {
    user: users[2].userInfo(),
    text: "Node.js 20 released! 🎉\n\nLoving the new features - especially the stable test runner",
    image: "https://picsum.photos/600/400?random=5",
    likes: 1204,
    retweets: 356,
    replies: 234,
    isRetweet: false,
    timestamp: new Date("2024-03-15T10:15:00Z"),
  },
  {
    user: users[2].userInfo(),
    text: "Database optimization tips thread 🧵\n1. Indexing\n2. Query optimization\n3. Caching\n...",
    image: "https://picsum.photos/600/400?random=6",
    likes: 845,
    retweets: 289,
    replies: 156,
    isRetweet: false,
    timestamp: new Date("2024-03-14T16:45:00Z"),
  },

  // User 4 Tweets
  {
    user: users[3].userInfo(),
    text: "CSS Grid vs Flexbox - when to use which? 🤔\nVisual guide coming soon!",
    image: "https://picsum.photos/600/400?random=7",
    likes: 1567,
    retweets: 489,
    replies: 256,
    isRetweet: false,
    timestamp: new Date("2024-03-15T07:30:00Z"),
  },
  {
    user: users[3].userInfo(),
    text: "New design system components library released! 🎨\nBuilt with Storybook & React",
    image: "https://picsum.photos/600/400?random=8",
    likes: 945,
    retweets: 345,
    replies: 189,
    isRetweet: false,
    timestamp: new Date("2024-03-14T12:00:00Z"),
  },

  // User 5 Tweets
  {
    user: users[4].userInfo(),
    text: "Breaking: New JavaScript framework released - but do we really need another one? 😅",
    image: "https://picsum.photos/600/400?random=9",
    likes: 2345,
    retweets: 678,
    replies: 492,
    isRetweet: false,
    timestamp: new Date("2024-03-15T06:00:00Z"),
  },
  {
    user: users[4].userInfo(),
    text: "AI in web development - threat or opportunity? 🤖\nDiscussing latest trends",
    image: "https://picsum.photos/600/400?random=10",
    likes: 1789,
    retweets: 567,
    replies: 345,
    isRetweet: false,
    timestamp: new Date("2024-03-14T09:15:00Z"),
  },

  // Original 5 Users (15 tweets)
  // User 1 - John Developer (React)
  {
    user: users[0].userInfo(),
    text: "Just launched my new React project! 🚀 #webdev",
    image: "https://picsum.photos/600/400?random=1",
    likes: 142,
    retweets: 23,
    replies: 15,
    isRetweet: false,
    timestamp: new Date("2024-03-15T09:30:00Z"),
  },
  {
    user: users[0].userInfo(),
    text: "Anyone else excited about React Server Components? 🤔",
    image: "https://picsum.photos/600/400?random=2",
    likes: 234,
    retweets: 45,
    replies: 89,
    isRetweet: false,
    timestamp: new Date("2024-03-14T15:30:00Z"),
  },
  {
    user: users[0].userInfo(),
    text: "State management in 2024: Context API vs Zustand vs Redux? 🔄",
    image: "https://picsum.photos/600/400?random=3",
    likes: 567,
    retweets: 89,
    replies: 123,
    isRetweet: false,
    timestamp: new Date("2024-03-13T11:15:00Z"),
  },

  // User 2 - Sarah Coder (TypeScript)
  {
    user: users[1].userInfo(),
    text: "TypeScript + React = ❤️\n\n// Why I love type safety",
    image: "https://picsum.photos/600/400?random=4",
    likes: 892,
    retweets: 156,
    replies: 84,
    isRetweet: false,
    timestamp: new Date("2024-03-15T08:45:00Z"),
  },
  {
    user: users[1].userInfo(),
    text: "Just published TS-Utils - TypeScript helpers library! 🎉",
    image: "https://picsum.photos/600/400?random=5",
    likes: 345,
    retweets: 89,
    replies: 45,
    isRetweet: false,
    timestamp: new Date("2024-03-14T11:20:00Z"),
  },
  {
    user: users[1].userInfo(),
    text: "TypeScript 5.3 feature preview: What are you most excited about? 🔍",
    image: "https://picsum.photos/600/400?random=6",
    likes: 678,
    retweets: 145,
    replies: 92,
    isRetweet: false,
    timestamp: new Date("2024-03-13T14:30:00Z"),
  },

  // Continue this pattern for all 20 users...

  // User 6 - Lena Frontend (React/Vue)
  {
    user: users[5].userInfo(),
    text: "Vue 3.4 Composition API improvements are game-changing! 🎮",
    image: "https://picsum.photos/600/400?random=19",
    likes: 789,
    retweets: 156,
    replies: 89,
    isRetweet: false,
    timestamp: new Date("2024-03-14T14:00:00Z"),
  },
  {
    user: users[5].userInfo(),
    text: "Micro-frontends architecture deep dive 🧵 (1/5)",
    image: "https://picsum.photos/600/400?random=20",
    likes: 1204,
    retweets: 345,
    replies: 167,
    isRetweet: false,
    timestamp: new Date("2024-03-13T11:30:00Z"),
  },
  {
    user: users[5].userInfo(),
    text: "React vs Vue in 2024 - which would you choose for a new project? 🤔",
    image: "https://picsum.photos/600/400?random=21",
    likes: 1567,
    retweets: 489,
    replies: 345,
    isRetweet: false,
    timestamp: new Date("2024-03-12T09:15:00Z"),
  },

  // User 7 - DevOps Dan
  {
    user: users[6].userInfo(),
    text: "Kubernetes 1.29 upgrade strategies 🚢",
    image: "https://picsum.photos/600/400?random=22",
    likes: 892,
    retweets: 234,
    replies: 78,
    isRetweet: false,
    timestamp: new Date("2024-03-15T16:20:00Z"),
  },
  {
    user: users[6].userInfo(),
    text: "Automated CI/CD pipeline with GitHub Actions 🤖 #devops",
    image: "https://picsum.photos/600/400?random=23",
    likes: 1456,
    retweets: 456,
    replies: 123,
    isRetweet: false,
    timestamp: new Date("2024-03-14T09:45:00Z"),
  },
  {
    user: users[6].userInfo(),
    text: "Terraform vs Pulumi - infrastructure as code showdown ⚔️",
    image: "https://picsum.photos/600/400?random=24",
    likes: 2345,
    retweets: 567,
    replies: 289,
    isRetweet: false,
    timestamp: new Date("2024-03-13T13:00:00Z"),
  },

  // User 8 - Mobile Marie
  {
    user: users[7].userInfo(),
    text: "React Native vs Flutter 2024 comparison 📱",
    image: "https://picsum.photos/600/400?random=25",
    likes: 2345,
    retweets: 678,
    replies: 345,
    isRetweet: false,
    timestamp: new Date("2024-03-15T12:30:00Z"),
  },
  {
    user: users[7].userInfo(),
    text: "Achieved 60 FPS animations in our mobile app 🚀",
    image: "https://picsum.photos/600/400?random=26",
    likes: 1567,
    retweets: 489,
    replies: 256,
    isRetweet: false,
    timestamp: new Date("2024-03-14T10:15:00Z"),
  },
  {
    user: users[7].userInfo(),
    text: "Mobile performance optimization toolkit thread 🧰 (1/7)",
    image: "https://picsum.photos/600/400?random=27",
    likes: 1890,
    retweets: 567,
    replies: 234,
    isRetweet: false,
    timestamp: new Date("2024-03-13T08:00:00Z"),
  },

  // Continue this pattern for remaining users...

  // User 20 - AI Alice
  {
    user: users[19].userInfo(),
    text: "Exploring GPT-5 capabilities for code generation 🤖",
    image: "https://picsum.photos/600/400?random=60",
    likes: 2890,
    retweets: 789,
    replies: 456,
    isRetweet: false,
    timestamp: new Date("2024-03-15T07:00:00Z"),
  },
  {
    user: users[19].userInfo(),
    text: "Ethical AI development principles 🛡️",
    image: "https://picsum.photos/600/400?random=61",
    likes: 3456,
    retweets: 890,
    replies: 567,
    isRetweet: false,
    timestamp: new Date("2024-03-14T12:30:00Z"),
  },
  {
    user: users[19].userInfo(),
    text: "Machine Learning Ops (MLOps) best practices 📊",
    image: "https://picsum.photos/600/400?random=62",
    likes: 2345,
    retweets: 678,
    replies: 345,
    isRetweet: false,
    timestamp: new Date("2024-03-13T09:45:00Z"),
  },
];

// Add timestamps

// Add user info method
// users.forEach((user) => {
//   user.userInfo = () => ({
//     displayName: user.displayName,
//     username: user.username,
//     avatar: user.avatar,
//     verified: user.verified,
//   });
// });

// Add createdAt/updatedAt to tweets
tweets.forEach((tweet) => {
  tweet.createdAt = new Date();
  tweet.updatedAt = new Date();
});

async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // Clear existing data
    await db.collection("users").deleteMany({});
    await db.collection("tweets").deleteMany({});

    // Insert new data
    const usersResult = await db.collection("users").insertMany(users);
    const tweetsResult = await db.collection("tweets").insertMany(tweets);

    console.log(`Inserted ${usersResult.insertedCount} users`);
    console.log(`Inserted ${tweetsResult.insertedCount} tweets`);
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    await client.close();
  }
}

main();
